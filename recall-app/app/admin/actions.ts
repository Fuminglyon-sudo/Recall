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
