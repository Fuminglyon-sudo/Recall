import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { phraseInVoice } from "@/lib/anthropic";

const schema = z.object({
  text: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = schema.parse(body);

    const profile = await prisma.voiceProfile.findFirst();
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
