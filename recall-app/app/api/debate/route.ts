import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { conductDebate, streamDebateReply, REACTION_SENTINEL_RE } from "@/lib/anthropic";
import { OPPONENT_IDS, OPPONENT_LABELS, buildOpponentPrompt } from "@/lib/debate-opponents";
import { getCurrentUserId } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";

const messageSchema = z.object({
  role: z.enum(["user", "opponent"]),
  content: z.string().min(1).max(4000),
});

const schema = z.object({
  motion: z.string().min(5).max(600),
  position: z.enum(["for", "against"]),
  opponentId: z.enum(OPPONENT_IDS),
  difficulty: z.enum(["easy", "medium", "hard"]),
  messages: z.array(messageSchema).max(12),
  forceEnd: z.boolean().optional(),
});

// Kept in sync with the sentinel length so it never reaches the client mid-flush.
const HOLDBACK_CHARS = 24;

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (!checkRateLimit("debate", userId, 30)) {
    return NextResponse.json({ error: "Too many requests. Slow down and try again." }, { status: 429 });
  }

  const body = (await req.json().catch(() => null)) as unknown;
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input.", issues: parsed.error.issues }, { status: 400 });
  }

  const { motion, position, opponentId, difficulty, messages, forceEnd } = parsed.data;
  // Server derives the turn count from the transcript — the client can no
  // longer extend the debate past 5 exchanges by holding a stale count.
  const exchangeCount = messages.filter((m) => m.role === "user").length;
  const mustEnd = forceEnd === true || exchangeCount >= 5;
  const opponentPrompt = buildOpponentPrompt(opponentId, difficulty);
  const opponentType = OPPONENT_LABELS[opponentId];

  try {
    if (mustEnd) {
      const result = await conductDebate({
        motion, position, opponentType, opponentPrompt,
        messages, exchangeCount, forceEnd: true,
      });
      return NextResponse.json(result);
    }

    const stream = streamDebateReply({ motion, position, opponentPrompt, messages });
    if (!stream) {
      // No API key configured — conductDebate returns the canned fallback.
      const result = await conductDebate({
        motion, position, opponentType, opponentPrompt,
        messages, exchangeCount, forceEnd: false,
      });
      return NextResponse.json(result);
    }

    const encoder = new TextEncoder();
    const sse = new ReadableStream({
      async start(controller) {
        const send = (event: string, data: unknown) =>
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        let tail = "";
        try {
          for await (const event of stream) {
            if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
              tail += event.delta.text;
              if (tail.length > HOLDBACK_CHARS) {
                send("text", { text: tail.slice(0, tail.length - HOLDBACK_CHARS) });
                tail = tail.slice(tail.length - HOLDBACK_CHARS);
              }
            }
          }
          let audienceReaction = 0;
          const match = tail.match(REACTION_SENTINEL_RE);
          if (match) {
            audienceReaction = Math.max(-3, Math.min(3, parseInt(match[1], 10)));
            tail = tail.replace(/\s*⟦REACTION:-?\d+⟧\s*$/, "");
          }
          if (tail) send("text", { text: tail });
          send("done", { audienceReaction });
        } catch (err) {
          console.error("[debate]", err);
          send("error", { error: "The opponent lost their train of thought. Try again." });
        } finally {
          controller.close();
        }
      },
      cancel() {
        stream.abort();
      },
    });

    return new Response(sse, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("[debate]", err);
    return NextResponse.json({ error: "Request failed. Try again." }, { status: 500 });
  }
}
