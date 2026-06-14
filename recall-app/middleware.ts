import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "recall_session";

async function verifyToken(token: string): Promise<boolean> {
  const secret = process.env.AUTH_SECRET ?? "fallback-dev-secret";
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const tokenBytes = new Uint8Array(
      (token.match(/.{1,2}/g) ?? []).map((b) => parseInt(b, 16))
    );
    return await crypto.subtle.verify(
      "HMAC",
      key,
      tokenBytes,
      encoder.encode("authenticated")
    );
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_NAME)?.value ?? "";
  if (await verifyToken(token)) {
    return NextResponse.next();
  }

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
