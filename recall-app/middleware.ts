import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const ADMIN_COOKIE = "recall_session";

async function verifyAdminToken(token: string): Promise<boolean> {
  if (!token) return false;
  const secret = process.env.AUTH_SECRET ?? "fallback-dev-secret";
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode("authenticated"));
  const expected = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return token === expected;
}

export async function middleware(req: NextRequest) {
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
    pathname === "/sw.js" ||
    pathname === "/favicon.ico" ||
    pathname === "/favicon.svg" ||
    pathname === "/manifest.webmanifest" ||
    // All static file types served from /public/ — images, fonts, etc.
    /\.(png|jpe?g|webp|gif|svg|ico|woff2?|ttf|eot|mp4|mp3|pdf|txt|xml)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  // ── Path 1: Admin (env-var HMAC cookie) ─────────────────────────────────
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
