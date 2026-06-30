import { cookies } from "next/headers";
import { createHmac } from "crypto";
import { auth } from "./next-auth";

// The sentinel userId used for the env-var admin.
// All admin-owned rows have userId = null (legacy) or will read via this path.
export const ADMIN_USER_ID = "__admin__" as const;

async function isAdminCookieValid(token: string): Promise<boolean> {
  if (!token) return false;
  const secret = process.env.AUTH_SECRET ?? "fallback-dev-secret";
  const expected = createHmac("sha256", secret).update("authenticated").digest("hex");
  return token === expected;
}

/**
 * Returns the current user's id, or null if not authenticated.
 *
 * - Admin (env-var login) → ADMIN_USER_ID ("__admin__")
 * - Google OAuth user     → their Prisma User.id (cuid)
 * - Not logged in         → null
 */
export async function getCurrentUserId(): Promise<string | null> {
  // Admin path — HMAC cookie takes priority
  const jar = await cookies();
  const adminToken = jar.get("recall_session")?.value ?? "";
  if (await isAdminCookieValid(adminToken)) return ADMIN_USER_ID;

  // Google OAuth path — NextAuth JWT
  const session = await auth();
  return session?.user?.id ?? null;
}

/**
 * Convenience: returns true when the current session is the admin env account.
 */
export async function isAdmin(): Promise<boolean> {
  const id = await getCurrentUserId();
  return id === ADMIN_USER_ID;
}

/**
 * Returns the userId value to use in Prisma where/data clauses for the current user.
 * Admin-owned rows have userId = null; Google user rows have their Prisma User.id.
 */
export function scopedUserId(userId: string): string | null {
  return userId === ADMIN_USER_ID ? null : userId;
}
