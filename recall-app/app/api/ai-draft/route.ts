import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateCardDraft } from "@/lib/anthropic";
import { getCurrentUserId, scopedUserId } from "@/lib/session";

const schema = z.object({
  front: z.string().min(1),
  deckId: z.string().min(1),
});

export async function POST(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const body = await request.json();
  const { front, deckId } = schema.parse(body);

  const uid = scopedUserId(userId);
  const deck = await prisma.deck.findFirst({
    where: { id: deckId, OR: [{ userId: uid }, { userId: null }] },
  });

  if (!deck) {
    return NextResponse.json({ error: "Deck not found." }, { status: 404 });
  }

  const draft = await generateCardDraft({
    front,
    deckName: deck.name,
    deckDescription: deck.description,
  });

  return NextResponse.json(draft);
}
