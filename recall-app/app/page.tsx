export const dynamic = "force-dynamic";

import type { Metadata } from "next";
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
import { getCurrentUserId, scopedUserId } from "@/lib/session";
import { PushPrompt } from "@/components/push-prompt";
import { LandingPage } from "@/components/landing-page";

// ── SEO metadata (shown to crawlers on the landing route) ───────────────────
export const metadata: Metadata = {
  title: "Recall — Spaced repetition for words, ideas, and language",
  description:
    "Recall is a calm flashcard app powered by spaced repetition (SM-2) and Claude AI. Build vocabulary, capture ideas, and review what matters — one card at a time.",
  openGraph: {
    title: "Recall — Spaced repetition for words, ideas, and language",
    description:
      "A calm place to keep words, ideas, and language close. Recall uses SM-2 spaced repetition and Claude AI to help you remember what matters.",
    type: "website",
  },
};

// ── Dashboard data ───────────────────────────────────────────────────────────
async function getDashboardData(uid: string | null) {
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
    prisma.streak.findFirst({ where: { userId: uid } }),
    prisma.deck.findMany({
      where: { userId: uid },
      orderBy: { createdAt: "asc" },
      include: {
        _count: { select: { cards: true } },
        cards: {
          select: { id: true, interval: true, repetitions: true, dueAt: true },
        },
      },
    }),
    prisma.voiceProfile.findFirst({ where: { userId: uid } }),
    prisma.reviewLog.findMany({
      where: { reviewedAt: { gte: thirtyDaysAgo }, card: { deck: { userId: uid } } },
      select: { reviewedAt: true },
    }),
    prisma.card.findMany({
      where: { dueAt: { gte: tomorrowStart, lt: in8Days }, deck: { userId: uid } },
      select: { dueAt: true },
    }),
    prisma.card.findMany({
      where: { repetitions: { gte: 1 }, deck: { userId: uid } },
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
  const newDue = Math.min(allDueCards.filter((c) => c.repetitions === 0).length, 3);
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

// ── Dashboard (authenticated) ────────────────────────────────────────────────
async function Dashboard({ uid }: { uid: string | null }) {
  const data = await getDashboardData(uid);
  const total = data.totalCards || 1;

  return (
    <AppShell>
      <section className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-medium text-emerald-300">Recall</p>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            A calm place to keep words, ideas, and language close.
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Review what is due today, add a new card when something matters, and build the language you want to use naturally.
          </p>
        </div>

        {process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ? (
          <PushPrompt vapidPublicKey={process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY} />
        ) : null}

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Current streak" value={String(data.currentStreak)} helper={data.reviewedToday ? "You showed up today." : "Your rhythm resumes today."} />
          <StatCard label="Mastered" value={String(data.mastery.mastered)} helper={data.mastery.mastered > 0 ? "Words that have settled into you." : "Your first mastered card is closer than it looks."} />
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

          <CalmCard
            title="Your decks"
            body="Every deck flows into the same daily review. Different corners of your vocabulary, one quiet practice."
          >
            <div className="space-y-2">
              {data.decks.slice(0, 3).map((deck) => (
                <div key={deck.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{deck.name}</p>
                    <p className="text-xs text-slate-500">{deck.cardCount} card{deck.cardCount === 1 ? "" : "s"}</p>
                  </div>
                  {deck.dueCount > 0 ? (
                    <span className="ml-3 shrink-0 rounded-full border border-emerald-300/25 bg-emerald-400/15 px-2 py-0.5 text-xs font-semibold text-emerald-300">
                      {deck.dueCount} due
                    </span>
                  ) : (
                    <span className="ml-3 shrink-0 text-xs text-slate-600">clear</span>
                  )}
                </div>
              ))}
              {data.decks.length > 3 && (
                <Link href="/decks" className="block pt-1 text-xs text-slate-500 transition hover:text-slate-300">
                  +{data.decks.length - 3} more decks →
                </Link>
              )}
            </div>
          </CalmCard>
        </div>

        <DeckList decks={data.decks} />
      </section>
    </AppShell>
  );
}

// ── Route ────────────────────────────────────────────────────────────────────
export default async function HomePage() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return <LandingPage />;
  }

  const uid = scopedUserId(userId);
  return <Dashboard uid={uid} />;
}
