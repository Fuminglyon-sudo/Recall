import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { conductSpeakUpConversation } from "@/lib/anthropic";
import { getCurrentUserId } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";

const schema = z.object({
  scenario: z.string().min(10).max(2000),
  personaPrompt: z.string().min(1).max(3000),
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
    const result = await conductSpeakUpConversation(parsed.data);
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Request failed. Try again." }, { status: 500 });
  }
}
