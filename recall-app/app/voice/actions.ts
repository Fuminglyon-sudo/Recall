"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId, scopedUserId } from "@/lib/session";

export async function saveTone(formData: FormData) {
  const tone = (formData.get("tone") as string | null) ?? "";

  const userId = await getCurrentUserId();
  if (!userId) return;
  const uid = scopedUserId(userId);

  const existing = await prisma.voiceProfile.findFirst({ where: { userId: uid } });
  if (existing) {
    await prisma.voiceProfile.update({ where: { id: existing.id }, data: { tone } });
  } else {
    await prisma.voiceProfile.create({ data: { tone, userId: uid } });
  }
}
