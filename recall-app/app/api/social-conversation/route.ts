import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { conductSocialConversation } from "@/lib/anthropic";
import { getCurrentUserId } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";

const schema = z.object({
  scenarioContext: z.string().min(10),
  characterType: z.string().min(1),
  characterPrompt: z.string().min(1),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "character"]),
        content: z.string().min(1),
      })
    )
    .min(1),
  exchangeCount: z.number().int().min(0),
  forceEnd: z.boolean().optional(),
  practiceGoal: z.string().optional(),
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
    const result = await conductSocialConversation(parsed.data);
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Request failed. Try again." }, { status: 500 });
  }
}
