"use client";

import { useRef, useState } from "react";
import { Mic, ArrowLeft, ChevronRight, RotateCcw } from "lucide-react";

type App = "japa-reality" | "sharpen" | "both";

type Scenario = {
  id: string;
  app: App;
  tag: string;
  setting: string;
  question: string;
};

type GradeResult = {
  score: number;
  strongPoints: string[];
  improvements: string[];
  modelAnswer: string;
};

const SCENARIOS: Scenario[] = [
  // Japa Reality
  {
    id: "jr-websummit",
    app: "japa-reality",
    tag: "Web Summit",
    setting:
      "You are at Web Summit in Lisbon. Between keynote sessions, a Series A investor from Sequoia stops you in the hallway after noticing your founder badge. They extend their hand and say:",
    question: "What does Japa Reality actually do, and who is it for?",
  },
  {
    id: "jr-plane",
    app: "japa-reality",
    tag: "Plane conversation",
    setting:
      "You are on a flight from Lagos to London. The person seated next to you turns out to be a partner at a prominent UK-based VC fund. After some small talk they lean in and ask:",
    question: "What problem are you solving, and why hasn't anyone solved it properly yet?",
  },
  {
    id: "jr-demoday",
    app: "japa-reality",
    tag: "Demo day stage",
    setting:
      "You are pitching at a Lagos startup demo day. You have 90 seconds on stage. The room holds 200 people including press and investors. The MC hands you the microphone and says:",
    question: "Tell us about Japa Reality — what it is, who it helps, and why now.",
  },
  {
    id: "jr-pushback",
    app: "japa-reality",
    tag: "Founder dinner",
    setting:
      "You are at a private founder dinner in Nairobi. A successful entrepreneur who has exited two tech companies is sitting across from you. They push back hard and ask:",
    question:
      "Why would someone use Japa Reality instead of just Googling or asking their contacts in a WhatsApp group?",
  },
  {
    id: "jr-technical",
    app: "japa-reality",
    tag: "Technical founder",
    setting:
      "You are at a startup networking event and meet a technical co-founder from a logistics company. They are curious about how you built it and ask:",
    question:
      "Walk me through how Japa Reality works — the frontend, backend, and what the experience actually looks like for the user.",
  },
  // Sharpen
  {
    id: "sh-investor",
    app: "sharpen",
    tag: "Investor meeting",
    setting:
      "You are in a formal investor meeting in London. The investor has previously backed three edtech startups, one of which was acquired by Coursera. They look up from your deck and ask:",
    question: "How is Sharpen different from Duolingo, Anki, or any other learning app already on the market?",
  },
  {
    id: "sh-ycombinator",
    app: "sharpen",
    tag: "YC alumni mixer",
    setting:
      "You are at a Y Combinator alumni mixer in San Francisco. Someone who invested in Duolingo at seed stage walks over and introduces themselves. They ask directly:",
    question: "What is Sharpen, and why did you build it instead of using something that already exists?",
  },
  {
    id: "sh-insight",
    app: "sharpen",
    tag: "Angel investor at a party",
    setting:
      "You are at a tech conference afterparty and get introduced to a self-made entrepreneur known for writing large angel cheques into African consumer startups. They ask with genuine curiosity:",
    question:
      "You said you are building a learning product — what is the insight most people miss about how adults actually retain vocabulary?",
  },
  {
    id: "sh-technical",
    app: "sharpen",
    tag: "Technical deep dive",
    setting:
      "You are speaking with a senior engineer from a SaaS company who is curious about the product you built. They ask about your stack and how you approached it:",
    question:
      "Tell me how Sharpen is built — what did you choose for the frontend and backend, and what was the hardest technical decision you made?",
  },
  // Both apps
  {
    id: "both-plane",
    app: "both",
    tag: "High-net-worth on a plane",
    setting:
      "You are on a long-haul flight and the passenger beside you is a high-net-worth individual who has backed startups across Africa and Europe. After discovering you are a founder they ask:",
    question:
      "Tell me about the apps you are building — what are they, and what ties them together as a portfolio?",
  },
  {
    id: "both-press",
    app: "both",
    tag: "Journalist interview",
    setting:
      "You are working from a co-working space in London when a journalist from TechCrunch Africa approaches you for an impromptu interview. They ask:",
    question:
      "You are building two products simultaneously. Walk me through both and tell me why you believe in this specific combination.",
  },
];

const APP_LABELS: Record<App, string> = {
  "japa-reality": "Japa Reality",
  sharpen: "Sharpen",
  both: "Both apps",
};

const APP_COLORS: Record<App, string> = {
  "japa-reality": "border-emerald-300/20 bg-emerald-400/10 text-emerald-200",
  sharpen: "border-violet-300/20 bg-violet-400/10 text-violet-200",
  both: "border-sky-300/20 bg-sky-400/10 text-sky-200",
};

function scoreLabel(score: number): string {
  if (score >= 9) return "Investor-ready";
  if (score >= 7) return "Strong pitch";
  if (score >= 5) return "Solid foundation";
  if (score >= 3) return "Getting there";
  return "Needs work";
}

function scoreColor(score: number): string {
  if (score >= 8) return "text-emerald-300";
  if (score >= 5) return "text-amber-300";
  return "text-red-300";
}

function scoreBorder(score: number): string {
  if (score >= 8) return "border-emerald-400/25 bg-emerald-400/8";
  if (score >= 5) return "border-amber-400/25 bg-amber-400/8";
  return "border-red-400/25 bg-red-400/8";
}

type Filter = App | "all";

export function PitchPracticeClient() {
  const [filter, setFilter] = useState<Filter>("all");
  const [active, setActive] = useState<Scenario | null>(null);
  const [answer, setAnswer] = useState("");
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GradeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const filtered = filter === "all" ? SCENARIOS : SCENARIOS.filter((s) => s.app === filter);

  function selectScenario(scenario: Scenario) {
    setActive(scenario);
    setAnswer("");
    setResult(null);
    setError(null);
    setRecording(false);
  }

  function reset() {
    setActive(null);
    setAnswer("");
    setResult(null);
    setError(null);
    setRecording(false);
  }

  async function startRecording() {
    setError(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (SR) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const recognition = new SR() as any;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      let final = "";
      recognition.onresult = (event: {
        resultIndex: number;
        results: { isFinal: boolean; 0: { transcript: string } }[];
      }) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) final += event.results[i][0].transcript + " ";
          else interim += event.results[i][0].transcript;
        }
        setAnswer(final + interim);
      };
      recognition.onerror = () => setError("Microphone access denied or speech recognition unavailable.");
      recognition.onend = () => setRecording(false);
      recognition.start();
      recognitionRef.current = recognition;
      setRecording(true);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        setRecording(false);
      };
      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setRecording(true);
    } catch {
      setError("Could not access microphone. Please allow microphone permission and try again.");
    }
  }

  function stopRecording() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    setRecording(false);
  }

  async function submitAnswer() {
    if (!active || !answer.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/pitch-grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          app: active.app,
          scenario: active.setting,
          question: active.question,
          answer: answer.trim(),
        }),
      });
      if (!response.ok) {
        const err = (await response.json().catch(() => ({}))) as { error?: string };
        setError(err.error ?? "Grading failed. Try again.");
        return;
      }
      const data = (await response.json()) as GradeResult;
      setResult(data);
    } catch {
      setError("Something went wrong. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Scenario selection ──────────────────────────────────────────────────────
  if (!active) {
    return (
      <div className="space-y-6">
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {(["all", "japa-reality", "sharpen", "both"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                filter === f
                  ? "border-emerald-300/30 bg-emerald-400/15 text-emerald-200"
                  : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/8 hover:text-slate-200"
              }`}
            >
              {f === "all" ? "All scenarios" : APP_LABELS[f]}
            </button>
          ))}
        </div>

        {/* Scenario grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => selectScenario(scenario)}
              className="group rounded-[2rem] border border-white/10 bg-white/5 p-5 text-left transition hover:border-white/20 hover:bg-white/8"
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest ${APP_COLORS[scenario.app]}`}
                >
                  {APP_LABELS[scenario.app]}
                </span>
                <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-600 transition group-hover:text-slate-400" />
              </div>
              <p className="mt-3 text-sm font-semibold text-white">{scenario.tag}</p>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">{scenario.setting}</p>
              <p className="mt-3 rounded-2xl border border-white/8 bg-slate-950/50 px-4 py-3 text-sm italic text-slate-300">
                &ldquo;{scenario.question}&rdquo;
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Result view ─────────────────────────────────────────────────────────────
  if (result) {
    return (
      <div className="space-y-5">
        {/* Score */}
        <div className={`rounded-[2rem] border p-6 sm:p-8 ${scoreBorder(result.score)}`}>
          <div className="flex items-center gap-5">
            <div className={`text-5xl font-bold tabular-nums ${scoreColor(result.score)}`}>
              {result.score}
              <span className="text-2xl text-slate-500">/10</span>
            </div>
            <div>
              <p className={`text-lg font-semibold ${scoreColor(result.score)}`}>{scoreLabel(result.score)}</p>
              <p className="text-sm text-slate-400">{active.tag} · {APP_LABELS[active.app]}</p>
            </div>
          </div>
        </div>

        {/* Feedback */}
        <div className="grid gap-4 sm:grid-cols-2">
          {result.strongPoints.length > 0 ? (
            <div className="rounded-[2rem] border border-emerald-400/20 bg-emerald-400/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300">What worked</p>
              <ul className="mt-3 space-y-2">
                {result.strongPoints.map((point, i) => (
                  <li key={i} className="flex gap-2.5 text-sm leading-6 text-slate-200">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {result.improvements.length > 0 ? (
            <div className="rounded-[2rem] border border-amber-400/20 bg-amber-400/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-300">What to sharpen</p>
              <ul className="mt-3 space-y-2">
                {result.improvements.map((point, i) => (
                  <li key={i} className="flex gap-2.5 text-sm leading-6 text-slate-200">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {/* Model answer */}
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Model answer</p>
          <p className="mt-4 text-sm leading-8 text-slate-100">{result.modelAnswer}</p>
        </div>

        {/* Your answer recap */}
        <div className="rounded-[2rem] border border-white/8 bg-white/[0.02] p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Your answer</p>
          <p className="mt-3 text-sm leading-7 text-slate-400">{answer}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => { setResult(null); setAnswer(""); }}
            className="flex items-center gap-2 rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
          >
            <RotateCcw className="h-4 w-4" />
            Try this scenario again
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Pick a different scenario
          </button>
        </div>
      </div>
    );
  }

  // ── Practice view ───────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      <button
        onClick={reset}
        className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-slate-200"
      >
        <ArrowLeft className="h-4 w-4" />
        All scenarios
      </button>

      {/* Scenario context */}
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 sm:p-8">
        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest ${APP_COLORS[active.app]}`}>
          {APP_LABELS[active.app]}
        </span>
        <p className="mt-4 text-sm font-semibold text-slate-200">{active.tag}</p>
        <p className="mt-3 text-sm leading-7 text-slate-300">{active.setting}</p>
        <div className="mt-5 rounded-3xl border border-emerald-300/15 bg-slate-950/60 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-emerald-300">They ask</p>
          <p className="mt-2 text-lg font-semibold text-white">&ldquo;{active.question}&rdquo;</p>
        </div>
      </div>

      {/* Recording */}
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <p className="text-sm font-medium text-slate-200">Your answer</p>
        <p className="mt-1 text-sm text-slate-400">
          Hit Record and speak naturally. Your words fill the box below in real time. Edit before submitting.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {recording ? (
            <button
              type="button"
              onClick={stopRecording}
              className="flex items-center gap-2 rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-400/20"
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
              Stop recording
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void startRecording()}
              disabled={loading}
              className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Mic className="h-4 w-4 text-emerald-300" />
              Record
            </button>
          )}
        </div>

        {error ? <p className="mt-3 text-sm text-amber-300">{error}</p> : null}

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={6}
          placeholder="Speak your answer above, or type it here directly."
          className="input-base mt-4"
        />
      </div>

      {/* Submit */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => void submitAnswer()}
          disabled={loading || !answer.trim()}
          className="rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Grading your answer…" : "Submit for feedback"}
        </button>
        <p className="text-sm text-slate-500">You will get a score, specific feedback, and a model answer.</p>
      </div>
    </div>
  );
}
