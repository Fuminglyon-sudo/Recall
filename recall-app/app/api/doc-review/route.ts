import { NextRequest, NextResponse, after } from "next/server";
import { z } from "zod";
import { reviewDocumentContribution } from "@/lib/anthropic";
import { getCurrentUserId, scopedUserId } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";
import { recordDailyActivity, awardStreakAchievements } from "@/lib/record-activity";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  // Long enough to actually contain an argument worth critiquing, capped so a
  // pasted book doesn't blow out the prompt.
  docText: z.string().min(200).max(20000),
  userNotes: z.string().max(5000).optional().default(""),
  sampleDocId: z.string().max(100).optional(),
  docTitle: z.string().min(1).max(300),
  docTopic: z.string().max(50).optional(),
  isOwnDoc: z.boolean().optional().default(false),
  tzOffsetMinutes: z.coerce.number().int().min(-720).max(840).optional().default(0),
});

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (!checkRateLimit("doc-review", userId, 20)) {
    return NextResponse.json({ error: "Too many requests. Slow down and try again." }, { status: 429 });
  }

  try {
    const body = (await req.json()) as unknown;
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input.", issues: parsed.error.issues }, { status: 400 });
    }

    const { docText, userNotes, sampleDocId, docTitle, docTopic, isOwnDoc, tzOffsetMinutes } = parsed.data;
    const result = await reviewDocumentContribution({ docText, userNotes });

    // Persist the graded pass — note docText is intentionally NOT stored (see
    // the DocReviewSession comment in schema.prisma: pasted documents are the
    // user's employer's confidential material).
    let sessionId: string | null = null;
    try {
      const uid = scopedUserId(userId);
      const session = await prisma.docReviewSession.create({
        data: {
          userId: uid,
          sampleDocId: sampleDocId ?? null,
          docTitle,
          docTopic: docTopic ?? null,
          isOwnDoc,
          attempted: userNotes.trim().length > 0,
          detectionScore: result.detectionScore,
          userNotes,
          caught: result.caught,
          missed: result.missed,
          topQuestions: result.topQuestions,
          judgmentNote: result.judgmentNote,
          raisingTip: result.raisingTip,
        },
      });
      sessionId = session.id;

      // Reading a document critically and committing to what you'd raise is a
      // practice activity like any other mode — it counts toward the streak.
      const newStreak = await recordDailyActivity(uid, tzOffsetMinutes);
      after(() => awardStreakAchievements(uid, newStreak));
    } catch (err) {
      console.error("[doc-review] failed to save session", err);
    }

    return NextResponse.json({ ...result, sessionId });
  } catch (err) {
    console.error("[doc-review]", err);
    return NextResponse.json({ error: "Request failed. Try again." }, { status: 500 });
  }
}
