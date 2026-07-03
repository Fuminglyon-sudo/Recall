import type { Metadata } from "next";
import { getCurrentUserId, ADMIN_USER_ID } from "@/lib/session";
import { auth } from "@/lib/next-auth";
import { LandingPage } from "@/components/landing-page";

export const metadata: Metadata = {
  title: "Summon — Practice Vocabulary, Speaking & Conversation Skills",
  description:
    "Build lasting vocabulary with SM-2 spaced repetition. Practice high-stakes speeches and social conversations with AI coaching. Summon is free to use — no credit card needed.",
  keywords: [
    "spaced repetition app",
    "vocabulary builder",
    "conversation practice",
    "speaking confidence",
    "flashcard app",
    "SM-2",
    "social skills training",
    "speak up practice",
  ],
  openGraph: {
    title: "Summon — Practice Vocabulary, Speaking & Conversation Skills",
    description:
      "Build vocabulary with spaced repetition. Practice high-stakes speaking and social conversations with AI feedback. Free forever.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Summon — Practice Vocabulary, Speaking & Conversation Skills",
    description:
      "Build vocabulary with spaced repetition. Practice high-stakes speaking and conversations with AI feedback.",
  },
};

export default async function LandingRoute() {
  const userId = await getCurrentUserId();
  const isLoggedIn = !!userId;

  let userName: string | null = null;
  if (isLoggedIn && userId !== ADMIN_USER_ID) {
    const session = await auth();
    userName = session?.user?.name ?? session?.user?.email ?? null;
  } else if (isLoggedIn) {
    userName = "Admin";
  }

  return <LandingPage isLoggedIn={isLoggedIn} userName={userName} />;
}
