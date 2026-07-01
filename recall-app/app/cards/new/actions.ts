"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId, scopedUserId } from "@/lib/session";

const cardSchema = z.object({
  deckId: z.string().min(1),
  front: z.string().min(1),
  back: z.string().min(1),
  partOfSpeech: z.string().optional(),
  example: z.string().optional(),
  hook: z.string().optional(),
  synonyms: z.string().optional(),
  kind: z.enum(["VOCABULARY", "FOUNDER", "MEMORY"]),
  sourceContext: z.string().optional(),
});

export async function createCard(formData: FormData) {
  const userId = await getCurrentUserId();
  if (!userId) return;
  const uid = scopedUserId(userId);

  const values = cardSchema.parse({
    deckId: formData.get("deckId"),
    front: formData.get("front"),
    back: formData.get("back"),
    partOfSpeech: formData.get("partOfSpeech") || undefined,
    example: formData.get("example") || undefined,
    hook: formData.get("hook") || undefined,
    synonyms: formData.get("synonyms") || undefined,
    kind: formData.get("kind"),
    sourceContext: formData.get("sourceContext") || undefined,
  });

  const deck = await prisma.deck.findFirst({
    where: { id: values.deckId, userId: uid },
    select: { id: true },
  });
  if (!deck) return;

  await prisma.card.create({
    data: { ...values, dueAt: new Date() },
  });

  redirect("/decks/" + values.deckId);
}

export async function createFounderBatchCards(formData: FormData) {
  const userId = await getCurrentUserId();
  if (!userId) return;
  const uid = scopedUserId(userId);

  const entries = Array.from(formData.entries());
  const cardsByIndex = new Map<string, Record<string, FormDataEntryValue>>();

  for (const [key, value] of entries) {
    const match = key.match(/^cards\[(\d+)\]\.(.+)$/);
    if (!match) continue;
    const [, index, field] = match;
    const current = cardsByIndex.get(index) ?? {};
    current[field] = value;
    cardsByIndex.set(index, current);
  }

  const cards = Array.from(cardsByIndex.values()).flatMap((card) => {
    const result = cardSchema.safeParse({
      deckId: card.deckId,
      front: card.front,
      back: card.back,
      partOfSpeech: card.partOfSpeech || undefined,
      example: card.example || undefined,
      hook: card.hook || undefined,
      synonyms: card.synonyms || undefined,
      kind: card.kind,
      sourceContext: card.sourceContext || undefined,
    });
    return result.success ? [result.data] : [];
  });

  if (cards.length === 0) {
    redirect("/cards/new");
  }

  // Verify all unique deck IDs belong to this user
  const deckIds = [...new Set(cards.map((c) => c.deckId))];
  const ownedDecks = await prisma.deck.findMany({
    where: { id: { in: deckIds }, userId: uid },
    select: { id: true },
  });
  const ownedDeckIds = new Set(ownedDecks.map((d) => d.id));
  const safeCards = cards.filter((c) => ownedDeckIds.has(c.deckId));

  if (safeCards.length === 0) {
    redirect("/cards/new");
  }

  await prisma.card.createMany({
    data: safeCards.map((card) => ({ ...card, dueAt: new Date() })),
  });

  redirect("/decks/" + safeCards[0].deckId);
}
