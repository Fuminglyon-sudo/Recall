import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { verifyAdminToken } from "@/lib/auth-token";

const ADMIN_COOKIE = "recall_session";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow: root landing, login, Next.js internals, static assets, auth API, SW, icons
  if (
    pathname === "/" ||
    pathname === "/landing" ||
    pathname === "/about" ||
    pathname === "/features" ||
    pathname === "/pricing" ||
    pathname === "/faq" ||
    pathname === "/privacy" ||
    pathname === "/terms" ||
    pathname === "/contact" ||
    pathname === "/blog" ||
    pathname.startsWith("/blog/") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    // Princess is the anonymous homepage chat widget — it has no session
    // to check by design, and rate-limits by IP inside the route itself.
    pathname === "/api/princess-chat" ||
    // Fired by every visitor on every full page load, signed in or not —
    // the whole point is capturing visitors before they ever have a
    // session. Rate-limits by IP inside the route itself.
    pathname === "/api/analytics/visit" ||
    // Vercel Cron calls this with a Bearer CRON_SECRET, never a session
    // cookie — without this, proxy rejects every cron invocation with a 401
    // before the route's own token check ever runs, silently disabling the
    // daily due-card push job.
    pathname === "/api/push/send" ||
    // Shared-deck links are meant to work for signed-out visitors — the page
    // itself renders a public preview and a "sign in to add this" prompt
    // when there's no session. Without this, every shared link just bounces
    // straight to /login instead of showing the deck.
    pathname.startsWith("/decks/shared/") ||
    pathname === "/sw.js" ||
    pathname === "/favicon.ico" ||
    pathname === "/favicon.svg" ||
    pathname === "/manifest.webmanifest" ||
    // Social-share image routes — link-preview crawlers (WhatsApp, iMessage,
    // Twitter/X, etc.) fetch these with no session cookie, so they must stay
    // public or every shared link silently redirects to /login instead of
    // returning the image. Matches at any route segment (e.g. both
    // /opengraph-image and /landing/opengraph-image), not just the root.
    /\/(opengraph-image|twitter-image)$/.test(pathname) ||
    // All static file types served from /public/ — images, fonts, etc.
    // Excludes /api/ so a future API route can never accidentally become
    // public just because its path happens to end in one of these
    // extensions (e.g. a PDF/image export endpoint) — actual API responses
    // are never real files in /public/, so this exclusion costs nothing.
    (!pathname.startsWith("/api/") && /\.(png|jpe?g|webp|gif|svg|ico|woff2?|ttf|eot|mp4|mp3|pdf|txt|xml)$/i.test(pathname))
  ) {
    return NextResponse.next();
  }

  // ── Path 1: Admin (env-var signed cookie) ────────────────────────────────
  const adminToken = req.cookies.get(ADMIN_COOKIE)?.value ?? "";
  if (await verifyAdminToken(adminToken)) {
    return NextResponse.next();
  }

  // ── Path 2: Google OAuth (NextAuth JWT cookie) ───────────────────────────
  // getToken() defaults secureCookie to false (looking for the unprefixed
  // "authjs.session-token" cookie) unless told otherwise, but Auth.js sets
  // the "__Secure-" prefixed cookie on HTTPS — mismatch here silently
  // returns null and bounces every authenticated request back to /login.
  const nextAuthToken = await getToken({
    req,
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
    secureCookie: req.nextUrl.protocol === "https:",
  });
  if (nextAuthToken) {
    return NextResponse.next();
  }

  // ── Not authenticated ────────────────────────────────────────────────────
  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "Session expired. Please refresh the page and log in again." },
      { status: 401 },
    );
  }

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
