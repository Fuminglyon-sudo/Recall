"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Timer } from "lucide-react";

type DeckOption = {
  id: string;
  name: string;
  totalCards: number;
  seenCards: number;
  fronts: string[];
};

type Results = {
  remembered: string[];
  missed: string[];
  unrecognised: string[];
};

const SECONDS = 5 * 60; // 5 minutes

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim().replace(/\s+/g, " ");
}

function scoreResults(typed: string, fronts: string[]): Results {
  const typedLines = typed
    .split(/[\n,]+/)
    .map((l) => l.trim())
    .filter(Boolean);

  const normalFronts = fronts.map(normalize);

  const remembered: string[] = [];
  const missedSet = new Set(fronts);
  const unrecognised: string[] = [];

  for (const line of typedLines) {
    const norm = normalize(line);
    const matchIndex = normalFronts.findIndex(
      (f) => f === norm || f.startsWith(norm) || norm.startsWith(f)
    );
    if (matchIndex !== -1) {
      const matched = fronts[matchIndex];
      if (!remembered.includes(matched)) {
        remembered.push(matched);
        missedSet.delete(matched);
      }
    } else {
      if (!unrecognised.includes(line)) unrecognised.push(line);
    }
  }

  return { remembered, missed: [...missedSet], unrecognised };
}

function fmt(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

export function FreeRecallClient({ decks }: { decks: DeckOption[] }) {
  const [phase, setPhase] = useState<"pick" | "write" | "results">("pick");
  const [deck, setDeck] = useState<DeckOption | null>(null);
  const [text, setText] = useState("");
  const [timeLeft, setTimeLeft] = useState(SECONDS);
  const [results, setResults] = useState<Results | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (phase !== "write") return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [phase]);

  function startSession(d: DeckOption) {
    setDeck(d);
    setText("");
    setTimeLeft(SECONDS);
    setResults(null);
    setPhase("write");
  }

  function submit() {
    if (!deck) return;
    clearInterval(intervalRef.current!);
    setResults(scoreResults(text, deck.fronts));
    setPhase("results");
  }

  function reset() {
    setPhase("pick");
    setDeck(null);
    setText("");
  }

  const pct = timeLeft / SECONDS;
  const timerColor = pct > 0.5 ? "text-emerald-300" : pct > 0.2 ? "text-amber-300" : "text-red-300";

  // ── Phase 1: Pick deck ───────────────────────────────────────────────────
  if (phase === "pick") {
    return (
      <div className="space-y-3">
        {decks.map((d) => (
          <button
            key={d.id}
            onClick={() => startSession(d)}
            className="group w-full rounded-[2rem] border border-white/10 bg-white/5 p-5 text-left transition hover:border-white/20 hover:bg-white/8"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">{d.name}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {d.seenCards} reviewed · {d.totalCards} total
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white tabular-nums">{d.seenCards}</p>
                <p className="text-[10px] uppercase tracking-widest text-slate-500">to recall</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    );
  }

  // ── Phase 2: Write ───────────────────────────────────────────────────────
  if (phase === "write" && deck) {
    return (
      <div className="space-y-5">
        <button
          onClick={reset}
          className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Pick a different deck
        </button>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">{deck.name}</p>
              <p className="mt-0.5 text-xs text-slate-400">
                Write every word or concept you can remember — one per line or comma-separated
              </p>
            </div>
            <div className={`flex items-center gap-2 tabular-nums font-bold text-xl ${timerColor}`}>
              <Timer className="h-4 w-4" />
              {fmt(timeLeft)}
            </div>
          </div>

          <textarea
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={12}
            placeholder={"flywheel\nchurn\nB2B\nwedge\n…"}
            className="input-base font-mono text-sm leading-7"
          />

          <button
            onClick={submit}
            className="rounded-2xl bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
          >
            {timeLeft === 0 ? "Time's up — see results" : "I'm done — see results"}
          </button>
        </div>
      </div>
    );
  }

  // ── Phase 3: Results ─────────────────────────────────────────────────────
  if (phase === "results" && deck && results) {
    const score = results.remembered.length;
    const total = deck.seenCards;
    const pctScore = total > 0 ? Math.round((score / total) * 100) : 0;
    const scoreColor = pctScore >= 75 ? "text-emerald-300" : pctScore >= 45 ? "text-amber-300" : "text-red-300";
    const scoreBorder = pctScore >= 75 ? "border-emerald-400/25 bg-emerald-400/5" : pctScore >= 45 ? "border-amber-400/25 bg-amber-400/5" : "border-red-400/25 bg-red-400/5";

    return (
      <div className="space-y-5">
        {/* Score */}
        <div className={`rounded-[2rem] border p-6 sm:p-8 ${scoreBorder}`}>
          <div className="flex items-end gap-4">
            <p className={`text-6xl font-bold tabular-nums ${scoreColor}`}>
              {score}
              <span className="text-2xl text-slate-500">/{total}</span>
            </p>
            <div className="pb-1">
              <p className={`text-lg font-semibold ${scoreColor}`}>
                {pctScore >= 75 ? "Strong recall" : pctScore >= 45 ? "Getting there" : "Room to grow"}
              </p>
              <p className="text-sm text-slate-400">{pctScore}% of reviewed cards recalled · {deck.name}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Remembered */}
          {results.remembered.length > 0 ? (
            <div className="rounded-[2rem] border border-emerald-400/20 bg-emerald-400/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300">
                Remembered ({results.remembered.length})
              </p>
              <ul className="mt-3 space-y-1.5">
                {results.remembered.map((w) => (
                  <li key={w} className="flex gap-2 text-sm leading-6 text-slate-200">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Missed */}
          {results.missed.length > 0 ? (
            <div className="rounded-[2rem] border border-amber-400/20 bg-amber-400/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-300">
                Missed ({results.missed.length})
              </p>
              <p className="mt-1 text-[11px] text-slate-500">These are the cards to focus on next.</p>
              <ul className="mt-3 space-y-1.5">
                {results.missed.map((w) => (
                  <li key={w} className="flex gap-2 text-sm leading-6 text-slate-300">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {/* Unrecognised */}
        {results.unrecognised.length > 0 ? (
          <div className="rounded-[2rem] border border-white/8 bg-white/[0.02] p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Not in this deck ({results.unrecognised.length})
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {results.unrecognised.map((w) => (
                <span key={w} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
                  {w}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => startSession(deck)}
            className="rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
          >
            Try again
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Pick a different deck
          </button>
        </div>
      </div>
    );
  }

  return null;
}
