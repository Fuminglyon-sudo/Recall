"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { applySm2 } from "@/lib/sm2";

export async function gradeCountry(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const grade = Number(formData.get("grade") ?? 0);

  const country = await prisma.country.findUnique({ where: { id } });
  if (!country) return;

  const next = applySm2({
    easeFactor: country.easeFactor,
    interval: country.interval,
    repetitions: country.repetitions,
    grade,
  });

  await prisma.country.update({
    where: { id },
    data: {
      easeFactor: next.easeFactor,
      interval: next.interval,
      repetitions: next.repetitions,
      dueAt: next.dueAt,
    },
  });

  revalidatePath("/countries");
}
