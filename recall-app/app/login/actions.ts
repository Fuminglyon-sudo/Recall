"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { checkCredentials, createSessionToken, COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/auth";

// In-memory rate limiter — works per process instance.
// On serverless (Vercel), each cold start gets a fresh map, which is fine:
// it limits abusive bursts within a single warm instance.
const attempts = new Map<string, { count: number; resetAt: number }>();
const LIMIT = 10;
const WINDOW_MS = 15 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now >= entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > LIMIT;
}

async function getClientIp(): Promise<string> {
  const hdrs = await headers();
  return (
    hdrs.get("x-forwarded-for")?.split(",")[0].trim() ??
    hdrs.get("x-real-ip") ??
    "unknown"
  );
}

// `from` comes straight from the query string of an unauthenticated request
// and gets echoed into the login form, then used as a post-login redirect
// target. next/navigation's redirect() accepts absolute URLs, so without
// this check a link like /login?from=https://evil.example would send a
// successfully-authenticated admin off-site right after they type in real
// credentials — an open-redirect phishing setup. Only same-origin relative
// paths are allowed through; same guard already used in app/decks/actions.ts.
function safeRedirectTarget(from: string | null): string {
  if (from && from.startsWith("/") && !from.startsWith("//")) return from;
  return "/";
}

export async function loginAction(formData: FormData) {
  const from = safeRedirectTarget(formData.get("from") as string | null);
  const ip = await getClientIp();

  if (isRateLimited(ip)) {
    redirect(`/login?error=rate&from=${encodeURIComponent(from)}`);
  }

  const username = (formData.get("username") as string | null) ?? "";
  const password = (formData.get("password") as string | null) ?? "";

  if (!checkCredentials(username, password)) {
    redirect(`/login?error=1&from=${encodeURIComponent(from)}`);
  }

  // Successful login — clear the counter for this IP
  attempts.delete(ip);

  const token = await createSessionToken();
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  redirect(from);
}

export async function logoutAction() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
  redirect("/login");
}
