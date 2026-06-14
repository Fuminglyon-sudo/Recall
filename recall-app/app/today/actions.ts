"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { applySm2 } from "@/lib/sm2";
import { isSameCalendarDay } from "@/lib/date";

export async function gradeCard(formData: FormData) {
  const cardId = String(formData.get("cardId") ?? "");
  const grade = Number(formData.get("grade") ?? 0);

  const card = await prisma.card.findUnique({ where: { id: cardId } });
  if (!card) return;

  const next = applySm2({
    easeFactor: card.easeFactor,
    interval: card.interval,
    repetitions: card.repetitions,
    grade,
  });

  await prisma.$transaction(async (tx) => {
    await tx.reviewLog.create({ data: { cardId, grade } });
    await tx.card.update({
      where: { id: cardId },
      data: {
        easeFactor: next.easeFactor,
        interval: next.interval,
        repetitions: next.repetitions,
        dueAt: next.dueAt,
      },
    });

    const streak = await tx.streak.findFirst();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!streak) {
      await tx.streak.create({ data: { currentStreak: 1, lastReviewDate: today } });
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

    await tx.streak.update({
      where: { id: streak.id },
      data: { currentStreak, lastReviewDate: today },
    });
  });

  revalidatePath("/");
  revalidatePath("/today");
}
