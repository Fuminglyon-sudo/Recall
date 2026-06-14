import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app-shell";
import { ReviewCard } from "@/components/review-card";
import { gradeCard } from "./actions";

export default async function TodayPage() {
  const dueCards = await prisma.card.findMany({
    where: { dueAt: { lte: new Date() } },
    orderBy: [{ dueAt: "asc" }, { createdAt: "asc" }],
    include: { deck: true },
  });

  return (
    <AppShell>
      <section className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
          <p className="text-sm font-medium text-emerald-300">Today</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">{dueCards.length > 0 ? "Only what is due today." : "Done for today."}</h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            {dueCards.length > 0
              ? "Recall the answer, reveal it, and grade yourself honestly from 0 to 5. Strong cards drift farther away. Struggling cards return sooner."
              : "You finished the cards that asked for your attention. Nothing else is demanded of you right now."}
          </p>
        </div>

        {dueCards.length === 0 ? (
          <div className="rounded-[2rem] border border-emerald-300/20 bg-emerald-400/8 p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-400/15 text-2xl">
              ✓
            </div>
            <p className="text-xl font-semibold text-white">All clear.</p>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-slate-400">You showed up. Nothing else is asked of you today. Come back when something new surfaces.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {dueCards.map((card) => (
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
                onGrade={gradeCard}
              />
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
