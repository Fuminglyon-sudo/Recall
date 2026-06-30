export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { FreeRecallClient } from "@/components/free-recall-client";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId, scopedUserId } from "@/lib/session";

export default async function FreeRecallPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");
  const uid = scopedUserId(userId);

  const decks = await prisma.deck.findMany({
    where: { userId: uid },
    orderBy: { name: "asc" },
    include: {
      _count: { select: { cards: true } },
      cards: { select: { front: true, repetitions: true } },
    },
  });

  const perDeck = decks
    .filter((d) => d._count.cards > 0)
    .map((d) => ({
      id: d.id,
      name: d.name,
      totalCards: d._count.cards,
      seenCards: d.cards.filter((c) => c.repetitions > 0).length,
      fronts: d.cards.map((c) => c.front),
    }));

  const allFronts = [...new Set(perDeck.flatMap((d) => d.fronts))];
  const allSeen = [...new Set(
    decks.flatMap((d) => d.cards.filter((c) => c.repetitions > 0).map((c) => c.front))
  )];

  const allDecksOption = {
    id: "all",
    name: "All decks",
    totalCards: allFronts.length,
    seenCards: allSeen.length,
    fronts: allFronts,
  };

  const deckData = [allDecksOption, ...perDeck];

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
          <p className="text-sm font-medium text-emerald-300">Free recall</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            What can you remember right now?
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Pick a deck, then write down every word or concept you can recall — no hints, no cards. What you
            cannot name is exactly what needs more attention. This is the most effective memory exercise there is.
          </p>
        </section>
        <FreeRecallClient decks={deckData} />
      </div>
    </AppShell>
  );
}
