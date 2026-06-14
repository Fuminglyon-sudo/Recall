"use client";

import { useState } from "react";

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
  };
  onGrade: (formData: FormData) => void;
}) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
      <p className="text-xs uppercase tracking-[0.24em] text-emerald-300">{card.deckName}</p>
      <h2 className="mt-4 text-2xl font-semibold text-white">{card.front}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-300">Think first, then reveal when you are ready.</p>

      {!revealed ? (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Reveal answer
        </button>
      ) : (
        <div className="mt-6 space-y-4 rounded-3xl border border-emerald-300/20 bg-slate-950/70 p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Definition</p>
            <p className="mt-2 text-sm leading-7 text-slate-200">{card.back}</p>
          </div>
          {card.partOfSpeech ? <Detail label="Part of speech" value={card.partOfSpeech} /> : null}
          {card.example ? <Detail label="Example" value={card.example} /> : null}
          {card.hook ? <Detail label="Memory hook" value={card.hook} /> : null}
          {card.synonyms ? <Detail label="Synonyms" value={card.synonyms} /> : null}

          <form action={onGrade} className="space-y-3 pt-3">
            <input type="hidden" name="cardId" value={card.id} />
            <p className="text-sm text-slate-300">How well did you recall it?</p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {[0, 1, 2, 3, 4, 5].map((grade) => (
                <button
                  key={grade}
                  type="submit"
                  name="grade"
                  value={grade}
                  className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  {grade}
                </button>
              ))}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm leading-7 text-slate-200">{value}</p>
    </div>
  );
}
