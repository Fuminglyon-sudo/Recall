"use client";

import { useState } from "react";
import { ArrowLeft, FileText, Loader2, Lightbulb, MessageSquareQuote, CheckCircle2, AlertCircle } from "lucide-react";
import {
  SAMPLE_DOCS,
  TOPIC_LABELS,
  DOC_TOPICS,
  type DocTopic,
  type SampleDoc,
} from "@/lib/doc-review-samples";

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
};

type ActiveDoc = {
  title: string;
  body: string;
  isOwn: boolean;
  sampleDocId?: string;
  topic?: DocTopic;
};

const TOPIC_COLORS: Record<DocTopic, string> = {
  workplace: "border-violet-300/20 bg-violet-400/10 text-violet-200",
  economics: "border-emerald-300/20 bg-emerald-400/10 text-emerald-200",
  politics: "border-sky-300/20 bg-sky-400/10 text-sky-200",
  social: "border-amber-300/20 bg-amber-400/10 text-amber-200",
  tech: "border-rose-300/20 bg-rose-400/10 text-rose-200",
  health: "border-teal-300/20 bg-teal-400/10 text-teal-200",
};

const SEVERITY_STYLE: Record<DocQuestion["severity"], string> = {
  major: "border-red-400/25 bg-red-400/10 text-red-300",
  moderate: "border-amber-400/25 bg-amber-400/10 text-amber-300",
  minor: "border-slate-400/20 bg-white/5 text-slate-400",
};

const MIN_DOC_CHARS = 200;

export function DocLabClient() {
  const [phase, setPhase] = useState<"pick" | "read" | "results">("pick");
  const [topicFilter, setTopicFilter] = useState<DocTopic | "all">("all");
  const [activeDoc, setActiveDoc] = useState<ActiveDoc | null>(null);
  const [pasted, setPasted] = useState("");
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<DocReviewResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shown = topicFilter === "all" ? SAMPLE_DOCS : SAMPLE_DOCS.filter((d) => d.topic === topicFilter);

  function startSample(doc: SampleDoc) {
    setActiveDoc({ title: doc.title, body: doc.body, isOwn: false, sampleDocId: doc.id, topic: doc.topic });
    setNotes("");
    setResult(null);
    setError(null);
    setPhase("read");
  }

  function startOwn() {
    if (pasted.trim().length < MIN_DOC_CHARS) return;
    setActiveDoc({ title: "Your document", body: pasted.trim(), isOwn: true });
    setNotes("");
    setResult(null);
    setError(null);
    setPhase("read");
  }

  async function submit() {
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

  function reset() {
    setPhase("pick");
    setActiveDoc(null);
    setNotes("");
    setResult(null);
    setError(null);
  }

  // ── Phase 1: pick a document ───────────────────────────────────────────
  if (phase === "pick") {
    return (
      <div className="space-y-6">
        {/* Paste your own — the immediate-utility path */}
        <section className="rounded-[2rem] border border-emerald-400/25 bg-emerald-400/5 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Before your next meeting</p>
          <h2 className="mt-2 text-lg font-semibold text-white">Paste a document you actually have to read</h2>
          <p className="mt-1 text-sm leading-6 text-slate-400">
            A proposal, a spec, a strategy memo, a board paper. You will get the two or three questions genuinely worth
            raising — phrased so they are easy to say out loud.
          </p>
          <textarea
            value={pasted}
            onChange={(e) => setPasted(e.target.value)}
            rows={6}
            placeholder="Paste the document here…"
            className="input-base mt-4 text-sm leading-6"
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

  // ── Phase 2: read + commit to what you would raise ─────────────────────
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
            <p className="text-sm font-semibold text-white">What would you raise?</p>
            <p className="mt-1 text-sm leading-6 text-slate-400">
              Write the issues or questions you would bring to the meeting. Do not aim for a long list — one or two
              things that would actually change the decision beats eight small ones.
            </p>
          </div>
          <textarea
            autoFocus
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={7}
            placeholder={"e.g. The cost section only covers salaries — what about the coordination overhead?\ne.g. Success is defined as 'wellbeing improves' — how would we measure that?"}
            className="input-base text-sm leading-6"
          />
          {error ? (
            <p className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm text-red-300">{error}</p>
          ) : null}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={submit}
              disabled={loading}
              className="flex items-center gap-2 rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Reading it back…
                </>
              ) : (
                "Show me what I missed"
              )}
            </button>
            {notes.trim().length === 0 && !loading ? (
              <span className="text-xs text-slate-500">
                You can skip straight to the analysis — but you will learn more by committing first.
              </span>
            ) : null}
          </div>
        </section>
      </div>
    );
  }

  // ── Phase 3: results ───────────────────────────────────────────────────
  if (phase === "results" && result && activeDoc) {
    const attempted = notes.trim().length > 0;
    const score = result.detectionScore;
    const scoreColor = score >= 7 ? "text-emerald-300" : score >= 4 ? "text-amber-300" : "text-red-300";
    const scoreBorder =
      score >= 7 ? "border-emerald-400/25 bg-emerald-400/5" : score >= 4 ? "border-amber-400/25 bg-amber-400/5" : "border-red-400/25 bg-red-400/5";

    return (
      <div className="space-y-5">
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

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              setNotes("");
              setResult(null);
              setPhase("read");
            }}
            className="rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
          >
            Try this document again
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Another document
          </button>
        </div>
      </div>
    );
  }

  return null;
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
