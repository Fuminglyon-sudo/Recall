import { NextRequest, NextResponse } from "next/server";

// Cookies that must be cleared to fully sign out both admin and Google OAuth users.
// Deletions must be set on the Response object — using cookies() from next/headers
// does not affect a NextResponse.redirect() because they are separate response paths.
const COOKIES_TO_CLEAR = [
  "recall_session",
  // Auth.js v5 JWT — HTTP (dev) and HTTPS (prod) variants
  "authjs.session-token",
  "__Secure-authjs.session-token",
  "authjs.callback-url",
  "__Secure-authjs.callback-url",
  "authjs.csrf-token",
  "__Host-authjs.csrf-token",
];

export async function GET(req: NextRequest) {
  const landingUrl = new URL("/landing", req.url);
  const response = NextResponse.redirect(landingUrl);
  for (const name of COOKIES_TO_CLEAR) {
    response.cookies.set({ name, value: "", maxAge: 0, path: "/" });
  }
  return response;
}
