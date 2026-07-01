import Link from "next/link";
import { MASTERY, type MasteryDistribution, type MasteryLevel } from "@/lib/mastery";

type DeckItem = {
  id: string;
  name: string;
  description: string | null;
  cardCount: number;
  dueCount: number;
  createdAt: Date;
  mastery?: MasteryDistribution;
};

const MASTERY_ORDER: MasteryLevel[] = ["new", "learning", "familiar", "mastered"];

export function DeckList({ decks }: { decks: DeckItem[] }) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Decks</h2>
          <p className="text-sm text-slate-400">Keep vocabulary, ideas, and personal notes in separate decks so reviews stay focused.</p>
        </div>
        <Link href="/decks" className="text-sm font-medium text-emerald-300 transition hover:text-emerald-200">Manage decks</Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {decks.map((deck) => (
          <Link key={deck.id} href={`/decks/${deck.id}`} className="group rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-emerald-300/30 hover:bg-white/8">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-white">{deck.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400 line-clamp-2">{deck.description ?? "A simple space for cards that belong together."}</p>
              </div>
              {deck.dueCount > 0 ? (
                <span className="shrink-0 rounded-full border border-emerald-300/25 bg-emerald-400/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                  {deck.dueCount} due
                </span>
              ) : (
                <span className="shrink-0 rounded-full border border-white/8 bg-white/5 px-2.5 py-1 text-xs text-slate-500">
                  clear
                </span>
              )}
            </div>

            {deck.mastery && deck.cardCount > 0 ? (
              <div className="mt-4">
                <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  {MASTERY_ORDER.map((lvl) => {
                    const pct = ((deck.mastery![lvl]) / deck.cardCount) * 100;
                    if (pct === 0) return null;
                    return (
                      <div
                        key={lvl}
                        className={`h-full ${MASTERY[lvl].bar}`}
                        style={{ width: `${pct}%` }}
                        title={`${MASTERY[lvl].label}: ${deck.mastery![lvl]}`}
                      />
                    );
                  })}
                </div>
                <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-500">
                  {MASTERY_ORDER.filter((lvl) => (deck.mastery![lvl] ?? 0) > 0).map((lvl) => (
                    <span key={lvl} className="flex items-center gap-1">
                      <span className={`h-1.5 w-1.5 rounded-full ${MASTERY[lvl].bar}`} />
                      {deck.mastery![lvl]} {MASTERY[lvl].label.toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>{deck.cardCount} card{deck.cardCount === 1 ? "" : "s"}</span>
              <span className="text-emerald-400 opacity-0 transition group-hover:opacity-100">Open →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
