import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateDebatePrep } from "@/lib/anthropic";
import { getCurrentUserId } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";

const schema = z.object({
  motion: z.string().min(5),
  position: z.enum(["for", "against"]),
  opponentType: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (!checkRateLimit("debate-prep", userId, 20)) return NextResponse.json({ error: "Too many requests. Slow down and try again." }, { status: 429 });

  try {
    const body = (await req.json()) as unknown;
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input.", issues: parsed.error.issues }, { status: 400 });
    }
    const result = await generateDebatePrep(parsed.data);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[debate-prep]", err);
    return NextResponse.json({ error: "Request failed. Try again." }, { status: 500 });
  }
}
