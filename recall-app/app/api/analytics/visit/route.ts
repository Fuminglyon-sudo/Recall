import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

// Fired once per full page load by <VisitTracker> in the root layout, so it
// sees every visitor — signed in or not. Vercel's edge network resolves geo
// from the request IP before this function ever runs and hands it over as
// headers; the raw IP itself is never read or stored, only the coarse
// location. Rate-limited by IP rather than gated behind auth, since the
// entire point is capturing visitors who have no session yet.
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!checkRateLimit("analytics-visit", ip, 20)) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  const country = req.headers.get("x-vercel-ip-country");
  const region = req.headers.get("x-vercel-ip-country-region");
  const rawCity = req.headers.get("x-vercel-ip-city");

  try {
    await prisma.visitLog.create({
      data: {
        country: country || null,
        region: region || null,
        // Vercel URI-encodes city names (spaces, accents) in this header.
        city: rawCity ? decodeURIComponent(rawCity) : null,
      },
    });
  } catch (err) {
    console.error("[analytics-visit]", err);
  }

  return NextResponse.json({ ok: true });
}
