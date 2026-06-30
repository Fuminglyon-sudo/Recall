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

  // Always allow: login page, Next.js internals, static assets, auth API, SW, icons
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname === "/sw.js" ||
    pathname === "/favicon.ico" ||
    pathname === "/icon.png" ||
    pathname === "/apple-icon.png" ||
    pathname === "/manifest.webmanifest"
  ) {
    return NextResponse.next();
  }

  // ── Path 1: Admin (env-var HMAC cookie) ─────────────────────────────────
  const adminToken = req.cookies.get(ADMIN_COOKIE)?.value ?? "";
  if (await verifyAdminToken(adminToken)) {
    return NextResponse.next();
  }

  // ── Path 2: Google OAuth (NextAuth JWT cookie) ───────────────────────────
  const nextAuthToken = await getToken({
    req,
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  });
  if (nextAuthToken?.userId) {
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
