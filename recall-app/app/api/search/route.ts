import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isDatabaseReady } from "@/lib/db-ready";
import { getCurrentUserId, scopedUserId } from "@/lib/session";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json([]);

  const ready = await isDatabaseReady();
  if (!ready) return NextResponse.json([]);

  const userId = await getCurrentUserId();
  const uid = scopedUserId(userId ?? "");

  const cards = await prisma.card.findMany({
    where: {
      deck: { userId: uid },
      OR: [
        { front: { contains: q, mode: "insensitive" } },
        { back: { contains: q, mode: "insensitive" } },
        { example: { contains: q, mode: "insensitive" } },
        { synonyms: { contains: q, mode: "insensitive" } },
      ],
    },
    include: { deck: { select: { id: true, name: true } } },
    take: 30,
    orderBy: { front: "asc" },
  });

  return NextResponse.json(
    cards.map((c) => ({
      id: c.id,
      front: c.front,
      back: c.back,
      partOfSpeech: c.partOfSpeech,
      example: c.example,
      hook: c.hook,
      synonyms: c.synonyms,
      interval: c.interval,
      repetitions: c.repetitions,
      deckId: c.deck.id,
      deckName: c.deck.name,
    }))
  );
}
