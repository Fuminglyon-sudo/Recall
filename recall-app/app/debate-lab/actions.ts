"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId, scopedUserId } from "@/lib/session";

export async function saveDebateCard(
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { error: "Not authenticated" };
    const uid = scopedUserId(userId);

    const deckId = String(formData.get("deckId") ?? "").trim();
    const front = String(formData.get("front") ?? "").trim();
    const back = String(formData.get("back") ?? "").trim();

    if (!deckId || !front || !back) return { error: "All fields are required" };

    const deck = await prisma.deck.findFirst({
      where: { id: deckId, userId: uid },
      select: { id: true },
    });
    if (!deck) return { error: "Deck not found" };

    await prisma.card.create({
      data: { deckId, front, back, kind: "VOCABULARY", dueAt: new Date() },
    });

    return { success: true };
  } catch {
    return { error: "Failed to save. Please try again." };
  }
}
