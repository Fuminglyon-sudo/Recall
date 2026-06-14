"use client";

import { useState } from "react";
import { MasteryBadge } from "./mastery-badge";

const GRADES = [
  { value: 0, label: "Blackout",  style: "border-red-500/30    bg-red-500/10    text-red-300    hover:bg-red-500/20" },
  { value: 1, label: "Wrong",     style: "border-red-400/25    bg-red-400/8     text-red-300    hover:bg-red-400/15" },
  { value: 2, label: "Hard",      style: "border-orange-400/30 bg-orange-400/10 text-orange-300 hover:bg-orange-400/20" },
  { value: 3, label: "Okay",      style: "border-yellow-400/25 bg-yellow-400/8  text-yellow-300 hover:bg-yellow-400/15" },
  { value: 4, label: "Good",      style: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20" },
  { value: 5, label: "Perfect",   style: "border-emerald-300/40 bg-emerald-300/15 text-emerald-200 hover:bg-emerald-300/25" },
];

export function ReviewCard({
  card,
  onGrade,
}: {
  card: {
    id: string;
    front: string;
    back: string;
    partOfSpeech: string | null;
    example: string | null;
    hook: string | null;
    synonyms: string | null;
    deckName: string;
    interval: number;
    repetitions: number;
  };
  onGrade: (formData: FormData) => void;
}) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
      <p className="text-xs uppercase tracking-[0.24em] text-emerald-300">{card.deckName}</p>

      {/* Front — styled like the deck-detail preview block */}
      <div className="mt-3 rounded-3xl border border-emerald-300/15 bg-slate-950/60 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Front</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{card.front}</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <MasteryBadge interval={card.interval} repetitions={card.repetitions} />
            {card.partOfSpeech ? (
              <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
                {card.partOfSpeech}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-400">Think first, then reveal when you are ready.</p>

      {!revealed ? (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="mt-5 rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 active:scale-95"
        >
          Reveal answer
        </button>
      ) : (
        <div className="mt-6 space-y-5 rounded-3xl border border-emerald-300/20 bg-slate-950/70 p-5">
          <Detail label="Definition" value={card.back} tone="primary" />

          <div className="grid gap-4 md:grid-cols-2">
            {card.example ? <Detail label="Example" value={card.example} /> : null}
            {card.hook ? <Detail label="Memory hook" value={card.hook} /> : null}
          </div>

          {card.synonyms ? <TagList label="Synonyms" value={card.synonyms} /> : null}

          <form action={onGrade} className="space-y-3 pt-3 border-t border-white/8">
            <input type="hidden" name="cardId" value={card.id} />
            <p className="text-sm font-medium text-slate-300">How well did you recall it?</p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {GRADES.map(({ value, label, style }) => (
                <button
                  key={value}
                  type="submit"
                  name="grade"
                  value={value}
                  className={`flex flex-col items-center gap-1 rounded-2xl border px-2 py-3 text-sm font-semibold transition ${style}`}
                >
                  <span className="text-base">{value}</span>
                  <span className="text-[10px] font-normal opacity-70">{label}</span>
                </button>
              ))}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "primary" }) {
  return (
    <div className={tone === "primary" ? "rounded-3xl border border-white/8 bg-white/[0.03] p-4" : "rounded-3xl border border-white/8 bg-white/[0.02] p-4"}>
      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm leading-7 text-slate-100">{value}</p>
    </div>
  );
}

function TagList({ label, value }: { label: string; value: string }) {
  const tags = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-white/8 bg-white/[0.02] p-4">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
