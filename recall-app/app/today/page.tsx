export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app-shell";
import { ReviewCard } from "@/components/review-card";
import { gradeCard } from "./actions";
import { isDatabaseReady } from "@/lib/db-ready";

const MAX_NEW = 3;

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

  // Split: cards already reviewed at least once vs brand-new cards
  const reviewCards = allDue.filter((c) => c.repetitions > 0);
  const newCardsDue = allDue.filter((c) => c.repetitions === 0);

  // Reviews always show in full. New cards are capped at MAX_NEW,
  // round-robined across decks so each day's batch has variety.
  const newQueues = new Map<string, typeof allDue>();
  for (const card of newCardsDue) {
    if (!newQueues.has(card.deckId)) newQueues.set(card.deckId, []);
    newQueues.get(card.deckId)!.push(card);
  }
  const sortedNewQueues = [...newQueues.values()].sort(
    (a, b) => a[0].dueAt.getTime() - b[0].dueAt.getTime()
  );
  const shownNew: typeof allDue = [];
  let hasMore = true;
  while (shownNew.length < MAX_NEW && hasMore) {
    hasMore = false;
    for (const queue of sortedNewQueues) {
      if (shownNew.length >= MAX_NEW) break;
      if (queue.length > 0) {
        shownNew.push(queue.shift()!);
        hasMore = true;
      }
    }
  }

  const shown = [...reviewCards, ...shownNew];
  const heldNew = newCardsDue.length - shownNew.length;
  const staleCount = shown.filter((c) => c.dueAt < today).length;
  const totalDue = allDue.length;

  return (
    <AppShell>
      <section className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
          <p className="text-sm font-medium text-emerald-300">Today</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            {totalDue > 0 ? "Only what is due today." : "Done for today."}
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            {totalDue > 0
              ? "Recall the answer, reveal it, and grade yourself honestly from 0 to 5. Strong cards drift farther away. Struggling cards return sooner."
              : "You finished the cards that asked for your attention. Nothing else is demanded of you right now."}
          </p>
          {shown.length > 0 ? (
            <p className="mt-3 text-xs text-slate-500">
              {reviewCards.length > 0 && (
                <span>{reviewCards.length} review{reviewCards.length !== 1 ? "s" : ""}</span>
              )}
              {reviewCards.length > 0 && shownNew.length > 0 && <span> · </span>}
              {shownNew.length > 0 && (
                <span>{shownNew.length} new</span>
              )}
            </p>
          ) : null}
        </div>

        {staleCount > 0 ? (
          <div className="rounded-[2rem] border border-amber-400/25 bg-amber-400/8 px-6 py-4">
            <p className="text-sm font-semibold text-amber-300">
              {staleCount === 1 ? "1 card is overdue" : `${staleCount} cards are overdue`} from a previous day
            </p>
            <p className="mt-1 text-sm leading-6 text-amber-200/70">
              These were due before today and have not been reviewed. Clear them first so your queue stays honest.
            </p>
          </div>
        ) : null}

        {heldNew > 0 ? (
          <div className="rounded-[2rem] border border-slate-400/20 bg-white/[0.03] px-6 py-4">
            <p className="text-sm font-semibold text-slate-300">More cards are waiting</p>
            <p className="mt-1 text-sm leading-6 text-slate-400">
              {heldNew} new card{heldNew !== 1 ? "s" : ""} from a missed day will carry forward to tomorrow.
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
