import { NextRequest, NextResponse, after } from "next/server";
import { z } from "zod";
import { conductSocialConversation } from "@/lib/anthropic";
import { CHARACTER_IDS, CHARACTER_LABELS, buildCharacterPrompt } from "@/lib/conversation-characters";
import { getCurrentUserId, scopedUserId } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { recordDailyActivity, awardStreakAchievements } from "@/lib/record-activity";

const schema = z.object({
  scenarioContext: z.string().min(10).max(2000),
  scenarioTag: z.string().min(1),
  scenarioEmoji: z.string().min(1),
  characterId: z.enum(CHARACTER_IDS),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tension: z.string().max(1000).optional(),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "character"]),
        content: z.string().min(1).max(4000),
      })
    )
    .min(1)
    .max(20),
  exchangeCount: z.number().int().min(0),
  forceEnd: z.boolean().optional(),
  practiceGoal: z.string().max(500).optional(),
  tzOffsetMinutes: z.coerce.number().int().min(-720).max(840).optional().default(0),
});

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (!checkRateLimit("social-conversation", userId, 30)) return NextResponse.json({ error: "Too many requests. Slow down and try again." }, { status: 429 });

  try {
    const body = (await req.json()) as unknown;
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input.", issues: parsed.error.issues }, { status: 400 });
    }
    const { characterId, difficulty, tension, scenarioTag, scenarioEmoji, tzOffsetMinutes, ...rest } = parsed.data;
    const result = await conductSocialConversation({
      ...rest,
      characterType: CHARACTER_LABELS[characterId],
      characterPrompt: buildCharacterPrompt(characterId, difficulty, tension),
    });

    if (result.type !== "feedback") {
      return NextResponse.json(result);
    }

    // Persist the session server-side, from the score the LLM judge just
    // computed — not from a separate client-trusted save call. The old flow
    // let the client re-POST its own score to /api/social-sessions after
    // receiving this same feedback.
    let sessionId: string | null = null;
    try {
      const uid = scopedUserId(userId);
      const session = await prisma.socialSession.create({
        data: {
          userId: uid,
          scenarioTag,
          scenarioEmoji,
          scenarioContext: rest.scenarioContext,
          characterLabel: CHARACTER_LABELS[characterId],
          difficulty,
          exchangeCount: rest.exchangeCount,
          score: result.score,
          strongPoints: result.strongPoints,
          improvements: result.improvements,
          powerMove: result.powerMove,
          messages: rest.messages,
          practiceGoal: rest.practiceGoal ?? null,
          ...(result.modelConversation ? { modelConversation: result.modelConversation } : {}),
        },
      });
      sessionId = session.id;

      const newStreak = await recordDailyActivity(uid, tzOffsetMinutes);
      after(() => awardStreakAchievements(uid, newStreak));
    } catch (err) {
      console.error("[social-conversation] failed to save session", err);
    }

    return NextResponse.json({ ...result, sessionId });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Request failed. Try again." }, { status: 500 });
  }
}
