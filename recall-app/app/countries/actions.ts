"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { applySm2 } from "@/lib/sm2";
import { getCurrentUserId, scopedUserId, ADMIN_USER_ID } from "@/lib/session";

export async function gradeCountry(formData: FormData) {
  const countryId = String(formData.get("id") ?? "");
  const grade = Number(formData.get("grade") ?? 0);

  const userId = await getCurrentUserId();
  if (!userId) return;

  if (userId === ADMIN_USER_ID) {
    // Admin: update SM-2 fields on Country directly
    const country = await prisma.country.findUnique({ where: { id: countryId } });
    if (!country) return;

    const next = applySm2({
      easeFactor: country.easeFactor,
      interval: country.interval,
      repetitions: country.repetitions,
      grade,
    });

    await prisma.country.update({
      where: { id: countryId },
      data: { easeFactor: next.easeFactor, interval: next.interval, repetitions: next.repetitions, dueAt: next.dueAt },
    });
  } else {
    // Google user: upsert UserCountryProgress
    const uid = scopedUserId(userId)!;

    const existing = await prisma.userCountryProgress.findUnique({
      where: { userId_countryId: { userId: uid, countryId } },
    });

    const current = existing ?? { easeFactor: 2.5, interval: 0, repetitions: 0 };
    const next = applySm2({ easeFactor: current.easeFactor, interval: current.interval, repetitions: current.repetitions, grade });

    await prisma.userCountryProgress.upsert({
      where: { userId_countryId: { userId: uid, countryId } },
      create: { userId: uid, countryId, easeFactor: next.easeFactor, interval: next.interval, repetitions: next.repetitions, dueAt: next.dueAt },
      update: { easeFactor: next.easeFactor, interval: next.interval, repetitions: next.repetitions, dueAt: next.dueAt },
    });
  }

  revalidatePath("/countries");
}
