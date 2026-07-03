"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId, ADMIN_USER_ID, scopedUserId } from "@/lib/session";
import { auth, signOut } from "@/lib/next-auth";

export async function updateDailyCardLimit(formData: FormData): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId || userId === ADMIN_USER_ID) return;
  const uid = scopedUserId(userId);
  if (!uid) return;

  const value = parseInt(String(formData.get("dailyNewCards") ?? ""), 10);
  if (isNaN(value) || value < 1 || value > 50) return; // HTML min/max guards this

  await prisma.userSettings.upsert({
    where: { userId: uid },
    create: { id: crypto.randomUUID(), userId: uid, dailyNewCards: value },
    update: { dailyNewCards: value },
  });

  revalidatePath("/settings");
  revalidatePath("/today");
  revalidatePath("/");
}

export async function deleteAccount(
  _prev: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const userId = await getCurrentUserId();
  if (!userId || userId === ADMIN_USER_ID) {
    return { error: "Cannot delete an admin account from the UI." };
  }

  const session = await auth();
  const actualEmail = session?.user?.email?.toLowerCase() ?? "";
  if (!actualEmail) return { error: "Could not verify your session." };

  const confirmed = ((formData.get("email") as string) ?? "").trim().toLowerCase();
  if (confirmed !== actualEmail) {
    return { error: "Email address doesn't match your account." };
  }

  // Remove push subscriptions (no FK cascade from PushSubscription → User)
  await prisma.pushSubscription.deleteMany({ where: { userId } });

  // Delete user — Prisma cascades to decks, cards, sessions, streak, etc.
  await prisma.user.delete({ where: { id: userId } });

  // Clear the NextAuth session cookie and redirect
  await signOut({ redirectTo: "/login" });
  return null;
}
