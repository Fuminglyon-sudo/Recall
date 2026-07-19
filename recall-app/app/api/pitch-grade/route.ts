import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { conductPitchConversation } from "@/lib/anthropic";
import { getCurrentUserId, ADMIN_USER_ID } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";

const schema = z.object({
  app: z.enum(["japa-reality", "sharpen", "both"]),
  scenario: z.string().min(10),
  messages: z
    .array(
      z.object({
        role: z.enum(["interviewer", "founder"]),
        content: z.string().min(1),
      })
    )
    .min(2),
  exchangeCount: z.number().int().min(1),
  forceEnd: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (userId !== ADMIN_USER_ID) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (!checkRateLimit("pitch-grade", userId, 30)) return NextResponse.json({ error: "Too many requests. Slow down and try again." }, { status: 429 });

  try {
    const body = (await req.json()) as unknown;
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input.", issues: parsed.error.issues }, { status: 400 });
    }
    const result = await conductPitchConversation(parsed.data);
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Request failed. Try again." }, { status: 500 });
  }
}
