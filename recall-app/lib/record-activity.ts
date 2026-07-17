import { prisma } from "./prisma";
import { isSameCalendarDay, startOfLocalDay } from "./date";
import { achievementsFromStreak } from "./achievements";

/**
 * Updates the daily streak for any completed practice activity — a card
 * review, or a finished Debate Lab / Speak Up / Conversation Lab session.
 * One streak, shared across every activity: doing more than one thing on
 * the same day doesn't advance it further (isSameCalendarDay short-circuits
 * to a no-op), and it's safe to call multiple times per day.
 *
 * Returns the resulting currentStreak.
 */
export async function recordDailyActivity(uid: string | null, tzOffsetMinutes: number): Promise<number> {
  let newCurrentStreak = 0;

  await prisma.$transaction(async (tx) => {
    const streak = await tx.streak.findFirst({ where: { userId: uid } });
    const today = startOfLocalDay(tzOffsetMinutes);

    if (!streak) {
      await tx.streak.create({
        data: { currentStreak: 1, longestStreak: 1, lastReviewDate: today, streakStartedAt: today, userId: uid },
      });
      newCurrentStreak = 1;
      return;
    }

    const lastDate = streak.lastReviewDate;
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let currentStreak = streak.currentStreak;
    let isNewStreak = false;
    if (!lastDate) { currentStreak = 1; isNewStreak = true; }
    else if (isSameCalendarDay(lastDate, today)) currentStreak = streak.currentStreak;
    else if (isSameCalendarDay(lastDate, yesterday)) currentStreak = streak.currentStreak + 1;
    else { currentStreak = 1; isNewStreak = true; }

    newCurrentStreak = currentStreak;
    const longestStreak = Math.max(streak.longestStreak, currentStreak);

    await tx.streak.update({
      where: { id: streak.id },
      data: {
        currentStreak,
        longestStreak,
        lastReviewDate: today,
        ...(isNewStreak ? { streakStartedAt: today } : {}),
      },
    });
  });

  return newCurrentStreak;
}

/**
 * Awards any streak-length milestone achievements not yet earned. Kept
 * separate from recordDailyActivity so the streak update itself can run
 * inline while this — like all achievement awarding in the app — is
 * non-critical and safe to defer (e.g. via next/server's after()).
 */
export async function awardStreakAchievements(uid: string | null, currentStreak: number): Promise<void> {
  if (!uid) return;
  try {
    const existing = await prisma.userAchievement.findMany({
      where: { userId: uid },
      select: { achievementId: true },
    });
    const existingIds = new Set(existing.map((a) => a.achievementId));
    const toAward = achievementsFromStreak(currentStreak).filter((id) => !existingIds.has(id));
    if (toAward.length > 0) {
      await prisma.userAchievement.createMany({
        data: toAward.map((achievementId) => ({ id: crypto.randomUUID(), userId: uid, achievementId })),
      });
    }
  } catch {
    // Non-critical
  }
}
