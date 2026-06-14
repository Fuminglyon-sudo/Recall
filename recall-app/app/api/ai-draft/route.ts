import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateCardDraft } from "@/lib/anthropic";

const schema = z.object({
  front: z.string().min(1),
  deckId: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json();
  const { front, deckId } = schema.parse(body);
  const deck = await prisma.deck.findUnique({ where: { id: deckId } });

  if (!deck) {
    return NextResponse.json({ error: "Deck not found" }, { status: 404 });
  }

  const draft = await generateCardDraft({
    front,
    deckName: deck.name,
    deckDescription: deck.description,
  });

  return NextResponse.json(draft);
}
