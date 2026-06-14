import { NextResponse } from "next/server";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  text: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json();
  const { text } = schema.parse(body);

  const profile = await prisma.voiceProfile.findFirst();
  const tone = profile?.tone?.trim() ?? "";

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ result: text });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const systemPrompt = tone
    ? `You are a ghostwriter who matches a person's exact voice. Return only the rephrased text — no explanations, no quotes, no preamble, no markdown.\n\nHere is how they sound:\n${tone}`
    : "You are a ghostwriter. Rephrase the text to be clear, direct, and confident. Return only the rephrased text — no explanations, no quotes, no preamble.";

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 400,
    temperature: 0.6,
    system: systemPrompt,
    messages: [{ role: "user", content: text }],
  });

  const result = response.content
    .filter((item): item is Anthropic.TextBlock => item.type === "text")
    .map((item) => item.text)
    .join("")
    .trim();

  return NextResponse.json({ result });
}
