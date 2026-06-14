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
