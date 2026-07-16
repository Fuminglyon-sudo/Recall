import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId, scopedUserId } from "@/lib/session";

// Lets a user say whether a session's AI-generated feedback felt fair —
// not a rating of their own performance. Doesn't affect the stored score;
// this is a trust signal (and future eval dataset), so re-rating or
// clearing a rating is always allowed.

const schema = z.object({
  kind: z.enum(["debate", "speak-up", "social"]),
  sessionId: z.string().min(1),
  rating: z.enum(["up", "down"]).nullable(),
});

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const body = (await req.json().catch(() => null)) as unknown;
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }
  const { kind, sessionId, rating } = parsed.data;
  const uid = scopedUserId(userId);

  try {
    // Prisma's delegate objects share the findFirst/update shape used here,
    // but aren't structurally typed the same way — narrow per kind so
    // ownership is always checked against the right table.
    let updated = false;
    if (kind === "debate") {
      const session = await prisma.debateSession.findFirst({ where: { id: sessionId, userId: uid }, select: { id: true } });
      if (session) { await prisma.debateSession.update({ where: { id: sessionId }, data: { feedbackRating: rating } }); updated = true; }
    } else if (kind === "speak-up") {
      const session = await prisma.speakUpSession.findFirst({ where: { id: sessionId, userId: uid }, select: { id: true } });
      if (session) { await prisma.speakUpSession.update({ where: { id: sessionId }, data: { feedbackRating: rating } }); updated = true; }
    } else {
      const session = await prisma.socialSession.findFirst({ where: { id: sessionId, userId: uid }, select: { id: true } });
      if (session) { await prisma.socialSession.update({ where: { id: sessionId }, data: { feedbackRating: rating } }); updated = true; }
    }

    if (!updated) return NextResponse.json({ error: "Session not found." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[session-feedback]", err);
    return NextResponse.json({ error: "Failed to save rating." }, { status: 500 });
  }
}
