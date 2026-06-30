"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId, scopedUserId } from "@/lib/session";

const deckSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export async function createDeck(formData: FormData) {
  const userId = await getCurrentUserId();
  if (!userId) return;
  const uid = scopedUserId(userId);

  const values = deckSchema.parse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
  });

  const deck = await prisma.deck.create({ data: { ...values, userId: uid } });
  redirect(`/decks/${deck.id}`);
}

const updateCardSchema = z.object({
  cardId: z.string().min(1),
  deckId: z.string().min(1),
  front: z.string().min(1),
  back: z.string().min(1),
  partOfSpeech: z.string().optional(),
  example: z.string().optional(),
  hook: z.string().optional(),
  synonyms: z.string().optional(),
  sourceContext: z.string().optional(),
});

export async function updateCard(formData: FormData) {
  const values = updateCardSchema.parse({
    cardId: formData.get("cardId"),
    deckId: formData.get("deckId"),
    front: formData.get("front"),
    back: formData.get("back"),
    partOfSpeech: formData.get("partOfSpeech") || undefined,
    example: formData.get("example") || undefined,
    hook: formData.get("hook") || undefined,
    synonyms: formData.get("synonyms") || undefined,
    sourceContext: formData.get("sourceContext") || undefined,
  });

  await prisma.card.update({
    where: { id: values.cardId },
    data: {
      front: values.front,
      back: values.back,
      partOfSpeech: values.partOfSpeech,
      example: values.example,
      hook: values.hook,
      synonyms: values.synonyms,
      sourceContext: values.sourceContext,
    },
  });

  redirect(`/decks/${values.deckId}`);
}
