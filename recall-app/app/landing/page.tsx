import type { Metadata } from "next";
import { getCurrentUserId, ADMIN_USER_ID } from "@/lib/session";
import { auth } from "@/lib/next-auth";
import { LandingPage } from "@/components/landing-page";

// Exported (not just used locally) so app/page.tsx's generateMetadata can
// reuse it for logged-out visitors at "/" — the root and /landing render
// the same marketing content, so they should carry the same metadata
// rather than drifting out of sync.
export const landingMetadata: Metadata = {
  // { absolute } bypasses the root layout's title.template ("%s | Sọrọ Sọkẹ
  // AI") — a plain string here would render as "...Vocabulary | Sọrọ Sọkẹ AI",
  // duplicating the brand name in every browser tab and search result.
  title: { absolute: "Sọrọ Sọkẹ AI — Practice Speaking, Debate, Conversation & Vocabulary" },
  description:
    "Practice high-stakes speaking, ease social anxiety in conversation, and build reasoning confidence in real-world debate with AI coaching — backed by SM-2 spaced repetition so the vocabulary actually sticks. Free for the first 50 users — no credit card needed.",
  keywords: [
    "speaking confidence",
    "conversation practice app",
    "debate practice app",
    "social skills training",
    "speak up practice",
    "Debate Lab",
    "argument practice",
    "reasoning skills",
    "social anxiety app",
    "confidence building app",
    "overcome social anxiety",
    "spaced repetition app",
    "vocabulary builder",
    "flashcard app",
    "SM-2 algorithm",
    "Soro Soke",
    "AI language learning",
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    title: "Sọrọ Sọkẹ AI — Practice Speaking, Debate, Conversation & Vocabulary",
    description:
      "Practice high-stakes speaking, ease social anxiety in conversation, and build confidence in real-world debate with AI feedback — vocabulary sticks because of spaced repetition underneath. Free for the first 50 users.",
    type: "website",
    url: "/",
    // Share image comes from app/opengraph-image.tsx (a purpose-built
    // card, not a screenshot) — omitting `images` here lets it inherit.
  },
  twitter: {
    card: "summary_large_image",
    title: "Sọrọ Sọkẹ AI — Practice Speaking, Debate, Conversation & Vocabulary",
    description:
      "Practice speaking, conversation, and debate with AI feedback — vocabulary sticks because of spaced repetition underneath.",
  },
};

export const metadata: Metadata = landingMetadata;

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
