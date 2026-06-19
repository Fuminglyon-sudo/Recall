import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { conductSocialConversation } from "@/lib/anthropic";

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
});

export async function POST(req: NextRequest) {
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
