"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

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

const batchSchema = z.object({
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

  await prisma.card.create({
    data: {
      ...values,
      dueAt: new Date(),
    },
  });

  redirect("/decks/" + values.deckId);
}

export async function createFounderBatchCards(formData: FormData) {
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

  const cards = Array.from(cardsByIndex.values()).map((card) =>
    batchSchema.parse({
      deckId: card.deckId,
      front: card.front,
      back: card.back,
      partOfSpeech: card.partOfSpeech || undefined,
      example: card.example || undefined,
      hook: card.hook || undefined,
      synonyms: card.synonyms || undefined,
      kind: card.kind,
      sourceContext: card.sourceContext || undefined,
    })
  );

  if (cards.length === 0) {
    redirect("/cards/new");
  }

  await prisma.card.createMany({
    data: cards.map((card) => ({
      ...card,
      dueAt: new Date(),
    })),
  });

  redirect("/decks/" + cards[0].deckId);
}
