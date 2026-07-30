import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId, scopedUserId } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";

// Endpoints get stored, then fetched server-side by /api/push/send (Vercel
// Cron) with no further checks — an unrestricted URL here is a stored,
// cron-triggered SSRF vector. Real push subscriptions only ever come from
// the browser vendor's own push service, so the hostname is a closed set.
const ALLOWED_PUSH_HOSTNAMES = new Set([
  "fcm.googleapis.com",
  "android.googleapis.com",
  "updates.push.services.mozilla.com",
  "web.push.apple.com",
]);

const MAX_SUBSCRIPTIONS_PER_USER = 10;

const schema = z.object({
  endpoint: z
    .string()
    .url()
    .max(2000)
    .refine((url) => {
      try {
        const parsed = new URL(url);
        return parsed.protocol === "https:" && ALLOWED_PUSH_HOSTNAMES.has(parsed.hostname);
      } catch {
        return false;
      }
    }, "Unrecognized push service endpoint."),
  keys: z.object({
    p256dh: z.string().min(1).max(500),
    auth: z.string().min(1).max(500),
  }),
});

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!checkRateLimit("push-subscribe", userId, 10)) {
    return NextResponse.json({ error: "Too many requests. Slow down and try again." }, { status: 429 });
  }

  const body = (await req.json()) as unknown;
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid subscription object." }, { status: 400 });
  }

  const { endpoint, keys } = parsed.data;
  const uid = scopedUserId(userId);

  const existing = await prisma.pushSubscription.findUnique({ where: { endpoint }, select: { id: true } });
  if (!existing) {
    const count = await prisma.pushSubscription.count({ where: { userId: uid } });
    if (count >= MAX_SUBSCRIPTIONS_PER_USER) {
      return NextResponse.json({ error: "Too many saved devices — remove one before adding another." }, { status: 429 });
    }
  }

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
