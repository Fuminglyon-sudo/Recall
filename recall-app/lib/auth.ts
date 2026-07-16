import { createHash, timingSafeEqual } from "crypto";
import { createAdminToken } from "./auth-token";

const COOKIE_NAME = "recall_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export function createSessionToken(): Promise<string> {
  return createAdminToken(SESSION_MAX_AGE_SECONDS);
}

// Hash both sides to a fixed-length digest first — timingSafeEqual throws on
// mismatched lengths, and comparing raw input lengths/bytes directly would
// leak information about the correct username/password through timing.
function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkCredentials(username: string, password: string): boolean {
  const validUser = process.env.AUTH_USERNAME ?? "";
  const validPass = process.env.AUTH_PASSWORD ?? "";
  if (!validUser || !validPass) return false;
  return safeEqual(username, validUser) && safeEqual(password, validPass);
}

export { COOKIE_NAME };
