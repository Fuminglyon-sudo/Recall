import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { conductSocialConversation } from "@/lib/anthropic";
import { CHARACTER_IDS, CHARACTER_LABELS, buildCharacterPrompt } from "@/lib/conversation-characters";
import { getCurrentUserId } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";

const schema = z.object({
  scenarioContext: z.string().min(10).max(2000),
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
    const { characterId, difficulty, tension, ...rest } = parsed.data;
    const result = await conductSocialConversation({
      ...rest,
      characterType: CHARACTER_LABELS[characterId],
      characterPrompt: buildCharacterPrompt(characterId, difficulty, tension),
    });
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Request failed. Try again." }, { status: 500 });
  }
}
