import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId, scopedUserId } from "@/lib/session";

// Sessions are created server-side in /api/debate at the moment the LLM
// judge computes the score (see the mustEnd branch there) — there is no
// longer a client-facing POST here, since accepting a client-supplied score
// would let a crafted request save a fabricated result.

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const uid = scopedUserId(userId);
    const sessions = await prisma.debateSession.findMany({
      where: { userId: uid },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        createdAt: true,
        motion: true,
        position: true,
        opponentType: true,
        difficulty: true,
        exchangeCount: true,
        score: true,
      },
    });
    return NextResponse.json(sessions);
  } catch (err) {
    console.error("[debate-sessions]", err);
    return NextResponse.json({ error: "Failed to load sessions." }, { status: 500 });
  }
}
