"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { applySm2 } from "@/lib/sm2";
import { isSameCalendarDay } from "@/lib/date";
import { getCurrentUserId, scopedUserId } from "@/lib/session";
import { computeDistribution } from "@/lib/mastery";
import { achievementsFromReview } from "@/lib/achievements";

export async function gradeCard(formData: FormData) {
  const cardId = String(formData.get("cardId") ?? "");
  const grade = Number(formData.get("grade") ?? 0);

  const userId = await getCurrentUserId();
  if (!userId) return;
  const uid = scopedUserId(userId);

  const card = await prisma.card.findFirst({
    where: { id: cardId, deck: { userId: uid } },
  });
  if (!card) return;

  const next = applySm2({
    easeFactor: card.easeFactor,
    interval: card.interval,
    repetitions: card.repetitions,
    grade,
  });

  const association = String(formData.get("association") ?? "").trim();

  let newCurrentStreak = 0;

  await prisma.$transaction(async (tx) => {
    await tx.reviewLog.create({ data: { cardId, grade } });
    await tx.card.update({
      where: { id: cardId },
      data: {
        easeFactor: next.easeFactor,
        interval: next.interval,
        repetitions: next.repetitions,
        dueAt: next.dueAt,
        ...(association && card.repetitions === 0 ? { association } : {}),
      },
    });

    const streak = await tx.streak.findFirst({ where: { userId: uid } });
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!streak) {
      await tx.streak.create({
        data: { currentStreak: 1, longestStreak: 1, lastReviewDate: today, userId: uid },
      });
      newCurrentStreak = 1;
      return;
    }

    const lastDate = streak.lastReviewDate;
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let currentStreak = streak.currentStreak;
    if (!lastDate) currentStreak = 1;
    else if (isSameCalendarDay(lastDate, today)) currentStreak = streak.currentStreak;
    else if (isSameCalendarDay(lastDate, yesterday)) currentStreak = streak.currentStreak + 1;
    else currentStreak = 1;

    newCurrentStreak = currentStreak;
    const longestStreak = Math.max(streak.longestStreak, currentStreak);

    await tx.streak.update({
      where: { id: streak.id },
      data: { currentStreak, longestStreak, lastReviewDate: today },
    });
  });

  // Award achievements — non-critical, skip for admin (null uid)
  if (uid) {
    try {
      const [totalReviews, allCards, existingAchievements] = await Promise.all([
        prisma.reviewLog.count({ where: { card: { deck: { userId: uid } } } }),
        prisma.card.findMany({
          where: { deck: { userId: uid } },
          select: { interval: true, repetitions: true, easeFactor: true },
        }),
        prisma.userAchievement.findMany({
          where: { userId: uid },
          select: { achievementId: true },
        }),
      ]);

      const { mastered } = computeDistribution(allCards);
      const existingIds = new Set(existingAchievements.map((a) => a.achievementId));
      const earned = achievementsFromReview({
        totalReviews,
        currentStreak: newCurrentStreak,
        masteredCount: mastered,
      });
      const toAward = earned.filter((id) => !existingIds.has(id));

      if (toAward.length > 0) {
        await prisma.userAchievement.createMany({
          data: toAward.map((achievementId) => ({
            id: crypto.randomUUID(),
            userId: uid,
            achievementId,
          })),
        });
      }
    } catch {
      // Non-critical
    }
  }

  revalidatePath("/");
  revalidatePath("/today");
}

export async function recoverStreak(): Promise<{ ok?: boolean; error?: string }> {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "Not signed in." };
  const uid = scopedUserId(userId);
  if (!uid) return { error: "Not available." };

  const streak = await prisma.streak.findFirst({ where: { userId: uid } });
  if (!streak) return { error: "No streak found." };
  if ((streak.longestStreak ?? 0) <= 0) return { error: "No streak to recover." };

  if (streak.recoveryUsedAt) {
    const daysSince =
      (Date.now() - streak.recoveryUsedAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince < 7) return { error: "Recovery is available once every 7 days." };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.streak.update({
    where: { id: streak.id },
    data: {
      currentStreak: streak.longestStreak,
      lastReviewDate: today,
      recoveryUsedAt: new Date(),
    },
  });

  revalidatePath("/");
  return { ok: true };
}
