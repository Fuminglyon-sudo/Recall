import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app-shell";
import { SubmitButton } from "@/components/forms";
import { updateCard } from "../actions";

export default async function DeckDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deck = await prisma.deck.findUnique({
    where: { id },
    include: {
      cards: { orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }] },
    },
  });

  if (!deck) notFound();

  return (
    <AppShell>
      <section className="space-y-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
          <p className="text-sm font-medium text-emerald-300">{deck.name}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">{deck.description ?? "Cards you want to revisit without pressure."}</h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">{deck.cards.length} cards in this deck. Edit anything when your understanding gets sharper.</p>
        </div>

        <div className="space-y-4">
          {deck.cards.map((card) => (
            <form key={card.id} action={updateCard} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
              <input type="hidden" name="cardId" value={card.id} />
              <input type="hidden" name="deckId" value={deck.id} />
              <div className="grid gap-5 lg:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-200">Front</span>
                  <input name="front" defaultValue={card.front} className="input-base" required />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-200">Part of speech</span>
                  <input name="partOfSpeech" defaultValue={card.partOfSpeech ?? ""} className="input-base" />
                </label>
              </div>
              <label className="mt-5 block space-y-2">
                <span className="text-sm font-medium text-slate-200">Back</span>
                <textarea name="back" defaultValue={card.back} rows={4} className="input-base" required />
              </label>
              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-200">Example</span>
                  <textarea name="example" defaultValue={card.example ?? ""} rows={3} className="input-base" />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-200">Memory hook</span>
                  <textarea name="hook" defaultValue={card.hook ?? ""} rows={3} className="input-base" />
                </label>
              </div>
              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-200">Synonyms</span>
                  <input name="synonyms" defaultValue={card.synonyms ?? ""} className="input-base" />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-200">Source context</span>
                  <textarea name="sourceContext" defaultValue={card.sourceContext ?? ""} rows={3} className="input-base" />
                </label>
              </div>
              <div className="mt-5 flex items-center justify-between gap-4">
                <p className="text-xs text-slate-500">Due {card.dueAt.toLocaleDateString()} · interval {card.interval} day{card.interval === 1 ? "" : "s"} · ease {card.easeFactor.toFixed(2)}</p>
                <SubmitButton label="Save edits" pendingLabel="Saving edits..." />
              </div>
            </form>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
