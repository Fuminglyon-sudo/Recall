"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId, scopedUserId } from "@/lib/session";
import { STARTER_DECKS } from "@/lib/starter-decks";


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
  const userId = await getCurrentUserId();
  if (!userId) return;
  const uid = scopedUserId(userId);

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

  const card = await prisma.card.findFirst({
    where: { id: values.cardId, deck: { userId: uid } },
    select: { id: true },
  });
  if (!card) return;

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

export async function generateShareLink(formData: FormData) {
  const userId = await getCurrentUserId();
  if (!userId) return;
  const uid = scopedUserId(userId);

  const deckId = String(formData.get("deckId") ?? "");
  const deck = await prisma.deck.findFirst({ where: { id: deckId, userId: uid }, select: { id: true } });
  if (!deck) return;

  const token = crypto.randomUUID().replace(/-/g, "");
  await prisma.deck.update({ where: { id: deckId }, data: { shareToken: token } });
  revalidatePath(`/decks/${deckId}`);
}

export async function revokeShareLink(formData: FormData) {
  const userId = await getCurrentUserId();
  if (!userId) return;
  const uid = scopedUserId(userId);

  const deckId = String(formData.get("deckId") ?? "");
  const deck = await prisma.deck.findFirst({ where: { id: deckId, userId: uid }, select: { id: true } });
  if (!deck) return;

  await prisma.deck.update({ where: { id: deckId }, data: { shareToken: null } });
  revalidatePath(`/decks/${deckId}`);
}

export async function cloneSharedDeck(formData: FormData) {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");
  const uid = scopedUserId(userId);

  const token = String(formData.get("token") ?? "");
  const source = await prisma.deck.findFirst({
    where: { shareToken: token },
    include: { cards: true },
  });
  if (!source) return;

  // Owner clicked their own share link — just go to the deck
  if (source.userId === uid) redirect(`/decks/${source.id}`);

  const deck = await prisma.deck.create({
    data: {
      name: source.name,
      description: source.description,
      userId: uid,
      cards: {
        create: source.cards.map((c) => ({
          front: c.front,
          back: c.back,
          partOfSpeech: c.partOfSpeech,
          example: c.example,
          hook: c.hook,
          synonyms: c.synonyms,
        })),
      },
    },
  });

  redirect(`/decks/${deck.id}`);
}

export async function cloneStarterDeck(formData: FormData) {
  const userId = await getCurrentUserId();
  if (!userId) return;
  const uid = scopedUserId(userId);

  const deckId = String(formData.get("deckId") ?? "");
  const starter = STARTER_DECKS.find((d) => d.id === deckId);
  if (!starter) return;

  // If the user already has this deck by name, go there
  const existing = await prisma.deck.findFirst({
    where: { userId: uid, name: starter.name },
    select: { id: true },
  });
  if (existing) redirect(`/decks/${existing.id}`);

  const deck = await prisma.deck.create({
    data: {
      name: starter.name,
      description: starter.description,
      userId: uid,
      cards: {
        create: starter.cards.map((card) => ({
          front: card.front,
          back: card.back,
          partOfSpeech: card.partOfSpeech,
          example: card.example,
          hook: card.hook,
          synonyms: card.synonyms,
        })),
      },
    },
  });

  redirect(`/decks/${deck.id}`);
}

export async function resetCard(formData: FormData) {
  const userId = await getCurrentUserId();
  if (!userId) return;
  const uid = scopedUserId(userId);

  const cardId = String(formData.get("cardId") ?? "");
  if (!cardId) return;

  const card = await prisma.card.findFirst({
    where: { id: cardId, deck: { userId: uid } },
    select: { id: true, deckId: true },
  });
  if (!card) return;

  await prisma.card.update({
    where: { id: cardId },
    data: { repetitions: 0, interval: 0, easeFactor: 2.5, dueAt: new Date() },
  });

  revalidatePath(`/decks/${card.deckId}`);
}
