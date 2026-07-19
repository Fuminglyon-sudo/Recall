export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { isSameCalendarDay } from "@/lib/date";
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
import { AchievementsDisplay } from "@/components/achievements-display";
import { RecoverStreakButton } from "@/components/recover-streak-button";
import { SoroSokeLogo } from "@/components/soro-soke-logo";
import { SoroSokeMark } from "@/components/soro-soke-mark";
import { landingMetadata } from "@/app/landing/page";

// ── SEO metadata ──────────────────────────────────────────────────────────
// "/" is auth-gated content, not a fixed page: logged-out visitors (which
// includes every crawler — Googlebot never carries a session cookie) get
// the marketing LandingPage below, logged-in visitors get the Dashboard.
// A static `metadata` export can't see auth state, so it previously
// declared "Dashboard" + noindex unconditionally — meaning Google saw
// good marketing content on the site's most important URL, wrapped in
// meta tags telling it not to index that URL or follow its links.
// generateMetadata() lets each case get metadata that actually matches
// what's rendered.
export async function generateMetadata(): Promise<Metadata> {
  const userId = await getCurrentUserId();
  if (!userId) return landingMetadata;

  return {
    title: "Dashboard — Sọrọ Sọkẹ AI",
    description: "Your Sọrọ Sọkẹ AI dashboard: review due cards, track your streak, and manage your decks.",
    robots: { index: false, follow: false },
  };
}

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
      strugglingCount: 0,
      practiceStats: { speakAvg: null as number | null, socialAvg: null as number | null, debateAvg: null as number | null, weakestGoal: null as string | null, speakCount: 0, socialCount: 0, debateCount: 0 },
      coachingInsight: null as { message: string; cta?: { label: string; href: string } } | null,
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

  const yesterday = new Date(todayStart);
  yesterday.setDate(yesterday.getDate() - 1);

  const [streak, decks, voiceProfile, reviewLogsRaw, upcomingRaw, wordCandidates, speakSessions, socialSessions, debateSessions, userSettings, userAchievements] = await Promise.all([
    prisma.streak.findFirst({ where: { userId: uid } }),
    prisma.deck.findMany({
      where: { userId: uid },
      orderBy: { createdAt: "asc" },
      include: {
        _count: { select: { cards: true } },
        cards: {
          select: { id: true, interval: true, repetitions: true, easeFactor: true, dueAt: true },
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
    prisma.speakUpSession.findMany({
      where: { userId: uid },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { score: true, practiceGoal: true, createdAt: true },
    }),
    prisma.socialSession.findMany({
      where: { userId: uid },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { score: true, practiceGoal: true, createdAt: true },
    }),
    prisma.debateSession.findMany({
      where: { userId: uid },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { score: true, createdAt: true },
    }),
    uid ? prisma.userSettings.findFirst({ where: { userId: uid } }) : Promise.resolve(null),
    uid ? prisma.userAchievement.findMany({ where: { userId: uid }, orderBy: { unlockedAt: "desc" } }) : Promise.resolve([]),
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
  const maxNewCards = userSettings?.dailyNewCards ?? 3;
  const newDue = Math.min(allDueCards.filter((c) => c.repetitions === 0).length, maxNewCards);
  const dueTodayCount = reviewsDue + newDue;

  const allCards = decks.flatMap((d: typeof decks[number]) => d.cards);
  const mastery = computeDistribution(allCards);
  const strugglingCount = allCards.filter((c) => c.easeFactor < 2.0 && c.repetitions > 0).length;

  const speakAvg = speakSessions.length > 0
    ? Math.round(speakSessions.reduce((s, x) => s + x.score, 0) / speakSessions.length)
    : null;
  const socialAvg = socialSessions.length > 0
    ? Math.round(socialSessions.reduce((s, x) => s + x.score, 0) / socialSessions.length)
    : null;
  const debateAvg = debateSessions.length > 0
    ? Math.round(debateSessions.reduce((s, x) => s + x.score, 0) / debateSessions.length)
    : null;
  const weakestGoal = computeWeakestGoal([...speakSessions, ...socialSessions]);
  const coachingInsight = computeCoachingInsight(speakSessions, socialSessions, strugglingCount);

  const lastDate = streak?.lastReviewDate ?? null;
  const streakBroken =
    !lastDate ||
    (!isSameCalendarDay(lastDate, todayStart) && !isSameCalendarDay(lastDate, yesterday));
  const recoveryUsedAt = streak?.recoveryUsedAt ?? null;
  const recoveryAvailable =
    !recoveryUsedAt ||
    (Date.now() - recoveryUsedAt.getTime()) / (1000 * 60 * 60 * 24) >= 7;
  const longestStreak = streak?.longestStreak ?? 0;
  const showStreakRecovery = streakBroken && longestStreak > 0 && recoveryAvailable;

  return {
    dueToday: dueTodayCount,
    totalCards: allCards.length,
    currentStreak: streak?.currentStreak ?? 0,
    longestStreak,
    showStreakRecovery,
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
    strugglingCount,
    achievements: userAchievements,
    practiceStats: { speakAvg, socialAvg, debateAvg, weakestGoal, speakCount: speakSessions.length, socialCount: socialSessions.length, debateCount: debateSessions.length },
    coachingInsight,
  };
}

type SessionWithDate = { score: number; practiceGoal: string | null; createdAt: Date };

function computeCoachingInsight(
  speakSessions: SessionWithDate[],
  socialSessions: SessionWithDate[],
  strugglingCount: number,
): { message: string; cta?: { label: string; href: string } } | null {
  const allSessions = [...speakSessions, ...socialSessions].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
  if (allSessions.length < 2) return null;

  const recent = allSessions.slice(0, Math.min(3, allSessions.length));
  const prior = allSessions.slice(3, Math.min(6, allSessions.length));
  const recentAvg = recent.reduce((s, x) => s + x.score, 0) / recent.length;

  if (prior.length >= 2) {
    const priorAvg = prior.reduce((s, x) => s + x.score, 0) / prior.length;
    if (recentAvg >= priorAvg + 1.5) {
      return {
        message: `Your last ${recent.length} sessions averaged ${Math.round(recentAvg)}/10 — up ${Math.round(recentAvg - priorAvg)} points from before. Whatever you changed, keep it.`,
      };
    }
    if (priorAvg >= recentAvg + 1.5) {
      return {
        message: `Your last ${recent.length} sessions averaged ${Math.round(recentAvg)}/10, down from ${Math.round(priorAvg)}. Try dropping the difficulty one level — rebuilding on solid ground is faster than grinding on hard.`,
        cta: { label: "Open Speak Up", href: "/speak-up" },
      };
    }
  }

  const withGoal = allSessions.filter(
    (s): s is { score: number; practiceGoal: string; createdAt: Date } => s.practiceGoal !== null
  );
  if (withGoal.length >= 4) {
    const byGoal: Record<string, { total: number; count: number }> = {};
    for (const s of withGoal) {
      if (!byGoal[s.practiceGoal]) byGoal[s.practiceGoal] = { total: 0, count: 0 };
      byGoal[s.practiceGoal].total += s.score;
      byGoal[s.practiceGoal].count++;
    }
    const overallAvg = allSessions.reduce((s, x) => s + x.score, 0) / allSessions.length;
    let weakest: string | null = null;
    let weakestAvg = Infinity;
    for (const [goal, data] of Object.entries(byGoal)) {
      if (data.count >= 2) {
        const avg = data.total / data.count;
        if (avg < weakestAvg && avg < overallAvg - 0.8) { weakestAvg = avg; weakest = goal; }
      }
    }
    if (weakest) {
      return {
        message: `Your "${weakest}" sessions average ${Math.round(weakestAvg)}/10 — your lowest area, against a ${Math.round(overallAvg)}/10 overall. Make it your focus for the next two sessions.`,
        cta: { label: "Practice now", href: "/speak-up" },
      };
    }
  }

  if (allSessions.length >= 4 && recentAvg >= 8) {
    return {
      message: `You are averaging ${Math.round(recentAvg)}/10 recently. Raise the difficulty to Hard or try a scenario type you normally avoid — easy wins stop building new skills.`,
    };
  }

  if (strugglingCount >= 5 && allSessions.length <= 4) {
    return {
      message: `${strugglingCount} cards keep failing in review. Saying a word is different from recognising it — use them in Speak Up and they will stick faster.`,
      cta: { label: "Open Speak Up", href: "/speak-up" },
    };
  }

  return null;
}

function computeWeakestGoal(sessions: { score: number; practiceGoal: string | null }[]): string | null {
  const withGoal = sessions.filter((s): s is { score: number; practiceGoal: string } => s.practiceGoal !== null);
  if (withGoal.length < 3) return null;
  const byGoal: Record<string, { total: number; count: number }> = {};
  for (const s of withGoal) {
    if (!byGoal[s.practiceGoal]) byGoal[s.practiceGoal] = { total: 0, count: 0 };
    byGoal[s.practiceGoal].total += s.score;
    byGoal[s.practiceGoal].count++;
  }
  let weakest: string | null = null;
  let weakestAvg = Infinity;
  for (const [goal, data] of Object.entries(byGoal)) {
    if (data.count >= 2) {
      const avg = data.total / data.count;
      if (avg < weakestAvg) { weakestAvg = avg; weakest = goal; }
    }
  }
  return weakest;
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
          <div className="flex items-center gap-1.5">
            <SoroSokeMark size={18} className="shrink-0" />
            <SoroSokeLogo fontSize="1.05rem" color="#4ade80" textShadow="0 0 20px rgba(52,211,153,0.25)" duration={1.2} />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            A calm place to keep words, ideas, and language close.
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Review what is due. Practice saying it clearly. Work on the conversations that matter. Three things that build on each other — and compound the more consistently you do them.
          </p>
        </div>

        {process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ? (
          <PushPrompt vapidPublicKey={process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY} />
        ) : null}

        {data.showStreakRecovery ? (
          <RecoverStreakButton longestStreak={data.longestStreak} />
        ) : null}

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Current streak" value={String(data.currentStreak)} helper={data.reviewedToday ? "You showed up today." : "Your rhythm resumes today."} href="/streak" />
          <StatCard label="Mastered" value={String(data.mastery.mastered)} helper={data.mastery.mastered > 0 ? "Words that have settled into you." : "Your first mastered card is closer than it looks."} />
          <StatCard label="Due today" value={String(data.dueToday)} helper={data.dueToday > 0 ? "A small session is enough." : "You are clear for today."} />
        </div>

        {data.strugglingCount > 0 ? (
          <div className="rounded-[2rem] border border-amber-400/20 bg-amber-400/5 px-5 py-4">
            <p className="text-sm font-semibold text-amber-300">
              {data.strugglingCount} card{data.strugglingCount === 1 ? "" : "s"} not sticking yet
            </p>
            <p className="mt-1 text-xs leading-5 text-amber-200/60">
              These keep coming back with low grades. Honest grading and your personal anchor will help them settle. Find them in your decks.
            </p>
            <Link href="/speak-up" className="mt-3 inline-flex text-xs font-semibold text-amber-300 transition hover:text-amber-200">
              Practice them in Speak Up →
            </Link>
          </div>
        ) : null}

        {/* Practice loop */}
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Your practice loop</p>
          <p className="mt-1 text-sm text-slate-400">Four modes that build on each other.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/today" className="group rounded-2xl border border-white/8 bg-white/[0.03] p-4 transition hover:border-white/15 hover:bg-white/[0.06]">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 group-hover:text-slate-400">1 · Remember it</p>
              <p className="mt-1 text-sm font-medium text-white">Daily review</p>
              <p className="mt-1 text-xs leading-5 text-slate-400">Cards. Spaced repetition. Grade honestly.</p>
            </Link>
            <Link href="/speak-up" className="group rounded-2xl border border-white/8 bg-white/[0.03] p-4 transition hover:border-white/15 hover:bg-white/[0.06]">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 group-hover:text-slate-400">2 · Express clearly</p>
              <p className="mt-1 text-sm font-medium text-white">Speak Up</p>
              <p className="mt-1 text-xs leading-5 text-slate-400">Say what you mean under pressure. Get honest feedback.</p>
            </Link>
            <Link href="/conversation-lab" className="group rounded-2xl border border-white/8 bg-white/[0.03] p-4 transition hover:border-white/15 hover:bg-white/[0.06]">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 group-hover:text-slate-400">3 · Connect naturally</p>
              <p className="mt-1 text-sm font-medium text-white">Small Talk Lab</p>
              <p className="mt-1 text-xs leading-5 text-slate-400">Connect with people naturally. Open, sustain, close well.</p>
            </Link>
            <Link href="/debate-lab" className="group rounded-2xl border border-amber-400/10 bg-amber-400/5 p-4 transition hover:border-amber-400/20 hover:bg-amber-400/8">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-500/70 group-hover:text-amber-400">4 · Defend your thinking</p>
              <p className="mt-1 text-sm font-medium text-white">Debate Lab</p>
              <p className="mt-1 text-xs leading-5 text-slate-400">Hold your ground when someone smart disagrees.</p>
            </Link>
          </div>
        </div>

        {data.practiceStats.speakCount > 0 || data.practiceStats.socialCount > 0 || data.practiceStats.debateCount > 0 ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Practice at a glance</p>
            <p className="mt-1 text-sm text-slate-400">Your last 10 sessions per mode.</p>
            <div className="mt-4 flex flex-wrap gap-4">
              {data.practiceStats.speakCount > 0 && data.practiceStats.speakAvg !== null ? (
                <div className="flex-1 min-w-[8rem] rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Speak Up</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{data.practiceStats.speakAvg}<span className="text-sm font-normal text-slate-500">/10</span></p>
                  <p className="mt-0.5 text-xs text-slate-500">{data.practiceStats.speakCount} session{data.practiceStats.speakCount === 1 ? "" : "s"}</p>
                  <Link href="/speak-up/history" className="mt-2 block text-[10px] font-medium text-slate-500 transition hover:text-slate-300">View history →</Link>
                </div>
              ) : null}
              {data.practiceStats.socialCount > 0 && data.practiceStats.socialAvg !== null ? (
                <div className="flex-1 min-w-[8rem] rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Small Talk Lab</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{data.practiceStats.socialAvg}<span className="text-sm font-normal text-slate-500">/10</span></p>
                  <p className="mt-0.5 text-xs text-slate-500">{data.practiceStats.socialCount} session{data.practiceStats.socialCount === 1 ? "" : "s"}</p>
                  <Link href="/conversation-lab/history" className="mt-2 block text-[10px] font-medium text-slate-500 transition hover:text-slate-300">View history →</Link>
                </div>
              ) : null}
              {data.practiceStats.debateCount > 0 && data.practiceStats.debateAvg !== null ? (
                <div className="flex-1 min-w-[8rem] rounded-2xl border border-amber-400/15 bg-amber-400/5 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-500">Debate Lab</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{data.practiceStats.debateAvg}<span className="text-sm font-normal text-slate-500">/10</span></p>
                  <p className="mt-0.5 text-xs text-slate-500">{data.practiceStats.debateCount} session{data.practiceStats.debateCount === 1 ? "" : "s"}</p>
                  <Link href="/debate-lab/history" className="mt-2 block text-[10px] font-medium text-amber-500 transition hover:text-amber-300">View history →</Link>
                </div>
              ) : null}
            </div>
            {data.practiceStats.weakestGoal ? (
              <p className="mt-4 text-xs leading-5 text-slate-400">
                Focus area: <span className="font-semibold text-slate-200">{data.practiceStats.weakestGoal}</span> — your scores here run lower than anywhere else.
              </p>
            ) : null}
          </div>
        ) : null}

        {data.coachingInsight ? (
          <div className="rounded-[2rem] border border-sky-300/20 bg-sky-400/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-sky-400 mb-3">What to focus on</p>
            <p className="text-sm leading-7 text-slate-200">{data.coachingInsight.message}</p>
            {data.coachingInsight.cta ? (
              <Link href={data.coachingInsight.cta.href} className="mt-3 inline-flex text-xs font-semibold text-sky-300 transition hover:text-sky-200">
                {data.coachingInsight.cta.label} →
              </Link>
            ) : null}
          </div>
        ) : null}

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

        <AchievementsDisplay earned={data.achievements ?? []} />

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
