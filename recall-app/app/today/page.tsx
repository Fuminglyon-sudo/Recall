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
          <div className="rounded-[2rem] border border-emerald-300/20 bg-emerald-400/10 p-8 text-center">
            <p className="text-lg font-semibold text-white">Done for today</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">You can close the app here, or add a new card while a thought is still fresh.</p>
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
