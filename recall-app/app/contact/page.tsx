import type { Metadata } from "next";
import Link from "next/link";
import { SoroSokeLogo } from "@/components/soro-soke-logo";
import { SoroSokeMark } from "@/components/soro-soke-mark";
import { MarketingFooter } from "@/components/marketing-footer";
import { ArrowLeft, Mail, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: { absolute: "Contact — Sọrọ Sọkẹ AI" },
  description:
    "Have a question about Soro Soke, spaced repetition, building confidence, or how the app works? Reach out to the team — we'd love to hear from you.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white antialiased">
      {/* Nav */}
      <header className="border-b border-white/8 bg-slate-950/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link href="/landing" className="flex items-center gap-2">
            <SoroSokeMark size={30} className="shrink-0" />
            <SoroSokeLogo fontSize="1.9rem" />
          </Link>
          <Link href="/landing" className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-20 space-y-12">
        <section className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Contact</p>
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">Get in touch</h1>
          <p className="text-lg leading-7 text-slate-400">
            Questions, feedback, bug reports, or just want to say something — we read everything.
          </p>
        </section>

        <div className="grid gap-5 sm:grid-cols-2">
          <a
            href="mailto:japareality@fuminglyonnetwork.com"
            className="group flex items-start gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-emerald-400/30 hover:bg-white/8"
          >
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
              <Mail className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-white">Email us</p>
              <p className="text-sm text-slate-400 group-hover:text-slate-300 transition break-all">
                japareality@fuminglyonnetwork.com
              </p>
            </div>
          </a>

          <div className="flex items-start gap-4 rounded-3xl border border-dashed border-white/15 bg-white/[0.025] p-6">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-slate-500">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-slate-400">Live chat</p>
              <p className="text-sm text-slate-600">Coming soon</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.025] p-8 space-y-3">
          <p className="text-sm font-medium text-slate-400">Response time</p>
          <p className="text-xs leading-6 text-slate-600">
            We aim to respond within 1–2 business days. For bug reports, include your browser, the page
            you were on, and what you expected to happen vs. what actually happened.
          </p>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
