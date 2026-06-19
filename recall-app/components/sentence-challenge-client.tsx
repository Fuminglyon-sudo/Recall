"use client";

import { useState } from "react";
import { ArrowLeft, ChevronRight, RotateCcw } from "lucide-react";
import { getMastery, MASTERY } from "@/lib/mastery";

type EligibleCard = {
  id: string;
  front: string;
  back: string;
  partOfSpeech: string | null;
  example: string | null;
  interval: number;
  repetitions: number;
  deckId: string;
  deckName: string;
};

type Grade = {
  score: number;
  correct: boolean;
  feedback: string;
  betterSentence: string;
};

function scoreLabel(s: number) {
  if (s >= 5) return "Perfect usage";
  if (s >= 4) return "Natural and correct";
  if (s >= 3) return "Correct but could be sharper";
  if (s >= 2) return "Partially correct";
  return "Incorrect usage";
}

function scoreColor(s: number) {
  if (s >= 4) return "text-emerald-300";
  if (s >= 3) return "text-amber-300";
  return "text-red-300";
}

function scoreBorder(s: number) {
  if (s >= 4) return "border-emerald-400/25 bg-emerald-400/8";
  if (s >= 3) return "border-amber-400/25 bg-amber-400/8";
  return "border-red-400/25 bg-red-400/8";
}

export function SentenceChallengeClient({ cards }: { cards: EligibleCard[] }) {
  const [active, setActive] = useState<EligibleCard | null>(null);
  const [scenario, setScenario] = useState<string | null>(null);
  const [loadingScenario, setLoadingScenario] = useState(false);
  const [sentence, setSentence] = useState("");
  const [grade, setGrade] = useState<Grade | null>(null);
  const [grading, setGrading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pickCard(card: EligibleCard) {
    setActive(card);
    setScenario(null);
    setSentence("");
    setGrade(null);
    setError(null);
    setLoadingScenario(true);
    try {
      const res = await fetch("/api/sentence-challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "scenario", word: card.front, definition: card.back }),
      });
      const data = (await res.json()) as { scenario?: string; error?: string };
      setScenario(data.scenario ?? `Write a sentence using the word "${card.front}".`);
    } catch {
      setScenario(`Write a natural sentence using the word "${card.front}".`);
    } finally {
      setLoadingScenario(false);
    }
  }

  async function submitSentence() {
    if (!active || !scenario || !sentence.trim()) return;
    setGrading(true);
    setError(null);
    try {
      const res = await fetch("/api/sentence-challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "grade",
          word: active.front,
          definition: active.back,
          scenario,
          userSentence: sentence.trim(),
        }),
      });
      const data = (await res.json()) as Grade & { error?: string };
      if (data.error) { setError(data.error); return; }
      setGrade(data);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setGrading(false);
    }
  }

  function reset() {
    setActive(null);
    setScenario(null);
    setSentence("");
    setGrade(null);
    setError(null);
  }

  // ── Card picker ──────────────────────────────────────────────────────────────
  if (!active) {
    return (
      <div className="space-y-4">
        {cards.length === 0 ? (
          <div className="rounded-[2rem] border border-white/8 bg-white/[0.02] p-10 text-center">
            <p className="text-sm text-slate-400">
              No eligible cards yet. Cards become available for sentence challenge once they reach Familiar level (7+ day interval).
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {cards.map((card) => {
              const level = getMastery(card.interval, card.repetitions);
              const meta = MASTERY[level];
              return (
                <button
                  key={card.id}
                  onClick={() => void pickCard(card)}
                  className="group rounded-[2rem] border border-white/10 bg-white/5 p-5 text-left transition hover:border-white/20 hover:bg-white/8"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-white">{card.front}</span>
                      {card.partOfSpeech ? (
                        <span className="text-[10px] text-slate-500">{card.partOfSpeech}</span>
                      ) : null}
                    </div>
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-600 transition group-hover:text-slate-400" />
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">{card.back}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[10px] text-slate-600">{card.deckName}</span>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${meta.bg} ${meta.border} ${meta.color}`}>
                      {meta.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ── Grade result ─────────────────────────────────────────────────────────────
  if (grade) {
    return (
      <div className="space-y-5">
        <div className={`rounded-[2rem] border p-6 sm:p-8 ${scoreBorder(grade.score)}`}>
          <div className="flex items-center gap-5">
            <div className={`text-5xl font-bold tabular-nums ${scoreColor(grade.score)}`}>
              {grade.score}
              <span className="text-2xl text-slate-500">/5</span>
            </div>
            <div>
              <p className={`text-lg font-semibold ${scoreColor(grade.score)}`}>{scoreLabel(grade.score)}</p>
              <p className="text-sm text-slate-400">{active.front}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Your sentence</p>
          <p className="mt-3 text-sm leading-7 italic text-slate-200">&ldquo;{sentence}&rdquo;</p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Feedback</p>
          <p className="text-sm leading-7 text-slate-200">{grade.feedback}</p>
        </div>

        <div className="rounded-[2rem] border border-emerald-300/15 bg-emerald-400/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Model sentence</p>
          <p className="mt-3 text-sm leading-7 italic text-slate-200">&ldquo;{grade.betterSentence}&rdquo;</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => { setGrade(null); setSentence(""); }}
            className="flex items-center gap-2 rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
          >
            <RotateCcw className="h-4 w-4" />
            Try again
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Pick a different word
          </button>
        </div>
      </div>
    );
  }

  // ── Writing phase ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      <button
        onClick={reset}
        className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-slate-200"
      >
        <ArrowLeft className="h-4 w-4" />
        All words
      </button>

      {/* Word header */}
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline gap-3">
          <h2 className="text-2xl font-semibold text-white">{active.front}</h2>
          {active.partOfSpeech ? (
            <span className="text-xs text-slate-500">{active.partOfSpeech}</span>
          ) : null}
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-300">{active.back}</p>
      </div>

      {/* Scenario */}
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Scenario</p>
        {loadingScenario ? (
          <div className="mt-3 flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
            <p className="text-sm text-slate-500">Setting the scene…</p>
          </div>
        ) : (
          <p className="mt-3 text-sm leading-7 text-slate-200">{scenario}</p>
        )}
      </div>

      {/* Input */}
      {!loadingScenario ? (
        <div className="space-y-3">
          {error ? <p className="text-sm text-amber-300">{error}</p> : null}
          <textarea
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
            rows={3}
            placeholder={`Write a sentence using "${active.front}"…`}
            className="input-base"
          />
          <button
            onClick={() => void submitSentence()}
            disabled={!sentence.trim() || grading}
            className="flex items-center gap-2 rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {grading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                Grading…
              </>
            ) : "Submit sentence"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
