import { NextRequest, NextResponse } from "next/server";

// Cookies that must be cleared to fully sign out both admin and Google OAuth users.
// Deletions must be set on the Response object — using cookies() from next/headers
// does not affect a NextResponse.redirect() because they are separate response paths.
//
// On HTTPS (Vercel), Auth.js sets __Secure-prefixed cookies. Browsers only honour
// a deletion for a __Secure-/__Host- cookie if the Set-Cookie on the clearing
// response also carries the Secure attribute — without it the deletion is silently
// ignored and the session persists.
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
  const isHttps = req.nextUrl.protocol === "https:";

  for (const name of COOKIES_TO_CLEAR) {
    response.cookies.set({
      name,
      value: "",
      maxAge: 0,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      // __Secure- and __Host- prefixed cookies are only accepted (and deleted)
      // by the browser when the response carries Secure. On plain HTTP these
      // prefixed cookies never exist, so the flag has no effect there.
      secure: isHttps,
    });
  }
  return response;
}
