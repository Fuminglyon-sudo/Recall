export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ChevronLeft, ChevronRight, ArrowLeft, Lock, Flame } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId, scopedUserId } from "@/lib/session";
import { buildMonthGrid, isPerfectStreak, dateKey } from "@/lib/streak";
import { STREAK_MILESTONES } from "@/lib/achievements";
import { ShareStreakButton } from "@/components/share-streak-button";
import { parseTzOffsetMinutes, startOfLocalDay, TZ_COOKIE_NAME } from "@/lib/date";

export const metadata = { title: "Your Streak — Soro Soke" };

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function parseMonthParam(raw: string | undefined, today: Date): { year: number; month: number } {
  if (raw && /^\d{4}-\d{2}$/.test(raw)) {
    const [y, m] = raw.split("-").map(Number);
    if (m >= 1 && m <= 12) return { year: y, month: m - 1 };
  }
  return { year: today.getFullYear(), month: today.getMonth() };
}

function monthParam(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

export default async function StreakPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");
  const uid = scopedUserId(userId);

  const jar = await cookies();
  const tzOffsetMinutes = parseTzOffsetMinutes(jar.get(TZ_COOKIE_NAME)?.value);
  // Local, not server-UTC, midnight — matches the boundary recordDailyActivity
  // uses, so a day this calendar marks "reviewed" agrees with what actually
  // advanced the streak.
  const today = startOfLocalDay(tzOffsetMinutes);

  const params = await searchParams;
  const { year, month } = parseMonthParam(params.month, today);
  const monthStart = new Date(year, month, 1);
  const monthEndExclusive = new Date(year, month + 1, 1);
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  const [streak, reviewLogs, achievements] = await Promise.all([
    prisma.streak.findFirst({ where: { userId: uid } }),
    prisma.reviewLog.findMany({
      where: { reviewedAt: { gte: monthStart, lt: monthEndExclusive }, card: { deck: { userId: uid } } },
      select: { reviewedAt: true },
    }),
    uid
      ? prisma.userAchievement.findMany({ where: { userId: uid }, select: { achievementId: true } })
      : Promise.resolve([]),
  ]);

  // Shift each timestamp into the user's local frame before keying it, the
  // same way startOfLocalDay does — otherwise a review just after local
  // midnight (for anyone ahead of UTC) buckets into the wrong calendar cell.
  const reviewedDateKeys = new Set(
    reviewLogs.map((l) => dateKey(new Date(l.reviewedAt.getTime() - tzOffsetMinutes * 60_000)))
  );
  const grid = buildMonthGrid(year, month, reviewedDateKeys, today);
  const daysPracticed = grid.filter((d) => d.inMonth && d.reviewed).length;

  const recoveryUsedAt = streak?.recoveryUsedAt ?? null;
  const freezeUsedThisMonth =
    recoveryUsedAt !== null && recoveryUsedAt >= monthStart && recoveryUsedAt < monthEndExclusive ? 1 : 0;

  const currentStreak = streak?.currentStreak ?? 0;
  const perfect = isPerfectStreak(recoveryUsedAt, streak?.streakStartedAt ?? null) && currentStreak > 0;

  const unlockedIds = new Set(achievements.map((a) => a.achievementId));

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <ShareStreakButton currentStreak={currentStreak} perfect={perfect} />
        </div>

        {/* Hero */}
        <section className="flex items-center justify-between rounded-[2rem] border border-white/10 bg-white/5 p-8">
          <div>
            <p className="text-6xl font-extrabold tabular-nums text-orange-400">{currentStreak}</p>
            <p className="mt-1 text-lg font-semibold text-orange-300">day streak!</p>
          </div>
          <div className="relative flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-orange-500/20 blur-2xl" />
            <Flame className="relative h-20 w-20 fill-orange-500 text-orange-300" strokeWidth={1.5} />
          </div>
        </section>

        {perfect ? (
          <div className="flex items-center gap-3 rounded-[2rem] border border-orange-400/20 bg-orange-400/8 px-6 py-4">
            <Flame className="h-5 w-5 shrink-0 fill-orange-400 text-orange-300" />
            <p className="text-sm text-orange-200">
              <span className="font-semibold text-orange-300">Perfect Streak</span> — keep it going by practicing every day.
            </p>
          </div>
        ) : null}

        {/* Month calendar */}
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              {monthStart.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </h2>
            <div className="flex items-center gap-1">
              <Link
                href={`/streak?month=${monthParam(month === 0 ? year - 1 : year, month === 0 ? 11 : month - 1)}`}
                className="rounded-full p-1.5 text-slate-400 transition hover:bg-white/8 hover:text-white"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </Link>
              {isCurrentMonth ? (
                <span className="p-1.5 text-slate-700">
                  <ChevronRight className="h-4 w-4" />
                </span>
              ) : (
                <Link
                  href={`/streak?month=${monthParam(month === 11 ? year + 1 : year, month === 11 ? 0 : month + 1)}`}
                  className="rounded-full p-1.5 text-slate-400 transition hover:bg-white/8 hover:text-white"
                  aria-label="Next month"
                >
                  <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>

          <div className="mt-4 flex gap-3 text-sm">
            <div className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5">
              <span className="font-semibold text-white">{daysPracticed}</span>
              <span className="text-slate-500">days practiced</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5">
              <span className="font-semibold text-white">{freezeUsedThisMonth}</span>
              <span className="text-slate-500">freeze used</span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-7 gap-y-2 text-center">
            {DAY_LABELS.map((d) => (
              <p key={d} className="text-[11px] font-medium text-slate-600">{d}</p>
            ))}
            {grid.map((d) => (
              <div key={d.dateKey} className="flex h-9 items-center justify-center px-0.5">
                <div
                  title={d.dateKey}
                  className={`flex h-8 w-full items-center justify-center text-xs font-medium transition ${
                    d.joinPrev ? "rounded-l-none" : "rounded-l-full"
                  } ${d.joinNext ? "rounded-r-none" : "rounded-r-full"} ${
                    d.reviewed
                      ? "bg-gradient-to-br from-orange-400 to-red-500 text-white"
                      : d.isToday
                      ? "border border-sky-400/50 text-sky-300"
                      : !d.inMonth || d.isFuture
                      ? "text-slate-700"
                      : "text-slate-500"
                  }`}
                >
                  {d.dayOfMonth}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Milestones */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Streak milestones</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {STREAK_MILESTONES.map((m) => {
              const unlocked = unlockedIds.has(m.id);
              return (
                <div
                  key={m.id}
                  className={`flex items-center gap-4 rounded-2xl border p-4 ${
                    unlocked ? "border-orange-400/25 bg-orange-400/8" : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl ${
                    unlocked ? "bg-orange-400/15" : "bg-white/5 grayscale opacity-50"
                  }`}>
                    {m.emoji}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold ${unlocked ? "text-white" : "text-slate-400"}`}>{m.label}</p>
                    {unlocked ? (
                      <p className="text-xs text-orange-300">Unlocked</p>
                    ) : (
                      <p className="flex items-center gap-1 text-xs text-slate-600">
                        <Lock className="h-3 w-3" /> Locked
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
