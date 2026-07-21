"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { prisma } from "@/lib/prisma";
import { applySm2 } from "@/lib/sm2";
import { getCurrentUserId, scopedUserId } from "@/lib/session";
import { recordDailyActivity, awardStreakAchievements } from "@/lib/record-activity";
import { clampTzOffsetMinutes } from "@/lib/date";

type CardGrade = { cardId: string; grade: number };

export async function gradeRecallSession(grades: CardGrade[], tzOffsetMinutes: number = 0) {
  const userId = await getCurrentUserId();
  if (!userId || grades.length === 0) return;
  const uid = scopedUserId(userId);

  // Load all cards in one query to verify ownership and get current SM-2 state
  const ids = grades.map((g) => g.cardId);
  const cards = await prisma.card.findMany({
    where: { id: { in: ids }, deck: { userId: uid } },
    select: { id: true, easeFactor: true, interval: true, repetitions: true },
  });

  const cardMap = new Map(cards.map((c) => [c.id, c]));

  await prisma.$transaction(
    grades.flatMap(({ cardId, grade }) => {
      const card = cardMap.get(cardId);
      if (!card) return [];
      const next = applySm2({
        easeFactor: card.easeFactor,
        interval: card.interval,
        repetitions: card.repetitions,
        grade,
      });
      return [
        prisma.reviewLog.create({ data: { cardId, grade } }),
        prisma.card.update({
          where: { id: cardId },
          data: {
            easeFactor: next.easeFactor,
            interval: next.interval,
            repetitions: next.repetitions,
            dueAt: next.dueAt,
          },
        }),
      ];
    })
  );

  const newStreak = await recordDailyActivity(uid, clampTzOffsetMinutes(tzOffsetMinutes));
  after(() => awardStreakAchievements(uid, newStreak));

  revalidatePath("/");
  revalidatePath("/today");
  revalidatePath("/free-recall");
}
