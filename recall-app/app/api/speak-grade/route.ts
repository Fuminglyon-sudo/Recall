import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { conductSpeakUpConversation } from "@/lib/anthropic";
import { PERSONA_IDS, PERSONA_LABELS, getPersonaPrompt } from "@/lib/speak-up-personas";
import { getCurrentUserId, scopedUserId } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { achievementsFromSpeakUp } from "@/lib/achievements";

const schema = z.object({
  scenario: z.string().min(10).max(2000),
  scenarioId: z.string().min(1),
  scenarioTag: z.string().min(1),
  personaId: z.enum(PERSONA_IDS),
  difficulty: z.enum(["easy", "medium", "hard"]),
  messages: z.array(
    z.object({
      role: z.enum(["speaker", "listener"]),
      content: z.string().min(1).max(4000),
    })
  ).min(1).max(20),
  exchangeCount: z.number().int().min(0),
  forceEnd: z.boolean().optional(),
  practiceGoal: z.string().max(500).optional(),
  practiceGoalLabel: z.string().max(100).optional(),
});

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (!checkRateLimit("speak-grade", userId, 30)) return NextResponse.json({ error: "Too many requests. Slow down and try again." }, { status: 429 });

  try {
    const body = (await req.json()) as unknown;
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input.", issues: parsed.error.issues }, { status: 400 });
    }
    const { personaId, scenarioId, scenarioTag, practiceGoalLabel, ...rest } = parsed.data;
    const result = await conductSpeakUpConversation({ ...rest, personaPrompt: getPersonaPrompt(personaId) });

    if (result.type !== "final") {
      return NextResponse.json(result);
    }

    // Persist the session server-side, from the score the LLM judge just
    // computed — not from a separate client-trusted save call. The old flow
    // let the client re-POST its own score to /api/speak-sessions after
    // receiving this same feedback.
    let sessionId: string | null = null;
    try {
      const uid = scopedUserId(userId);
      const session = await prisma.speakUpSession.create({
        data: {
          userId: uid,
          scenarioId,
          scenarioTag,
          personaId,
          personaLabel: PERSONA_LABELS[personaId],
          difficulty: rest.difficulty,
          practiceGoal: practiceGoalLabel ?? null,
          exchangeCount: rest.exchangeCount,
          score: result.score,
          strongPoints: result.strongPoints,
          improvements: result.improvements,
          modelAnswer: result.modelAnswer,
          modelConversation: result.modelConversation ?? undefined,
          messages: rest.messages,
        },
      });
      sessionId = session.id;

      if (uid) {
        const existingAchievements = await prisma.userAchievement.findMany({
          where: { userId: uid },
          select: { achievementId: true },
        });
        const existingIds = new Set(existingAchievements.map((a) => a.achievementId));
        const earned = achievementsFromSpeakUp({ score: result.score });
        const toAward = earned.filter((id) => !existingIds.has(id));
        if (toAward.length > 0) {
          await prisma.userAchievement.createMany({
            data: toAward.map((achievementId) => ({
              id: crypto.randomUUID(),
              userId: uid,
              achievementId,
            })),
          });
        }
      }
    } catch (err) {
      console.error("[speak-grade] failed to save session", err);
    }

    return NextResponse.json({ ...result, sessionId });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Request failed. Try again." }, { status: 500 });
  }
}
