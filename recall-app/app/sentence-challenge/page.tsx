export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app-shell";
import { SentenceChallengeClient } from "@/components/sentence-challenge-client";
import { isDatabaseReady } from "@/lib/db-ready";
import { getCurrentUserId, scopedUserId } from "@/lib/session";

export default async function SentenceChallengePage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");
  const uid = scopedUserId(userId);

  const ready = await isDatabaseReady();

  const rawCards = ready
    ? await prisma.card.findMany({
        where: { interval: { gte: 7 }, deck: { userId: uid } },
        include: { deck: { select: { id: true, name: true } } },
        orderBy: [{ interval: "desc" }, { front: "asc" }],
      })
    : [];

  const cards = rawCards.map((c) => ({
    id: c.id,
    front: c.front,
    back: c.back,
    partOfSpeech: c.partOfSpeech,
    example: c.example,
    interval: c.interval,
    repetitions: c.repetitions,
    deckId: c.deck.id,
    deckName: c.deck.name,
  }));

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
          <p className="text-sm font-medium text-emerald-300">Sentence challenge</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            Use it in a sentence.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            Recognition is not mastery — using a word in context is. Pick any word you know, read the scenario, then write one sentence using it naturally. The AI will grade your usage and show you a model sentence.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {cards.length} word{cards.length !== 1 ? "s" : ""} eligible — cards you have reviewed enough to try in context.
          </p>
        </section>

        <SentenceChallengeClient cards={cards} />
      </div>
    </AppShell>
  );
}
