import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateSentenceScenario, gradeSentenceUsage } from "@/lib/anthropic";
import { getCurrentUserId } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";

const schema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("scenario"),
    word: z.string().min(1),
    definition: z.string().min(1),
  }),
  z.object({
    action: z.literal("grade"),
    word: z.string().min(1),
    definition: z.string().min(1),
    scenario: z.string().min(1),
    userSentence: z.string().min(2),
  }),
]);

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (!checkRateLimit(userId, 30)) return NextResponse.json({ error: "Too many requests. Slow down and try again." }, { status: 429 });

  try {
    const body = (await req.json()) as unknown;
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input." }, { status: 400 });
    }
    if (parsed.data.action === "scenario") {
      const result = await generateSentenceScenario(parsed.data.word, parsed.data.definition);
      return NextResponse.json(result);
    }
    const result = await gradeSentenceUsage(parsed.data);
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Request failed. Try again." }, { status: 500 });
  }
}
