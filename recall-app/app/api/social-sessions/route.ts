import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId, scopedUserId } from "@/lib/session";

const messageSchema = z.object({
  role: z.enum(["user", "character"]),
  content: z.string(),
});

const saveSchema = z.object({
  scenarioTag: z.string().min(1),
  scenarioEmoji: z.string().min(1),
  scenarioContext: z.string().min(1),
  characterLabel: z.string().min(1),
  difficulty: z.enum(["easy", "medium", "hard"]),
  exchangeCount: z.number().int().min(0),
  score: z.number().int().min(1).max(10),
  strongPoints: z.array(z.string()),
  improvements: z.array(z.string()),
  powerMove: z.string(),
  messages: z.array(messageSchema),
  modelConversation: z.array(messageSchema).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = (await req.json()) as unknown;
    const parsed = saveSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input.", issues: parsed.error.issues }, { status: 400 });
    }

    const uid = scopedUserId(userId);

    const session = await prisma.socialSession.create({
      data: {
        userId: uid,
        scenarioTag: parsed.data.scenarioTag,
        scenarioEmoji: parsed.data.scenarioEmoji,
        scenarioContext: parsed.data.scenarioContext,
        characterLabel: parsed.data.characterLabel,
        difficulty: parsed.data.difficulty,
        exchangeCount: parsed.data.exchangeCount,
        score: parsed.data.score,
        strongPoints: parsed.data.strongPoints,
        improvements: parsed.data.improvements,
        powerMove: parsed.data.powerMove,
        messages: parsed.data.messages,
        ...(parsed.data.modelConversation
          ? { modelConversation: parsed.data.modelConversation }
          : {}),
      },
    });

    return NextResponse.json({ id: session.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save session." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const uid = scopedUserId(userId);

    const sessions = await prisma.socialSession.findMany({
      where: { userId: uid },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        createdAt: true,
        scenarioTag: true,
        scenarioEmoji: true,
        characterLabel: true,
        difficulty: true,
        exchangeCount: true,
        score: true,
        strongPoints: true,
        improvements: true,
        powerMove: true,
        messages: true,
        modelConversation: true,
      },
    });
    return NextResponse.json(sessions);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load sessions." }, { status: 500 });
  }
}
