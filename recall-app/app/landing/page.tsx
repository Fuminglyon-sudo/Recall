import type { Metadata } from "next";
import { getCurrentUserId } from "@/lib/session";
import { LandingPage } from "@/components/landing-page";

export const metadata: Metadata = {
  title: "Recall — Spaced repetition for words, ideas, and language",
  description:
    "Recall is a calm flashcard app powered by spaced repetition (SM-2) and Claude AI. Build vocabulary, capture ideas, and review what matters — one card at a time.",
  openGraph: {
    title: "Recall — Spaced repetition for words, ideas, and language",
    description:
      "A calm place to keep words, ideas, and language close. Recall uses SM-2 spaced repetition and Claude AI to help you remember what matters.",
    type: "website",
  },
};

export default async function LandingRoute() {
  const userId = await getCurrentUserId();
  return <LandingPage isLoggedIn={!!userId} />;
}
