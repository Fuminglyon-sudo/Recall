import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const jar = await cookies();
  // Clear admin HMAC cookie
  jar.delete(COOKIE_NAME);
  // Clear NextAuth/Auth.js JWT cookies (both HTTP and HTTPS variants)
  jar.delete("authjs.session-token");
  jar.delete("__Secure-authjs.session-token");
  jar.delete("authjs.callback-url");
  jar.delete("__Secure-authjs.callback-url");
  jar.delete("authjs.csrf-token");
  jar.delete("__Host-authjs.csrf-token");
  const landingUrl = new URL("/landing", req.url);
  return NextResponse.redirect(landingUrl);
}
