import { NextRequest, NextResponse, after } from "next/server";
import { z } from "zod";
import { conductDocPresentation } from "@/lib/anthropic";
import { getCurrentUserId, scopedUserId } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";
import { recordDailyActivity, awardStreakAchievements } from "@/lib/record-activity";
import { prisma } from "@/lib/prisma";

const messageSchema = z.object({
  role: z.enum(["presenter", "listener"]),
  content: z.string().min(1).max(4000),
});

const schema = z.object({
  docText: z.string().min(200).max(20000),
  messages: z.array(messageSchema).min(1).max(3),
  sampleDocId: z.string().max(100).optional(),
  docTitle: z.string().min(1).max(300),
  docTopic: z.string().max(50).optional(),
  isOwnDoc: z.boolean().optional().default(false),
  tzOffsetMinutes: z.coerce.number().int().min(-720).max(840).optional().default(0),
});

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (!checkRateLimit("doc-present", userId, 20)) {
    return NextResponse.json({ error: "Too many requests. Slow down and try again." }, { status: 429 });
  }

  try {
    const body = (await req.json()) as unknown;
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input.", issues: parsed.error.issues }, { status: 400 });
    }

    const { docText, messages, sampleDocId, docTitle, docTopic, isOwnDoc, tzOffsetMinutes } = parsed.data;
    // Server derives the turn count from the transcript, same reasoning as
    // /api/debate — the client can't extend or shortcut the exchange by
    // sending a stale count.
    const exchangeCount = messages.filter((m) => m.role === "presenter").length;

    const result = await conductDocPresentation({ docText, messages, exchangeCount });

    if (result.type !== "final") {
      return NextResponse.json(result);
    }

    // Persist only from the server-computed grade, never anything the client
    // could supply directly — same pattern as debate/social-conversation.
    let sessionId: string | null = null;
    try {
      const uid = scopedUserId(userId);
      const summary = messages.find((m) => m.role === "presenter")?.content ?? "";
      const followUpQuestion = messages.find((m) => m.role === "listener")?.content ?? "";
      const answer = messages.filter((m) => m.role === "presenter")[1]?.content ?? "";

      const session = await prisma.docPresenterSession.create({
        data: {
          userId: uid,
          sampleDocId: sampleDocId ?? null,
          docTitle,
          docTopic: docTopic ?? null,
          isOwnDoc,
          summary,
          followUpQuestion,
          answer,
          summaryScore: result.summaryScore,
          answerScore: result.answerScore,
          overallScore: result.overallScore,
          strengths: result.strengths,
          improvements: result.improvements,
          idealFollowUpAnswer: result.idealFollowUpAnswer,
        },
      });
      sessionId = session.id;

      const newStreak = await recordDailyActivity(uid, tzOffsetMinutes);
      after(() => awardStreakAchievements(uid, newStreak));
    } catch (err) {
      console.error("[doc-present] failed to save session", err);
    }

    return NextResponse.json({ ...result, sessionId });
  } catch (err) {
    console.error("[doc-present]", err);
    return NextResponse.json({ error: "Request failed. Try again." }, { status: 500 });
  }
}
