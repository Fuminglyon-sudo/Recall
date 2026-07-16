import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId, scopedUserId } from "@/lib/session";

const schema = z.object({
  endpoint: z.url(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1),
  }),
});

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await req.json()) as unknown;
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid subscription object." }, { status: 400 });
  }

  const { endpoint, keys } = parsed.data;
  const uid = scopedUserId(userId);

  await prisma.pushSubscription.upsert({
    where: { endpoint },
    update: { p256dh: keys.p256dh, auth: keys.auth, userId: uid },
    create: { endpoint, p256dh: keys.p256dh, auth: keys.auth, userId: uid },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await req.json()) as unknown;
  const parsed = z.object({ endpoint: z.string() }).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Missing endpoint." }, { status: 400 });
  }

  const uid = scopedUserId(userId);

  await prisma.pushSubscription.deleteMany({
    where: { endpoint: parsed.data.endpoint, userId: uid },
  });

  return NextResponse.json({ ok: true });
}
