import Link from "next/link";

type DeckItem = {
  id: string;
  name: string;
  description: string | null;
  cardCount: number;
  dueCount: number;
  createdAt: Date;
};

export function DeckList({ decks }: { decks: DeckItem[] }) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Decks</h2>
          <p className="text-sm text-slate-400">Keep vocabulary, founder language, and personal memories separate but gentle.</p>
        </div>
        <Link href="/decks" className="text-sm font-medium text-emerald-300 transition hover:text-emerald-200">Manage decks</Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {decks.map((deck) => (
          <Link key={deck.id} href={`/decks/${deck.id}`} className="rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-emerald-300/30 hover:bg-white/8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-white">{deck.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{deck.description ?? "A simple space for cards that belong together."}</p>
              </div>
              <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-medium text-emerald-300">{deck.dueCount} due</span>
            </div>
            <div className="mt-5 flex items-center justify-between text-sm text-slate-300">
              <span>{deck.cardCount} cards</span>
              <span>Open →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
