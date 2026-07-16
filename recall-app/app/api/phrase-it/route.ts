import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { phraseInVoice } from "@/lib/anthropic";
import { getCurrentUserId, scopedUserId } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";

const schema = z.object({
  text: z.string().min(1),
});

export async function POST(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (!checkRateLimit("phrase-it", userId, 30)) return NextResponse.json({ error: "Too many requests. Slow down and try again." }, { status: 429 });

  try {
    const body = await request.json();
    const { text } = schema.parse(body);

    const uid = scopedUserId(userId);
    const profile = await prisma.voiceProfile.findFirst({ where: { userId: uid } });
    const tone = profile?.tone?.trim() ?? "";

    const result = await phraseInVoice(text, tone);
    return NextResponse.json({ result });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    console.error("[phrase-it]", err);
    return NextResponse.json({ error: "Failed to rephrase. Try again." }, { status: 500 });
  }
}
