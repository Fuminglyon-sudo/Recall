import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { prisma } from "@/lib/prisma";

// Vercel Cron calls this endpoint with Authorization: Bearer <CRON_SECRET>
function isAuthorised(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false; // refuse if not configured
  const auth = req.headers.get("authorization") ?? "";
  return auth === `Bearer ${secret}`;
}

function initVapid() {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const email = process.env.VAPID_EMAIL;
  if (!publicKey || !privateKey || !email) return false;
  webpush.setVapidDetails(email, publicKey, privateKey);
  return true;
}

export async function GET(req: NextRequest) {
  if (!isAuthorised(req)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  if (!initVapid()) {
    return NextResponse.json({ error: "VAPID keys not configured." }, { status: 500 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Find all push subscriptions that have due cards today
  const subscriptions = await prisma.pushSubscription.findMany();

  let sent = 0;
  let failed = 0;
  const stale: string[] = [];

  await Promise.all(
    subscriptions.map(async (sub: { endpoint: string; p256dh: string; auth: string; userId: string | null }) => {
      const uid = sub.userId; // null = admin

      const dueCount = await prisma.card.count({
        where: {
          dueAt: { lt: tomorrow },
          deck: { userId: uid },
        },
      });

      if (dueCount === 0) return;

      const payload = JSON.stringify({
        title: "Recall",
        body:
          dueCount === 1
            ? "1 card is waiting for your review."
            : `${dueCount} cards are waiting for your review.`,
        url: "/today",
      });

      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        );
        sent++;
      } catch (err: unknown) {
        const status = (err as { statusCode?: number }).statusCode;
        if (status === 410 || status === 404) {
          // Subscription expired or revoked — clean up
          stale.push(sub.endpoint);
        }
        failed++;
      }
    })
  );

  // Remove expired subscriptions
  if (stale.length > 0) {
    await prisma.pushSubscription.deleteMany({ where: { endpoint: { in: stale } } });
  }

  return NextResponse.json({ sent, failed, staleRemoved: stale.length });
}
