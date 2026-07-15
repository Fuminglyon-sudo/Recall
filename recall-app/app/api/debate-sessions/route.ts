import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId, scopedUserId } from "@/lib/session";

const messageSchema = z.object({
  role: z.enum(["user", "opponent"]),
  content: z.string(),
});

const saveSchema = z.object({
  motion: z.string().min(5),
  position: z.enum(["for", "against"]),
  opponentType: z.string().min(1),
  difficulty: z.enum(["easy", "medium", "hard"]),
  exchangeCount: z.number().int().min(0),
  score: z.number().int().min(1).max(10),
  strongPoints: z.array(z.string()),
  improvements: z.array(z.string()),
  keyFallacy: z.string().nullable().optional(),
  missedArg: z.string(),
  modelRebuttal: z.string(),
  messages: z.array(messageSchema),
});

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const body = (await req.json()) as unknown;
    const parsed = saveSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input.", issues: parsed.error.issues }, { status: 400 });
    }
    const uid = scopedUserId(userId);
    const session = await prisma.debateSession.create({
      data: {
        userId: uid,
        motion: parsed.data.motion,
        position: parsed.data.position,
        opponentType: parsed.data.opponentType,
        difficulty: parsed.data.difficulty,
        exchangeCount: parsed.data.exchangeCount,
        score: parsed.data.score,
        strongPoints: parsed.data.strongPoints,
        improvements: parsed.data.improvements,
        keyFallacy: parsed.data.keyFallacy ?? null,
        missedArg: parsed.data.missedArg,
        modelRebuttal: parsed.data.modelRebuttal,
        messages: parsed.data.messages,
      },
    });
    return NextResponse.json({ id: session.id });
  } catch (err) {
    console.error("[debate-sessions]", err);
    return NextResponse.json({ error: "Failed to save session." }, { status: 500 });
  }
}

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const uid = scopedUserId(userId);
    const sessions = await prisma.debateSession.findMany({
      where: { userId: uid ?? undefined },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        createdAt: true,
        motion: true,
        position: true,
        opponentType: true,
        difficulty: true,
        exchangeCount: true,
        score: true,
      },
    });
    return NextResponse.json(sessions);
  } catch (err) {
    console.error("[debate-sessions]", err);
    return NextResponse.json({ error: "Failed to load sessions." }, { status: 500 });
  }
}
