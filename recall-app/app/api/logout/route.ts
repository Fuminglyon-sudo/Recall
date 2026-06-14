import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
  const loginUrl = new URL("/login", req.url);
  return NextResponse.redirect(loginUrl);
}
