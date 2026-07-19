import type { Metadata } from "next";
import { getCurrentUserId, ADMIN_USER_ID } from "@/lib/session";
import { auth } from "@/lib/next-auth";
import { LandingPage } from "@/components/landing-page";

export const metadata: Metadata = {
  title: "Sọrọ Sọkẹ AI — Practice Vocabulary, Speaking, Conversation & Debate Skills",
  description:
    "Build lasting vocabulary with SM-2 spaced repetition. Practice high-stakes speaking, ease social anxiety in conversation, and build reasoning confidence in real-world debate with AI coaching. Free for the first 50 users — no credit card needed.",
  keywords: [
    "spaced repetition app",
    "vocabulary builder",
    "conversation practice app",
    "speaking confidence",
    "flashcard app",
    "SM-2 algorithm",
    "social skills training",
    "speak up practice",
    "Debate Lab",
    "debate practice app",
    "argument practice",
    "reasoning skills",
    "social anxiety app",
    "confidence building app",
    "overcome social anxiety",
    "Soro Soke",
    "AI language learning",
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    title: "Sọrọ Sọkẹ AI — Practice Vocabulary, Speaking, Conversation & Debate Skills",
    description:
      "Build vocabulary with spaced repetition. Practice high-stakes speaking, ease social anxiety in conversation, and build confidence in real-world debate with AI feedback. Free for the first 50 users.",
    type: "website",
    url: "/",
    // Share image comes from app/opengraph-image.tsx (a purpose-built
    // card, not a screenshot) — omitting `images` here lets it inherit.
  },
  twitter: {
    card: "summary_large_image",
    title: "Sọrọ Sọkẹ AI — Practice Vocabulary, Speaking, Conversation & Debate Skills",
    description:
      "Build vocabulary with spaced repetition. Practice speaking, conversation, and debate with AI feedback.",
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
