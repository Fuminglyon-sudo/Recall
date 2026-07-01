import Link from "next/link";
import { getMastery, MASTERY } from "@/lib/mastery";

type WordCard = {
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

export function WordOfTheDay({ card }: { card: WordCard | null }) {
  if (!card) return null;

  const level = getMastery(card.interval, card.repetitions);
  const meta = MASTERY[level];

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Word of the day</p>
          <p className="mt-1 text-xs text-slate-600">One word, brought back to the surface.</p>
        </div>
        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest ${meta.bg} ${meta.border} ${meta.color}`}>
          {meta.label}
        </span>
      </div>

      <div className="mt-4 rounded-2xl border border-emerald-300/15 bg-slate-950/60 p-4">
        <div className="flex flex-wrap items-baseline gap-3">
          <h2 className="text-2xl font-semibold text-white">{card.front}</h2>
          {card.partOfSpeech ? (
            <span className="text-xs text-slate-500">{card.partOfSpeech}</span>
          ) : null}
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-300">{card.back}</p>
        {card.example ? (
          <p className="mt-3 text-xs leading-6 italic text-slate-500">{card.example}</p>
        ) : null}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-slate-600">From {card.deckName}</p>
        <Link
          href={`/decks/${card.deckId}`}
          className="text-xs text-emerald-400 transition hover:text-emerald-300"
        >
          Open deck
        </Link>
      </div>
    </div>
  );
}
