import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { chatWithPrincess } from "@/lib/anthropic";
import { checkRateLimit } from "@/lib/rate-limit";
import { MAX_ASSISTANT_CHARS, MAX_TURNS, MAX_USER_CHARS } from "@/lib/princess-limits";

// Unauthenticated by design — this runs on the public homepage before
// anyone has signed in. Rate-limited by IP instead of userId, and kept
// stricter than the logged-in AI routes since every request here is a
// real API cost with no account behind it to hold accountable.
const LIMIT_PER_MINUTE = 8;

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

// Validated per role. Visitor input stays tightly capped, but assistant turns
// are Princess's own replies being echoed back as context — holding them to the
// user limit rejected any history containing a long answer, which silently
// broke the conversation from that point on.
const schema = z.object({
  messages: z
    .array(
      z.discriminatedUnion("role", [
        z.object({ role: z.literal("user"), content: z.string().min(1).max(MAX_USER_CHARS) }),
        z.object({ role: z.literal("assistant"), content: z.string().min(1).max(MAX_ASSISTANT_CHARS) }),
      ])
    )
    .min(1)
    .max(MAX_TURNS),
});

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!checkRateLimit("princess-chat", ip, LIMIT_PER_MINUTE)) {
    return NextResponse.json({ error: "Too many requests. Slow down and try again." }, { status: 429 });
  }

  try {
    const body = (await req.json()) as unknown;
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input." }, { status: 400 });
    }

    const reply = await chatWithPrincess(parsed.data.messages);
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[princess-chat]", err);
    return NextResponse.json({ error: "Request failed. Try again." }, { status: 500 });
  }
}
