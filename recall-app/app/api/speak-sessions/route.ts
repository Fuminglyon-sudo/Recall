import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId, scopedUserId } from "@/lib/session";
import { achievementsFromSpeakUp } from "@/lib/achievements";

const messageSchema = z.object({
  role: z.enum(["speaker", "listener"]),
  content: z.string(),
});

const saveSchema = z.object({
  scenarioId: z.string().min(1),
  scenarioTag: z.string().min(1),
  personaId: z.string().min(1),
  personaLabel: z.string().min(1),
  difficulty: z.enum(["easy", "medium", "hard"]),
  practiceGoal: z.string().nullable().optional(),
  exchangeCount: z.number().int().min(0),
  score: z.number().int().min(1).max(10),
  strongPoints: z.array(z.string()),
  improvements: z.array(z.string()),
  modelAnswer: z.string(),
  modelConversation: z.array(z.object({ role: z.enum(["speaker", "listener"]), content: z.string() })).nullable().optional(),
  messages: z.array(messageSchema),
});

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = (await req.json()) as unknown;
    const parsed = saveSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input.", issues: parsed.error.issues }, { status: 400 });
    }

    const uid = scopedUserId(userId);

    const session = await prisma.speakUpSession.create({
      data: {
        userId: uid,
        scenarioId: parsed.data.scenarioId,
        scenarioTag: parsed.data.scenarioTag,
        personaId: parsed.data.personaId,
        personaLabel: parsed.data.personaLabel,
        difficulty: parsed.data.difficulty,
        practiceGoal: parsed.data.practiceGoal ?? null,
        exchangeCount: parsed.data.exchangeCount,
        score: parsed.data.score,
        strongPoints: parsed.data.strongPoints,
        improvements: parsed.data.improvements,
        modelAnswer: parsed.data.modelAnswer,
        modelConversation: parsed.data.modelConversation ?? undefined,
        messages: parsed.data.messages,
      },
    });

    // Award speak-up achievements (skip for null uid / admin)
    if (uid) {
      try {
        const existingAchievements = await prisma.userAchievement.findMany({
          where: { userId: uid },
          select: { achievementId: true },
        });
        const existingIds = new Set(existingAchievements.map((a) => a.achievementId));
        const earned = achievementsFromSpeakUp({ score: parsed.data.score });
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
      } catch {
        // Non-critical
      }
    }

    return NextResponse.json({ id: session.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save session." }, { status: 500 });
  }
}
