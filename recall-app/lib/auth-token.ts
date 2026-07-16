// Shared HMAC session-token logic for the env-var admin login.
// Token format: v1.<expiry-unix-seconds>.<hmac-hex>
// The signature covers the version + expiry, so tokens expire server-side
// and rotate automatically whenever AUTH_SECRET changes.
// Uses WebCrypto (crypto.subtle) so the identical code runs in server
// actions, route handlers, and the Edge-runtime proxy.

const VERSION = "v1";
const PAYLOAD_PREFIX = "recall-admin";

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    // A guessable secret makes the admin token publicly computable.
    throw new Error("AUTH_SECRET must be set in production.");
  }
  return "dev-only-secret";
}

async function hmacHex(payload: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createAdminToken(maxAgeSeconds: number): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + maxAgeSeconds;
  const sig = await hmacHex(`${PAYLOAD_PREFIX}.${VERSION}.${exp}`);
  return `${VERSION}.${exp}.${sig}`;
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== VERSION) return false;
  const exp = Number(parts[1]);
  if (!Number.isInteger(exp) || exp * 1000 < Date.now()) return false;
  const expected = await hmacHex(`${PAYLOAD_PREFIX}.${VERSION}.${exp}`);
  return timingSafeEqualHex(parts[2], expected);
}
