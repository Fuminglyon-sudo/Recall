import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId, scopedUserId } from "@/lib/session";

// Sessions are created server-side in /api/social-conversation at the
// moment the LLM judge computes the score — there is no longer a
// client-facing POST here, since accepting a client-supplied score would
// let a crafted request save a fabricated result.

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const uid = scopedUserId(userId);

    const sessions = await prisma.socialSession.findMany({
      where: { userId: uid },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        createdAt: true,
        scenarioTag: true,
        scenarioEmoji: true,
        characterLabel: true,
        difficulty: true,
        exchangeCount: true,
        score: true,
        strongPoints: true,
        improvements: true,
        powerMove: true,
        messages: true,
        modelConversation: true,
      },
    });
    return NextResponse.json(sessions);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load sessions." }, { status: 500 });
  }
}
