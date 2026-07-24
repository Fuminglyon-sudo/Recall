"use client";

import { useRef, useState } from "react";
import {
  ArrowLeft,
  FileText,
  Loader2,
  Lightbulb,
  MessageSquareQuote,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Mic,
  Presentation,
} from "lucide-react";
import {
  SAMPLE_DOCS,
  TOPIC_LABELS,
  DOC_TOPICS,
  type DocTopic,
  type SampleDoc,
} from "@/lib/doc-review-samples";

type Mode = "commenter" | "presenter";

type DocQuestion = {
  lens: string;
  issue: string;
  question: string;
  severity: "major" | "moderate" | "minor";
};

type DocReviewResult = {
  detectionScore: number;
  caught: string[];
  missed: DocQuestion[];
  topQuestions: DocQuestion[];
  judgmentNote: string;
  raisingTip: string;
  reviewedByAI: boolean;
};

type PresenterFinalResult = {
  summaryScore: number;
  answerScore: number;
  overallScore: number;
  strengths: string[];
  improvements: string[];
  idealFollowUpAnswer: string;
  reviewedByAI: boolean;
};

type ActiveDoc = {
  title: string;
  body: string;
  isOwn: boolean;
  sampleDocId?: string;
  topic?: DocTopic;
};

type RecordingTarget = "notes" | "answer";

const TOPIC_COLORS: Record<DocTopic, string> = {
  workplace: "border-violet-300/20 bg-violet-400/10 text-violet-200",
  economics: "border-emerald-300/20 bg-emerald-400/10 text-emerald-200",
  politics: "border-sky-300/20 bg-sky-400/10 text-sky-200",
  social: "border-amber-300/20 bg-amber-400/10 text-amber-200",
  tech: "border-rose-300/20 bg-rose-400/10 text-rose-200",
  health: "border-teal-300/20 bg-teal-400/10 text-teal-200",
  entertainment: "border-fuchsia-300/20 bg-fuchsia-400/10 text-fuchsia-200",
};

const SEVERITY_STYLE: Record<DocQuestion["severity"], string> = {
  major: "border-red-400/25 bg-red-400/10 text-red-300",
  moderate: "border-amber-400/25 bg-amber-400/10 text-amber-300",
  minor: "border-slate-400/20 bg-white/5 text-slate-400",
};

const MIN_DOC_CHARS = 200;

export function DocLabClient() {
  const [mode, setMode] = useState<Mode>("commenter");
  const [phase, setPhase] = useState<"pick" | "read" | "answering" | "results">("pick");
  const [topicFilter, setTopicFilter] = useState<DocTopic | "all">("all");
  const [activeDoc, setActiveDoc] = useState<ActiveDoc | null>(null);
  const [pasted, setPasted] = useState("");
  const [notes, setNotes] = useState(""); // "what would you raise" (commenter) or "your summary" (presenter)
  const [followUpQuestion, setFollowUpQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<DocReviewResult | null>(null);
  const [presenterResult, setPresenterResult] = useState<PresenterFinalResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [micError, setMicError] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const fieldBeforeRecording = useRef("");
  const recordingTargetRef = useRef<RecordingTarget>("notes");

  // Groq mic mode — a fast batch Whisper endpoint, not true low-latency
  // streaming (Groq doesn't offer that for audio). "Live" is simulated by
  // cutting the recording into segments on natural pauses in speech and
  // transcribing each one as it completes, so text appears every time the
  // user pauses rather than only once at the very end.
  const groqMicEnabled = process.env.NEXT_PUBLIC_DOC_LAB_GROQ_MIC === "true";
  const usingGroqRef = useRef(false);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const stoppingRef = useRef(false);
  const hasSpokenRef = useRef(false);
  const silenceTimerRef = useRef<number | null>(null);
  const chunkSeqRef = useRef(0);
  // Chunks resolve over the network in whatever order they finish — chaining
  // each append onto this promise keeps transcribed text appearing in the
  // order the person actually said it, not the order the responses arrived.
  const appendQueueRef = useRef<Promise<void>>(Promise.resolve());

  const SILENCE_THRESHOLD = 12;
  const SILENCE_DURATION_MS = 1300;

  const shown = topicFilter === "all" ? SAMPLE_DOCS : SAMPLE_DOCS.filter((d) => d.topic === topicFilter);

  function targetSetter(): (updater: (current: string) => string) => void {
    return recordingTargetRef.current === "answer" ? setAnswer : setNotes;
  }

  function appendTranscript(text: string) {
    const setter = targetSetter();
    setter((current) => {
      const base = current.trim();
      return base ? `${base} ${text}` : text;
    });
  }

  function startRecording(target: RecordingTarget = "notes") {
    setMicError("");
    recordingTargetRef.current = target;
    const groqSupported =
      groqMicEnabled &&
      typeof navigator !== "undefined" &&
      !!navigator.mediaDevices?.getUserMedia &&
      typeof MediaRecorder !== "undefined";
    usingGroqRef.current = groqSupported;
    if (groqSupported) {
      void startGroqRecording();
    } else {
      startBrowserRecording();
    }
  }

  function stopRecording() {
    if (usingGroqRef.current) {
      stopGroqRecording();
    } else {
      stopBrowserRecording();
    }
  }

  // ── Browser SpeechRecognition fallback ─────────────────────────────────
  function startBrowserRecording() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (!SR) {
      setMicError("Live dictation needs Chrome or Edge. Type instead.");
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new SR() as any;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    const current = recordingTargetRef.current === "answer" ? answer : notes;
    fieldBeforeRecording.current = current.trim();
    let final = "";
    const setter = targetSetter();
    recognition.onresult = (event: { resultIndex: number; results: { isFinal: boolean; 0: { transcript: string } }[] }) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) final += event.results[i][0].transcript + " ";
        else interim += event.results[i][0].transcript;
      }
      const base = fieldBeforeRecording.current;
      setter(() => (base ? `${base} ${final}${interim}` : `${final}${interim}`));
    };
    recognition.onerror = () => setMicError("Microphone access denied or speech recognition unavailable.");
    recognition.onend = () => setRecording(false);
    recognition.start();
    recognitionRef.current = recognition;
    setRecording(true);
  }

  function stopBrowserRecording() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setRecording(false);
  }

  // ── Groq Whisper mic mode ───────────────────────────────────────────────
  async function startGroqRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Ctx = window.AudioContext ?? (window as any).webkitAudioContext;
      const audioContext = new Ctx() as AudioContext;
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      stoppingRef.current = false;
      chunkSeqRef.current = 0;
      appendQueueRef.current = Promise.resolve();
      setRecording(true);
      beginSegment();
      monitorVolume();
    } catch {
      setMicError("Microphone access denied.");
    }
  }

  function beginSegment() {
    const stream = streamRef.current;
    if (!stream) return;
    const mimeType = ["audio/webm", "audio/mp4", "audio/ogg"].find(
      (t) => typeof MediaRecorder.isTypeSupported === "function" && MediaRecorder.isTypeSupported(t)
    );
    const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
    const chunks: BlobPart[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
      // Skip near-silent segments (e.g. the final cut when the user hits stop).
      if (blob.size > 1200) {
        enqueueTranscription(blob, chunkSeqRef.current++);
      }
      if (!stoppingRef.current) beginSegment();
    };
    recorder.start();
    mediaRecorderRef.current = recorder;
    hasSpokenRef.current = false;
  }

  function monitorVolume() {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.frequencyBinCount);

    const tick = () => {
      if (!analyserRef.current) return;
      analyser.getByteTimeDomainData(data);
      let sumSquares = 0;
      for (let i = 0; i < data.length; i++) {
        const deviation = data[i] - 128;
        sumSquares += deviation * deviation;
      }
      const rms = Math.sqrt(sumSquares / data.length);

      if (rms > SILENCE_THRESHOLD) {
        hasSpokenRef.current = true;
        if (silenceTimerRef.current) {
          window.clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
      } else if (hasSpokenRef.current && !silenceTimerRef.current) {
        silenceTimerRef.current = window.setTimeout(() => {
          silenceTimerRef.current = null;
          if (mediaRecorderRef.current?.state === "recording") {
            mediaRecorderRef.current.stop(); // triggers onstop -> transcribe + beginSegment()
          }
        }, SILENCE_DURATION_MS);
      }

      if (!stoppingRef.current) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function enqueueTranscription(blob: Blob, seq: number) {
    setTranscribing(true);
    appendQueueRef.current = appendQueueRef.current.then(async () => {
      try {
        const extension = blob.type.includes("mp4") ? "mp4" : blob.type.includes("ogg") ? "ogg" : "webm";
        const formData = new FormData();
        formData.append("audio", blob, `chunk-${seq}.${extension}`);
        const res = await fetch("/api/doc-mic-transcribe", { method: "POST", body: formData });
        if (res.ok) {
          const data = (await res.json().catch(() => null)) as { text?: string } | null;
          const text = data?.text?.trim();
          if (text) appendTranscript(text);
        } else if (res.status === 503) {
          setMicError("Live transcription isn't configured on this deployment — falling back to your browser's dictation.");
          const target = recordingTargetRef.current;
          stopGroqRecording();
          usingGroqRef.current = false;
          startRecording(target);
        } else if (res.status !== 429) {
          setMicError("Couldn't transcribe that part — try again.");
        }
      } catch {
        setMicError("Connection issue during transcription.");
      }
    });
    void appendQueueRef.current.finally(() => setTranscribing(false));
  }

  function stopGroqRecording() {
    stoppingRef.current = true;
    if (silenceTimerRef.current) {
      window.clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    void audioContextRef.current?.close();
    audioContextRef.current = null;
    analyserRef.current = null;
    setRecording(false);
  }

  function startSample(doc: SampleDoc) {
    setActiveDoc({ title: doc.title, body: doc.body, isOwn: false, sampleDocId: doc.id, topic: doc.topic });
    setNotes("");
    setFollowUpQuestion("");
    setAnswer("");
    setResult(null);
    setPresenterResult(null);
    setError(null);
    setPhase("read");
  }

  function startOwn() {
    if (pasted.trim().length < MIN_DOC_CHARS) return;
    setActiveDoc({ title: "Your document", body: pasted.trim(), isOwn: true });
    setNotes("");
    setFollowUpQuestion("");
    setAnswer("");
    setResult(null);
    setPresenterResult(null);
    setError(null);
    setPhase("read");
  }

  async function submitCommenterNotes() {
    if (!activeDoc) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/doc-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docText: activeDoc.body,
          userNotes: notes,
          sampleDocId: activeDoc.sampleDocId,
          docTitle: activeDoc.title,
          docTopic: activeDoc.topic,
          isOwnDoc: activeDoc.isOwn,
          tzOffsetMinutes: new Date().getTimezoneOffset(),
        }),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? "Could not analyse that document. Try again.");
        return;
      }
      setResult((await response.json()) as DocReviewResult);
      setPhase("results");
    } catch {
      setError("Something went wrong. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function submitSummary() {
    if (!activeDoc || notes.trim().length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/doc-present", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docText: activeDoc.body,
          messages: [{ role: "presenter", content: notes }],
          sampleDocId: activeDoc.sampleDocId,
          docTitle: activeDoc.title,
          docTopic: activeDoc.topic,
          isOwnDoc: activeDoc.isOwn,
        }),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? "Could not process that summary. Try again.");
        return;
      }
      const data = (await response.json()) as { type: string; followUpQuestion?: string };
      setFollowUpQuestion(data.followUpQuestion ?? "What's the one thing here that would actually change what we do next?");
      setAnswer("");
      setPhase("answering");
    } catch {
      setError("Something went wrong. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function submitAnswer() {
    if (!activeDoc) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/doc-present", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docText: activeDoc.body,
          messages: [
            { role: "presenter", content: notes },
            { role: "listener", content: followUpQuestion },
            { role: "presenter", content: answer.trim().length > 0 ? answer : "(No answer given.)" },
          ],
          sampleDocId: activeDoc.sampleDocId,
          docTitle: activeDoc.title,
          docTopic: activeDoc.topic,
          isOwnDoc: activeDoc.isOwn,
          tzOffsetMinutes: new Date().getTimezoneOffset(),
        }),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? "Could not grade that answer. Try again.");
        return;
      }
      setPresenterResult((await response.json()) as PresenterFinalResult);
      setPhase("results");
    } catch {
      setError("Something went wrong. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setPhase("pick");
    setActiveDoc(null);
    setNotes("");
    setFollowUpQuestion("");
    setAnswer("");
    setResult(null);
    setPresenterResult(null);
    setError(null);
  }

  function retryDoc() {
    setNotes("");
    setFollowUpQuestion("");
    setAnswer("");
    setResult(null);
    setPresenterResult(null);
    setError(null);
    setPhase("read");
  }

  const micButton = (target: RecordingTarget, label = "Speak instead") => (
    <div className="flex flex-wrap items-center gap-3">
      {recording && recordingTargetRef.current === target ? (
        <button
          type="button"
          onClick={stopRecording}
          className="flex items-center gap-2 rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-400/20"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
          Stop recording
        </button>
      ) : (
        <button
          type="button"
          onClick={() => startRecording(target)}
          disabled={recording}
          className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Mic className="h-4 w-4 text-emerald-300" />
          {label}
        </button>
      )}
      {transcribing && recordingTargetRef.current === target ? (
        <span className="flex items-center gap-1.5 text-xs text-emerald-300">
          <Loader2 className="h-3 w-3 animate-spin" />
          Transcribing…
        </span>
      ) : (
        <span className="text-xs text-slate-500">Say it out loud — it fills in as you pause.</span>
      )}
    </div>
  );

  // ── Phase 1: pick a mode, then a document ───────────────────────────────
  if (phase === "pick") {
    return (
      <div className="space-y-6">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setMode("commenter")}
              className={`rounded-3xl px-4 py-3 text-left transition ${
                mode === "commenter" ? "bg-emerald-400/15 ring-1 ring-emerald-300/30" : "hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageSquareQuote className={`h-4 w-4 ${mode === "commenter" ? "text-emerald-300" : "text-slate-500"}`} />
                <p className={`text-sm font-semibold ${mode === "commenter" ? "text-white" : "text-slate-300"}`}>Commenter mode</p>
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-500">Read it. Find what's worth raising.</p>
            </button>
            <button
              onClick={() => setMode("presenter")}
              className={`rounded-3xl px-4 py-3 text-left transition ${
                mode === "presenter" ? "bg-emerald-400/15 ring-1 ring-emerald-300/30" : "hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-2">
                <Presentation className={`h-4 w-4 ${mode === "presenter" ? "text-emerald-300" : "text-slate-500"}`} />
                <p className={`text-sm font-semibold ${mode === "presenter" ? "text-white" : "text-slate-300"}`}>Presenter mode</p>
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-500">Explain it. Field the question that follows.</p>
            </button>
          </div>
        </section>

        {/* Paste your own — the immediate-utility path */}
        <section className="rounded-[2rem] border border-emerald-400/25 bg-emerald-400/5 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Before your next meeting</p>
          <h2 className="mt-2 text-lg font-semibold text-white">Paste a document you actually have to read</h2>
          <p className="mt-1 text-sm leading-6 text-slate-400">
            {mode === "commenter"
              ? "A proposal, a spec, a strategy memo, a board paper. You will get the two or three questions genuinely worth raising — phrased so they are easy to say out loud."
              : "A proposal, a spec, a strategy memo, a board paper. You'll summarize it out loud, then field one question a real listener would actually ask."}
          </p>
          <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
            <p className="text-xs leading-5 text-slate-400">
              <span className="font-medium text-slate-200">Your document is never saved.</span> It is sent for analysis
              and then discarded — we keep only the feedback and the notes you write yourself, so you can track
              progress. Nothing of the document itself is stored, so confidential work is safe to paste here.
            </p>
          </div>
          <textarea
            value={pasted}
            onChange={(e) => setPasted(e.target.value)}
            rows={6}
            placeholder="Paste the document here…"
            className="input-base mt-3 text-sm leading-6"
          />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={startOwn}
              disabled={pasted.trim().length < MIN_DOC_CHARS}
              className="rounded-2xl bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Use this document
            </button>
            <span className="text-xs text-slate-500">
              {pasted.trim().length < MIN_DOC_CHARS
                ? `${MIN_DOC_CHARS - pasted.trim().length} more characters needed`
                : `${pasted.trim().length.toLocaleString()} characters ready`}
            </span>
          </div>
        </section>

        {/* Practice documents */}
        <section className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Or practise on a sample</p>
            <p className="mt-1 text-sm leading-6 text-slate-400">
              Each one reads like a real memo and is persuasive on a fast pass. Every one of them has something worth
              challenging.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setTopicFilter("all")}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                topicFilter === "all"
                  ? "border-emerald-300/30 bg-emerald-400/15 text-emerald-200"
                  : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
              }`}
            >
              All topics
            </button>
            {DOC_TOPICS.map((t) => (
              <button
                key={t}
                onClick={() => setTopicFilter(t)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                  topicFilter === t
                    ? "border-emerald-300/30 bg-emerald-400/15 text-emerald-200"
                    : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                {TOPIC_LABELS[t]}
              </button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {shown.map((doc) => (
              <button
                key={doc.id}
                onClick={() => startSample(doc)}
                className="group rounded-[2rem] border border-white/10 bg-white/5 p-5 text-left transition hover:border-emerald-300/30 hover:bg-white/[0.07]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{doc.emoji}</span>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${TOPIC_COLORS[doc.topic]}`}
                  >
                    {TOPIC_LABELS[doc.topic]}
                  </span>
                </div>
                <p className="mt-3 text-sm font-semibold leading-6 text-white">{doc.title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">{doc.blurb}</p>
              </button>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // ── Phase 2: read + commit (commenter's notes, or presenter's summary) ──
  if (phase === "read" && activeDoc) {
    return (
      <div className="space-y-5">
        <button
          onClick={reset}
          className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Pick a different document
        </button>

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-emerald-300">
            <FileText className="h-3.5 w-3.5" />
            {activeDoc.isOwn ? "Your document" : "Practice document"}
          </div>
          <h2 className="mt-3 text-xl font-semibold text-white">{activeDoc.title}</h2>
          <div className="mt-4 max-h-[26rem] overflow-y-auto rounded-3xl border border-white/8 bg-slate-950/60 p-5">
            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-200">{activeDoc.body}</p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 space-y-4">
          <div>
            <p className="text-sm font-semibold text-white">
              {mode === "commenter" ? "What would you raise?" : "How would you summarize this to the room?"}
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-400">
              {mode === "commenter"
                ? "Write the issues or questions you would bring to the meeting. Do not aim for a long list — one or two things that would actually change the decision beats eight small ones."
                : "Explain it like you're the one presenting — the version someone who hasn't read it needs to hear. Afterward, you'll field one question about it, the way a real listener would ask."}
            </p>
          </div>
          <textarea
            autoFocus
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={7}
            placeholder={
              mode === "commenter"
                ? "e.g. The cost section only covers salaries — what about the coordination overhead?\ne.g. Success is defined as 'wellbeing improves' — how would we measure that?"
                : "e.g. We're proposing X because Y. The main tradeoff is Z, and here's how we'd know in six months whether it worked."
            }
            className="input-base text-sm leading-6"
          />
          {micButton("notes")}
          {micError ? <p className="text-xs text-amber-300">{micError}</p> : null}
          {error ? (
            <p className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm text-red-300">{error}</p>
          ) : null}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={mode === "commenter" ? submitCommenterNotes : submitSummary}
              disabled={loading || (mode === "presenter" && notes.trim().length === 0)}
              className="flex items-center gap-2 rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {mode === "commenter" ? "Reading it back…" : "Thinking of a question…"}
                </>
              ) : mode === "commenter" ? (
                "Show me what I missed"
              ) : (
                "Present it"
              )}
            </button>
            {mode === "commenter" && notes.trim().length === 0 && !loading ? (
              <span className="text-xs text-slate-500">
                You can skip straight to the analysis — but you will learn more by committing first.
              </span>
            ) : null}
          </div>
        </section>
      </div>
    );
  }

  // ── Phase 2b: presenter mode's follow-up question ────────────────────────
  if (phase === "answering" && activeDoc) {
    return (
      <div className="space-y-5">
        <button
          onClick={reset}
          className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Pick a different document
        </button>

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Your summary</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">{notes}</p>
        </section>

        <section className="rounded-[2rem] border border-emerald-400/20 bg-emerald-400/5 p-6">
          <div className="flex items-center gap-2">
            <MessageSquareQuote className="h-4 w-4 text-emerald-300" />
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300">Someone in the room asks</p>
          </div>
          <p className="mt-3 border-l-2 border-emerald-400/40 pl-4 text-lg font-medium leading-7 text-white">
            &ldquo;{followUpQuestion}&rdquo;
          </p>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 space-y-4">
          <div>
            <p className="text-sm font-semibold text-white">How do you answer?</p>
            <p className="mt-1 text-sm leading-6 text-slate-400">
              Give the direct answer first, then the reasoning. You can still see the document above if you paste your
              own — for samples, answer from what you remember, the way you would in the room.
            </p>
          </div>
          <textarea
            autoFocus
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={6}
            placeholder="Answer as you would out loud, right now…"
            className="input-base text-sm leading-6"
          />
          {micButton("answer")}
          {micError ? <p className="text-xs text-amber-300">{micError}</p> : null}
          {error ? (
            <p className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm text-red-300">{error}</p>
          ) : null}
          <button
            onClick={submitAnswer}
            disabled={loading}
            className="flex items-center gap-2 rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Grading the exchange…
              </>
            ) : (
              "Submit my answer"
            )}
          </button>
        </section>
      </div>
    );
  }

  // ── Phase 3a: commenter results ─────────────────────────────────────────
  if (phase === "results" && mode === "commenter" && result && activeDoc) {
    const attempted = notes.trim().length > 0;
    const score = result.detectionScore;
    const scoreColor = score >= 7 ? "text-emerald-300" : score >= 4 ? "text-amber-300" : "text-red-300";
    const scoreBorder =
      score >= 7 ? "border-emerald-400/25 bg-emerald-400/5" : score >= 4 ? "border-amber-400/25 bg-amber-400/5" : "border-red-400/25 bg-red-400/5";

    return (
      <div className="space-y-5">
        <ReviewedTag reviewedByAI={result.reviewedByAI} />
        {attempted ? (
          <section className={`rounded-[2rem] border p-6 sm:p-8 ${scoreBorder}`}>
            <div className="flex items-end gap-4">
              <p className={`text-6xl font-bold tabular-nums ${scoreColor}`}>
                {score}
                <span className="text-2xl text-slate-500">/10</span>
              </p>
              <div className="pb-1">
                <p className={`text-lg font-semibold ${scoreColor}`}>
                  {score >= 7 ? "You saw what mattered" : score >= 4 ? "Partly there" : "Worth another pass"}
                </p>
                <p className="text-sm text-slate-400">Judged on what you prioritised, not how much you listed.</p>
              </div>
            </div>
            {result.judgmentNote ? (
              <p className="mt-4 border-t border-white/8 pt-4 text-sm leading-7 text-slate-300">{result.judgmentNote}</p>
            ) : null}
          </section>
        ) : (
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-semibold text-white">Analysis only</p>
            <p className="mt-1 text-sm leading-6 text-slate-400">
              You skipped the attempt this time. Next round, write down one thing first — that is where the muscle
              actually builds.
            </p>
          </section>
        )}

        {/* The payload: questions worth raising */}
        <section className="rounded-[2rem] border border-emerald-400/20 bg-emerald-400/5 p-6">
          <div className="flex items-center gap-2">
            <MessageSquareQuote className="h-4 w-4 text-emerald-300" />
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300">
              Worth raising in the room
            </p>
          </div>
          <div className="mt-4 space-y-4">
            {result.topQuestions.map((q, i) => (
              <QuestionCard key={i} q={q} index={i + 1} />
            ))}
          </div>
        </section>

        {result.caught.length > 0 ? (
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                You caught these ({result.caught.length})
              </p>
            </div>
            <ul className="mt-3 space-y-2">
              {result.caught.map((c, i) => (
                <li key={i} className="flex gap-2 text-sm leading-6 text-slate-200">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  {c}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {result.missed.length > 0 ? (
          <section className="rounded-[2rem] border border-amber-400/20 bg-amber-400/5 p-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-300" />
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-300">
                You did not mention these
              </p>
            </div>
            <div className="mt-4 space-y-4">
              {result.missed.map((q, i) => (
                <QuestionCard key={i} q={q} />
              ))}
            </div>
          </section>
        ) : null}

        {result.raisingTip ? (
          <section className="rounded-[2rem] border border-violet-300/20 bg-violet-400/5 p-6">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-violet-300" />
              <p className="text-xs font-semibold uppercase tracking-widest text-violet-300">How to actually say it</p>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-200">{result.raisingTip}</p>
          </section>
        ) : null}

        <ResultsFooter onRetry={retryDoc} onReset={reset} />
      </div>
    );
  }

  // ── Phase 3b: presenter results ─────────────────────────────────────────
  if (phase === "results" && mode === "presenter" && presenterResult && activeDoc) {
    const score = presenterResult.overallScore;
    const scoreColor = score >= 7 ? "text-emerald-300" : score >= 4 ? "text-amber-300" : "text-red-300";
    const scoreBorder =
      score >= 7 ? "border-emerald-400/25 bg-emerald-400/5" : score >= 4 ? "border-amber-400/25 bg-amber-400/5" : "border-red-400/25 bg-red-400/5";

    return (
      <div className="space-y-5">
        <ReviewedTag reviewedByAI={presenterResult.reviewedByAI} />

        <section className={`rounded-[2rem] border p-6 sm:p-8 ${scoreBorder}`}>
          <div className="flex flex-wrap items-end gap-6">
            <div className="flex items-end gap-4">
              <p className={`text-6xl font-bold tabular-nums ${scoreColor}`}>
                {score}
                <span className="text-2xl text-slate-500">/10</span>
              </p>
              <div className="pb-1">
                <p className={`text-lg font-semibold ${scoreColor}`}>
                  {score >= 7 ? "Clear, and you held your ground" : score >= 4 ? "Partly landed" : "Worth another pass"}
                </p>
                <p className="text-sm text-slate-400">Summary and follow-up, judged together.</p>
              </div>
            </div>
            <div className="flex gap-4 pb-1">
              <div>
                <p className="text-2xl font-bold tabular-nums text-white">{presenterResult.summaryScore}<span className="text-sm text-slate-500">/10</span></p>
                <p className="text-[11px] uppercase tracking-widest text-slate-500">Summary</p>
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums text-white">{presenterResult.answerScore}<span className="text-sm text-slate-500">/10</span></p>
                <p className="text-[11px] uppercase tracking-widest text-slate-500">Follow-up</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Your summary</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{notes}</p>
          </div>
          <div className="border-t border-white/8 pt-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">They asked</p>
            <p className="mt-2 text-sm font-medium leading-6 text-white">&ldquo;{followUpQuestion}&rdquo;</p>
          </div>
          <div className="border-t border-white/8 pt-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">You answered</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{answer || "(No answer given.)"}</p>
          </div>
        </section>

        {presenterResult.strengths.length > 0 ? (
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">What worked</p>
            </div>
            <ul className="mt-3 space-y-2">
              {presenterResult.strengths.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm leading-6 text-slate-200">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  {s}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {presenterResult.improvements.length > 0 ? (
          <section className="rounded-[2rem] border border-amber-400/20 bg-amber-400/5 p-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-300" />
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-300">Tighten next time</p>
            </div>
            <ul className="mt-3 space-y-2">
              {presenterResult.improvements.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm leading-6 text-slate-200">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                  {s}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {presenterResult.idealFollowUpAnswer ? (
          <section className="rounded-[2rem] border border-violet-300/20 bg-violet-400/5 p-6">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-violet-300" />
              <p className="text-xs font-semibold uppercase tracking-widest text-violet-300">A strong way to answer that</p>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-200">{presenterResult.idealFollowUpAnswer}</p>
          </section>
        ) : null}

        <ResultsFooter onRetry={retryDoc} onReset={reset} />
      </div>
    );
  }

  return null;
}

function ReviewedTag({ reviewedByAI }: { reviewedByAI: boolean }) {
  return reviewedByAI ? (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-emerald-300">
      <Sparkles className="h-3 w-3" />
      AI reviewed
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-400/20 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
      <AlertCircle className="h-3 w-3" />
      Heuristic fallback — AI coaching unavailable right now
    </span>
  );
}

function ResultsFooter({ onRetry, onReset }: { onRetry: () => void; onReset: () => void }) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={onRetry}
        className="rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
      >
        Try this document again
      </button>
      <button
        onClick={onReset}
        className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
      >
        <ArrowLeft className="h-4 w-4" />
        Another document
      </button>
    </div>
  );
}

function QuestionCard({ q, index }: { q: DocQuestion; index?: number }) {
  return (
    <div className="rounded-3xl border border-white/8 bg-slate-950/50 p-5">
      <div className="flex flex-wrap items-center gap-2">
        {index ? (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 text-[11px] font-bold text-slate-950">
            {index}
          </span>
        ) : null}
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
          {q.lens}
        </span>
        <span
          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${SEVERITY_STYLE[q.severity]}`}
        >
          {q.severity}
        </span>
      </div>
      {q.issue ? <p className="mt-3 text-sm leading-6 text-slate-400">{q.issue}</p> : null}
      <p className="mt-3 border-l-2 border-emerald-400/40 pl-4 text-sm font-medium leading-7 text-white">
        &ldquo;{q.question}&rdquo;
      </p>
    </div>
  );
}
