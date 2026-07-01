"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId, ADMIN_USER_ID } from "@/lib/session";
import { auth, signOut } from "@/lib/next-auth";

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
