import { NextResponse } from "next/server";
import { z } from "zod";
import { generateFounderBatch } from "@/lib/anthropic";

const schema = z.object({
  product: z.enum(["japa-reality", "sharpen", "custom"]),
  context: z.string().min(20),
  deckName: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json();
  const values = schema.parse(body);
  const cards = await generateFounderBatch(values);
  return NextResponse.json({ cards });
}
