import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "recall_session";
const SECRET = process.env.AUTH_SECRET ?? "fallback-dev-secret";

export function signToken(value: string): string {
  const sig = createHmac("sha256", SECRET).update(value).digest("hex");
  return `${value}.${sig}`;
}

export function verifyToken(token: string): boolean {
  const dot = token.lastIndexOf(".");
  if (dot === -1) return false;
  const value = token.slice(0, dot);
  const expected = signToken(value);
  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function checkCredentials(username: string, password: string): boolean {
  const validUser = process.env.AUTH_USERNAME ?? "";
  const validPass = process.env.AUTH_PASSWORD ?? "";
  return username === validUser && password === validPass;
}

export { COOKIE_NAME };
