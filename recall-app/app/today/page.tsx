export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app-shell";
import { ReviewCard } from "@/components/review-card";
import { gradeCard } from "./actions";
import { isDatabaseReady } from "@/lib/db-ready";

const MAX_TODAY = 5;

export default async function TodayPage() {
  const ready = await isDatabaseReady();
  const allDue = ready
    ? await prisma.card.findMany({
        where: { dueAt: { lte: new Date() } },
        orderBy: [{ dueAt: "asc" }, { createdAt: "asc" }],
        include: { deck: true },
      })
    : [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Round-robin across decks so the 5 cards always mix subjects.
  // Build a queue per deck (already sorted oldest-due first), then
  // take one card per deck in turn until MAX_TODAY is filled.
  const deckQueues = new Map<string, typeof allDue>();
  for (const card of allDue) {
    if (!deckQueues.has(card.deckId)) deckQueues.set(card.deckId, []);
    deckQueues.get(card.deckId)!.push(card);
  }
  // Sort decks by their oldest due card so the most overdue deck goes first
  const sortedQueues = [...deckQueues.values()].sort(
    (a, b) => a[0].dueAt.getTime() - b[0].dueAt.getTime()
  );
  const shown: typeof allDue = [];
  let progress = true;
  while (shown.length < MAX_TODAY && progress) {
    progress = false;
    for (const queue of sortedQueues) {
      if (shown.length >= MAX_TODAY) break;
      if (queue.length > 0) {
        shown.push(queue.shift()!);
        progress = true;
      }
    }
  }

  const held = allDue.length - shown.length;
  const staleCount = shown.filter((c) => c.dueAt < today).length;

  return (
    <AppShell>
      <section className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
          <p className="text-sm font-medium text-emerald-300">Today</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            {allDue.length > 0 ? "Only what is due today." : "Done for today."}
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            {allDue.length > 0
              ? "Recall the answer, reveal it, and grade yourself honestly from 0 to 5. Strong cards drift farther away. Struggling cards return sooner."
              : "You finished the cards that asked for your attention. Nothing else is demanded of you right now."}
          </p>
        </div>

        {staleCount > 0 ? (
          <div className="rounded-[2rem] border border-amber-400/25 bg-amber-400/8 px-6 py-4">
            <p className="text-sm font-semibold text-amber-300">
              {staleCount === 1 ? "1 card is overdue" : `${staleCount} cards are overdue`} from a previous day
            </p>
            <p className="mt-1 text-sm leading-6 text-amber-200/70">
              These cards were due before today and have not been reviewed. Clear them first so your queue stays honest.
            </p>
          </div>
        ) : null}

        {held > 0 ? (
          <div className="rounded-[2rem] border border-slate-400/20 bg-white/[0.03] px-6 py-4">
            <p className="text-sm font-semibold text-slate-300">
              {held} more {held === 1 ? "card" : "cards"} waiting
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-400">
              Clear these {MAX_TODAY} first. The rest unlock once your current queue is empty.
            </p>
          </div>
        ) : null}

        {!ready ? (
          <div className="rounded-[2rem] border border-amber-300/20 bg-amber-400/10 p-10 text-center">
            <p className="text-xl font-semibold text-white">Database setup still needed.</p>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-amber-100">
              Run [`prisma migrate deploy`](package.json:1) against your PostgreSQL database so Recall can load your review queue.
            </p>
          </div>
        ) : shown.length === 0 ? (
          <div className="rounded-[2rem] border border-emerald-300/20 bg-emerald-400/8 p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-400/15 text-2xl">
              ✓
            </div>
            <p className="text-xl font-semibold text-white">All clear.</p>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-slate-400">You showed up. Nothing else is asked of you today. Come back when something new surfaces.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {shown.map((card) => (
              <ReviewCard
                key={card.id}
                card={{
                  id: card.id,
                  front: card.front,
                  back: card.back,
                  partOfSpeech: card.partOfSpeech,
                  example: card.example,
                  hook: card.hook,
                  synonyms: card.synonyms,
                  deckName: card.deck.name,
                  interval: card.interval,
                  repetitions: card.repetitions,
                }}
                stale={card.dueAt < today}
                onGrade={gradeCard}
              />
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
