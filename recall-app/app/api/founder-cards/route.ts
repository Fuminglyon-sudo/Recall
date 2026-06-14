import { NextResponse } from "next/server";
import { z } from "zod";
import { generateFounderBatch } from "@/lib/anthropic";

const schema = z.object({
  product: z.enum(["japa-reality", "sharpen", "custom"]),
  context: z.string().min(8),
  deckName: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const values = schema.parse(body);
    const cards = await generateFounderBatch(values);
    return NextResponse.json({ cards });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: err.issues }, { status: 400 });
    }
    console.error("[founder-cards]", err);
    return NextResponse.json({ error: "Failed to generate cards. Try again." }, { status: 500 });
  }
}
