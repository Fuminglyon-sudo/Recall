export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatRelativeDay, isSameCalendarDay } from "@/lib/date";
import { AppShell } from "@/components/app-shell";
import { StatCard } from "@/components/stat-card";
import { CalmCard } from "@/components/calm-card";
import { DeckList } from "@/components/deck-list";
import { computeDistribution, MASTERY, type MasteryLevel } from "@/lib/mastery";
import { isDatabaseReady } from "@/lib/db-ready";
import { HowToUse } from "@/components/how-to-use";
import { PhraseItPanel } from "@/components/phrase-it-panel";
import { saveTone } from "@/app/voice/actions";
import { StreakCalendar } from "@/components/streak-calendar";
import { UpcomingReviews } from "@/components/upcoming-reviews";
import { WordOfTheDay } from "@/components/word-of-the-day";

async function getDashboardData() {
  const today = new Date();
  const todayStart = new Date(today);
  todayStart.setHours(0, 0, 0, 0);

  const tablesReady = await isDatabaseReady();

  if (!tablesReady) {
    return {
      dueToday: 0,
      totalCards: 0,
      currentStreak: 0,
      reviewedToday: false,
      mastery: computeDistribution([]),
      voiceTone: "",
      decks: [],
      reviewDays: [] as string[],
      upcomingByDay: {} as Record<string, number>,
      wordOfDay: null,
    };
  }

  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 27);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const tomorrowStart = new Date(today);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  tomorrowStart.setHours(0, 0, 0, 0);

  const in8Days = new Date(tomorrowStart);
  in8Days.setDate(in8Days.getDate() + 7);

  const [streak, decks, voiceProfile, reviewLogsRaw, upcomingRaw, wordCandidates] = await Promise.all([
    prisma.streak.findFirst(),
    prisma.deck.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        _count: { select: { cards: true } },
        cards: {
          select: { id: true, interval: true, repetitions: true, dueAt: true },
        },
      },
    }),
    prisma.voiceProfile.findFirst(),
    prisma.reviewLog.findMany({
      where: { reviewedAt: { gte: thirtyDaysAgo } },
      select: { reviewedAt: true },
    }),
    prisma.card.findMany({
      where: { dueAt: { gte: tomorrowStart, lt: in8Days } },
      select: { dueAt: true },
    }),
    prisma.card.findMany({
      where: { repetitions: { gte: 1 } },
      include: { deck: { select: { id: true, name: true } } },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const reviewDays = [...new Set(reviewLogsRaw.map((l) => l.reviewedAt.toISOString().split("T")[0]))];

  const upcomingByDay: Record<string, number> = {};
  for (const card of upcomingRaw) {
    const key = card.dueAt.toISOString().split("T")[0];
    upcomingByDay[key] = (upcomingByDay[key] ?? 0) + 1;
  }

  const dayIndex = Math.floor(Date.now() / 86400000);
  const wordOfDayRaw = wordCandidates.length > 0 ? wordCandidates[dayIndex % wordCandidates.length] : null;
  const wordOfDay = wordOfDayRaw
    ? {
        id: wordOfDayRaw.id,
        front: wordOfDayRaw.front,
        back: wordOfDayRaw.back,
        partOfSpeech: wordOfDayRaw.partOfSpeech,
        example: wordOfDayRaw.example,
        interval: wordOfDayRaw.interval,
        repetitions: wordOfDayRaw.repetitions,
        deckId: wordOfDayRaw.deck.id,
        deckName: wordOfDayRaw.deck.name,
      }
    : null;

  const allDueCards = decks.flatMap((d) => d.cards).filter((c) => c.dueAt <= today);
  const reviewsDue = allDueCards.filter((c) => c.repetitions > 0).length;
  const newDue = Math.min(allDueCards.filter((c) => c.repetitions === 0).length, 6);
  const dueTodayCount = reviewsDue + newDue;

  const allCards = decks.flatMap((d: typeof decks[number]) => d.cards);
  const mastery = computeDistribution(allCards);

  return {
    dueToday: dueTodayCount,
    totalCards: allCards.length,
    currentStreak: streak?.currentStreak ?? 0,
    reviewedToday: streak?.lastReviewDate ? isSameCalendarDay(streak.lastReviewDate, todayStart) : false,
    mastery,
    voiceTone: voiceProfile?.tone ?? "",
    decks: decks.map((deck) => ({
      id: deck.id,
      name: deck.name,
      description: deck.description,
      cardCount: deck._count.cards,
      dueCount: deck.cards.filter((c) => c.dueAt <= today).length,
      createdAt: deck.createdAt,
      mastery: computeDistribution(deck.cards),
    })),
    reviewDays,
    upcomingByDay,
    wordOfDay,
  };
}

const MASTERY_ORDER: MasteryLevel[] = ["new", "learning", "familiar", "mastered"];

export default async function HomePage() {
  const data = await getDashboardData();
  const total = data.totalCards || 1;

  return (
    <AppShell>
      <section className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-medium text-emerald-300">Recall</p>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            A calm place to keep words, ideas, and founder language close.
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Review what is due today, add a new card when something matters, and build language you can use
            naturally when talking about Japa Reality and Sharpen.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Current streak" value={String(data.currentStreak)} helper={data.reviewedToday ? "You showed up today." : "Your rhythm resumes today."} />
          <StatCard label="Mastered" value={String(data.mastery.mastered)} helper={data.mastery.mastered > 0 ? "Cards that have earned long intervals." : "Your first mastered card is closer than it looks."} />
          <StatCard label="Due today" value={String(data.dueToday)} helper={data.dueToday > 0 ? "A small session is enough." : "You are clear for today."} />
        </div>

        <WordOfTheDay card={data.wordOfDay} />

        <PhraseItPanel initialTone={data.voiceTone} saveToneAction={saveTone} />

        <HowToUse />

        {/* Mastery distribution */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Mastery</p>
              <p className="mt-1 text-base font-semibold text-white">
                {data.mastery.mastered} of {data.totalCards} card{data.totalCards === 1 ? "" : "s"} mastered
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              {MASTERY_ORDER.map((lvl) => (
                <span key={lvl} className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${MASTERY[lvl].bar}`} />
                  {MASTERY[lvl].label}
                  <span className="font-medium text-slate-300">{data.mastery[lvl]}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Segmented progress bar */}
          <div className="mt-4 flex h-2.5 w-full overflow-hidden rounded-full bg-white/5">
            {MASTERY_ORDER.map((lvl) => {
              const pct = (data.mastery[lvl] / total) * 100;
              if (pct === 0) return null;
              return (
                <div
                  key={lvl}
                  className={`h-full transition-all ${MASTERY[lvl].bar}`}
                  style={{ width: `${pct}%` }}
                  title={`${MASTERY[lvl].label}: ${data.mastery[lvl]}`}
                />
              );
            })}
          </div>

          {/* Per-mastery breakdown cards */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {MASTERY_ORDER.map((lvl) => {
              const meta = MASTERY[lvl];
              const count = data.mastery[lvl];
              return (
                <div key={lvl} className={`rounded-2xl border p-3 ${meta.bg} ${meta.border}`}>
                  <p className={`text-xs font-medium ${meta.color}`}>{meta.label}</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{count}</p>
                  <p className="text-xs text-slate-500">{total > 0 ? Math.round((count / total) * 100) : 0}%</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <StreakCalendar reviewDays={data.reviewDays} />
          <UpcomingReviews byDay={data.upcomingByDay} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.35fr_0.9fr]">
          <CalmCard
            title="Today"
            body={
              data.dueToday > 0
                ? `${data.dueToday} card${data.dueToday === 1 ? " is" : "s are"} ready. Start with what is in front of you.`
                : "Nothing urgent is waiting. If you want, add one card while something is still fresh."
            }
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/today"
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
              >
                Open today&apos;s review
              </Link>
              <Link
                href="/cards/new"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Add a new card
              </Link>
            </div>
          </CalmCard>

          <CalmCard title="Founder vocabulary" body="A dedicated deck seeded from your other products so you can speak about what you built with more precision and ease.">
            <div className="space-y-3 text-sm text-slate-300">
              {data.decks
                .filter((deck) => deck.name === "Founder Vocabulary")
                .map((deck) => (
                  <div key={deck.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <p className="font-medium text-white">{deck.cardCount} cards ready</p>
                    <p className="mt-1 text-slate-400">
                      {deck.dueCount} due {deck.dueCount === 0 ? "today" : formatRelativeDay(new Date())}
                    </p>
                    <Link href={`/decks/${deck.id}`} className="mt-3 inline-flex text-emerald-300 transition hover:text-emerald-200">
                      Open founder deck
                    </Link>
                  </div>
                ))}
            </div>
          </CalmCard>
        </div>

        <DeckList decks={data.decks} />
      </section>
    </AppShell>
  );
}
