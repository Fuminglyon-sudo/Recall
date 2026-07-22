import { NextRequest, NextResponse, after } from "next/server";
import { z } from "zod";
import { reviewDocumentContribution } from "@/lib/anthropic";
import { getCurrentUserId, scopedUserId } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";
import { recordDailyActivity, awardStreakAchievements } from "@/lib/record-activity";

const schema = z.object({
  // Long enough to actually contain an argument worth critiquing, capped so a
  // pasted book doesn't blow out the prompt.
  docText: z.string().min(200).max(20000),
  userNotes: z.string().max(5000).optional().default(""),
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

    const { docText, userNotes, tzOffsetMinutes } = parsed.data;
    const result = await reviewDocumentContribution({ docText, userNotes });

    // Reading a document critically and committing to what you'd raise is a
    // practice activity like any other mode — it counts toward the streak.
    try {
      const uid = scopedUserId(userId);
      const newStreak = await recordDailyActivity(uid, tzOffsetMinutes);
      after(() => awardStreakAchievements(uid, newStreak));
    } catch (err) {
      console.error("[doc-review] failed to record activity", err);
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("[doc-review]", err);
    return NextResponse.json({ error: "Request failed. Try again." }, { status: 500 });
  }
}
