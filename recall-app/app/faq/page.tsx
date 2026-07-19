import type { Metadata } from "next";
import Link from "next/link";
import { MarketingNav } from "@/components/marketing-nav";
import { LandingFaq } from "@/components/landing-faq";
import { MarketingFooter } from "@/components/marketing-footer";

export const metadata: Metadata = {
  title: { absolute: "FAQ — Sọrọ Sọkẹ AI" },
  description:
    "Answers to common questions about Sọrọ Sọkẹ AI: how spaced repetition works, what's included, pricing, privacy, grading, streaks, and what's coming next.",
  keywords: [
    "spaced repetition FAQ",
    "how does SM-2 work",
    "Soro Soke FAQ",
    "flashcard app questions",
    "vocabulary app help",
    "Speak Up practice questions",
    "Conversation Lab FAQ",
    "Debate Lab FAQ",
    "debate practice questions",
    "AI debate coach",
    "social anxiety app",
    "confidence building app",
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQ — Sọrọ Sọkẹ AI",
    description: "Everything you want to know about how Sọrọ Sọkẹ AI works — spaced repetition, card drafting, Speak Up, Conversation Lab, and more.",
    type: "website",
    url: "/faq",
  },
  twitter: {
    card: "summary",
    title: "FAQ — Sọrọ Sọkẹ AI",
    description: "Common questions about spaced repetition, Speak Up, Conversation Lab, and pricing.",
  },
};

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white antialiased flex flex-col">
      <MarketingNav />

      <main className="mx-auto max-w-3xl flex-1 px-6 py-20 space-y-12">
        <section className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">FAQ</p>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Common questions</h1>
          <p className="text-slate-400 max-w-xl">
            Everything you want to know about how Soro Soke works. If your question isn&apos;t here,{" "}
            <Link href="/contact" className="text-emerald-400 hover:text-emerald-300 transition">get in touch</Link>.
          </p>
        </section>

        <LandingFaq />

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center space-y-4">
          <p className="text-sm font-semibold text-white">Still have a question?</p>
          <p className="text-sm text-slate-400">We read every message.</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-6 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
          >
            Contact us
          </Link>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
