"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/session";

// ── User management ──────────────────────────────────────────────────────────

export async function updateUserPlan(
  userId: string,
  plan: "free" | "founder" | "pro",
): Promise<{ error?: string }> {
  if (!(await isAdmin())) return { error: "Unauthorized" };
  if (!userId) return { error: "Missing userId" };

  await prisma.user.update({
    where: { id: userId },
    data: {
      plan,
      planStartedAt: plan !== "free" ? new Date() : null,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/pricing");
  return {};
}

export async function deleteUser(userId: string): Promise<{ error?: string }> {
  if (!(await isAdmin())) return { error: "Unauthorized" };
  if (!userId) return { error: "Missing userId" };

  await prisma.user.delete({ where: { id: userId } });

  revalidatePath("/admin");
  return {};
}

// ── Bans ─────────────────────────────────────────────────────────────────────
// Checked in lib/next-auth.ts's signIn callback, before any Account/User row
// is created — a banned email can't sign in even to create a fresh account.

export async function banUser(userId: string, reason?: string): Promise<{ error?: string }> {
  if (!(await isAdmin())) return { error: "Unauthorized" };
  if (!userId) return { error: "Missing userId" };

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
  if (!user) return { error: "User not found" };

  await prisma.$transaction([
    prisma.bannedEmail.upsert({
      where: { email: user.email.toLowerCase() },
      create: { email: user.email.toLowerCase(), reason: reason?.trim() || null },
      update: { reason: reason?.trim() || null },
    }),
    prisma.user.delete({ where: { id: userId } }),
  ]);

  revalidatePath("/admin");
  return {};
}

export async function banEmail(email: string, reason?: string): Promise<{ error?: string }> {
  if (!(await isAdmin())) return { error: "Unauthorized" };
  const normalized = email.trim().toLowerCase();
  if (!normalized || !normalized.includes("@")) return { error: "Enter a valid email address" };

  await prisma.bannedEmail.upsert({
    where: { email: normalized },
    create: { email: normalized, reason: reason?.trim() || null },
    update: { reason: reason?.trim() || null },
  });

  revalidatePath("/admin");
  return {};
}

export async function unbanEmail(email: string): Promise<{ error?: string }> {
  if (!(await isAdmin())) return { error: "Unauthorized" };
  if (!email) return { error: "Missing email" };

  await prisma.bannedEmail.delete({ where: { email } }).catch(() => null);

  revalidatePath("/admin");
  return {};
}

// ── Site config ───────────────────────────────────────────────────────────────

export async function upsertSiteConfig(
  key: string,
  value: string,
): Promise<{ error?: string }> {
  if (!(await isAdmin())) return { error: "Unauthorized" };

  await prisma.siteConfig.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });

  revalidatePath("/admin");
  revalidatePath("/pricing");
  return {};
}
