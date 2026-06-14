"use server";

import { prisma } from "@/lib/prisma";

export async function saveTone(formData: FormData) {
  const tone = (formData.get("tone") as string | null) ?? "";

  const existing = await prisma.voiceProfile.findFirst();
  if (existing) {
    await prisma.voiceProfile.update({ where: { id: existing.id }, data: { tone } });
  } else {
    await prisma.voiceProfile.create({ data: { tone } });
  }
}
