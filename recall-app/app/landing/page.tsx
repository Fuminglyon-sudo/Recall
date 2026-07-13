import type { Metadata } from "next";
import { getCurrentUserId, ADMIN_USER_ID } from "@/lib/session";
import { auth } from "@/lib/next-auth";
import { LandingPage } from "@/components/landing-page";

export const metadata: Metadata = {
  title: "Sọrọ Sọkẹ AI — Practice Vocabulary, Speaking & Conversation Skills",
  description:
    "Build lasting vocabulary with SM-2 spaced repetition. Practice high-stakes speaking and social conversations with AI coaching. Free for the first 100 users — no credit card needed.",
  keywords: [
    "spaced repetition app",
    "vocabulary builder",
    "conversation practice app",
    "speaking confidence",
    "flashcard app",
    "SM-2 algorithm",
    "social skills training",
    "speak up practice",
    "Soro Soke",
    "AI language learning",
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    title: "Sọrọ Sọkẹ AI — Practice Vocabulary, Speaking & Conversation Skills",
    description:
      "Build vocabulary with spaced repetition. Practice high-stakes speaking and social conversations with AI feedback. Free for the first 100 users.",
    type: "website",
    url: "/",
    images: [{ url: "/dashboard.png", width: 1200, height: 630, alt: "Sọrọ Sọkẹ AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sọrọ Sọkẹ AI — Practice Vocabulary, Speaking & Conversation Skills",
    description:
      "Build vocabulary with spaced repetition. Practice high-stakes speaking and conversations with AI feedback.",
    images: ["/dashboard.png"],
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
