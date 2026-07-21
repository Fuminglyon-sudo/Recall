export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app-shell";
import { computeDistribution, MASTERY } from "@/lib/mastery";
import { CardAccordion } from "@/components/card-accordion";
import { DeckIO } from "@/components/deck-io";
import { DeckSharePanel } from "@/components/deck-share-panel";
import { updateCard, resetCard } from "../actions";
import { getCurrentUserId, scopedUserId } from "@/lib/session";

export default async function DeckDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getCurrentUserId();
  const uid = scopedUserId(userId ?? "");

  const deck = await prisma.deck.findFirst({
    where: { id, userId: uid },
    include: {
      cards: { orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }] },
    },
  });

  if (!deck) notFound();

  const dist = computeDistribution(deck.cards);
  const total = deck.cards.length || 1;

  const cards = deck.cards.map((card) => ({
    id: card.id,
    front: card.front,
    back: card.back,
    partOfSpeech: card.partOfSpeech,
    example: card.example,
    hook: card.hook,
    synonyms: card.synonyms,
    sourceContext: card.sourceContext,
    interval: card.interval,
    repetitions: card.repetitions,
    easeFactor: card.easeFactor,
    dueAt: card.dueAt.toISOString(),
  }));

  return (
    <AppShell>
      <section className="space-y-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
          <p className="text-sm font-medium text-emerald-300">{deck.name}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">{deck.description ?? "Cards you want to revisit without pressure."}</h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">{deck.cards.length} cards in this deck. Click any card to expand and edit it.</p>

          <div className="mt-5 border-t border-white/8 pt-5 space-y-5">
            <DeckIO deckId={deck.id} />
            <DeckSharePanel deckId={deck.id} shareToken={deck.shareToken ?? null} />
          </div>

          {deck.cards.length > 0 ? (
            <div className="mt-5">
              <div className="flex h-2 w-full overflow-hidden rounded-full bg-white/5">
                {(["new", "learning", "familiar", "mastered"] as const).map((lvl) => {
                  const pct = (dist[lvl] / total) * 100;
                  if (pct === 0) return null;
                  return <div key={lvl} className={`h-full ${MASTERY[lvl].bar}`} style={{ width: `${pct}%` }} title={`${MASTERY[lvl].label}: ${dist[lvl]}`} />;
                })}
              </div>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                {(["new", "learning", "familiar", "mastered"] as const).filter((lvl) => dist[lvl] > 0).map((lvl) => (
                  <span key={lvl} className="flex items-center gap-1">
                    <span className={`h-1.5 w-1.5 rounded-full ${MASTERY[lvl].bar}`} />
                    {dist[lvl]} {MASTERY[lvl].label.toLowerCase()}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {cards.length > 0 ? (
          <CardAccordion cards={cards} deckId={deck.id} updateCardAction={updateCard} resetCardAction={resetCard} />
        ) : (
          <div className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-8 text-center">
            <p className="text-sm text-slate-400">No cards yet. Add one to get started.</p>
          </div>
        )}
      </section>
    </AppShell>
  );
}
