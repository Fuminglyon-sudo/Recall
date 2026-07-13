"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Zap, Crown, ArrowRight } from "lucide-react";
import { MarketingNav } from "@/components/marketing-nav";
import { MarketingFooter } from "@/components/marketing-footer";

const FOUNDER_SPOTS_TOTAL = 100;
const FOUNDER_SPOTS_TAKEN = 47; // update this manually as spots fill

const FOUNDER_FEATURES = [
  "Unlimited flashcard decks & cards",
  "AI-drafted definitions, hooks & examples",
  "SM-2 spaced repetition — full algorithm",
  "Daily Review queue, streak calendar",
  "Speak Up — unlimited high-stakes scenarios",
  "Conversation Lab — unlimited social practice",
  "Countries — world knowledge at your fingertips",
  "CSV export & import",
  "Push reminders",
  "All future Pro features — grandfathered in",
  "Priority support",
];

const PRO_FEATURES = [
  "Unlimited flashcard decks & cards",
  "AI-drafted definitions, hooks & examples",
  "SM-2 spaced repetition — full algorithm",
  "Daily Review queue, streak calendar",
  "Speak Up — unlimited high-stakes scenarios",
  "Conversation Lab — unlimited social practice",
  "Countries — world knowledge at your fingertips",
  "CSV export & import",
  "Push reminders",
  "Priority support",
];

const PRICING_FAQ = [
  {
    q: "What happens after the 100 founder spots are gone?",
    a: "New sign-ups move to the Pro plan at $9.99/month or $99/year. The founders who claimed their spot keep it free — forever, regardless of what Pro grows to include.",
  },
  {
    q: "Is there a free trial for Pro?",
    a: "Yes. Every new account gets 14 days of full Pro access, no card required. After the trial, you choose to subscribe or your account pauses.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from your account settings and you keep access until the end of your billing period. No questions, no friction.",
  },
  {
    q: "What does 'grandfathered in' mean?",
    a: "Founders get every feature that ships in the future — including any features we add to the Pro tier later — at no extra cost, as long as the account stays active.",
  },
  {
    q: "Will there be a Lifetime plan?",
    a: "We're considering a one-time Lifetime deal for a future launch. If you're interested, get on the list by contacting us — we'll notify Lifetime candidates first.",
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);
  const spotsLeft = FOUNDER_SPOTS_TOTAL - FOUNDER_SPOTS_TAKEN;
  const pct = (FOUNDER_SPOTS_TAKEN / FOUNDER_SPOTS_TOTAL) * 100;

  return (
    <div className="min-h-screen bg-slate-950 text-white antialiased flex flex-col">
      <MarketingNav />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6">

        {/* ── Hero ── */}
        <section className="py-20 text-center space-y-4 border-b border-white/8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Pricing</p>
          <h1
            className="text-4xl font-extrabold sm:text-5xl"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            Honest pricing.{" "}
            <span style={{ fontStyle: "italic", fontWeight: 400, color: "#86efac" }}>
              Early access included.
            </span>
          </h1>
          <p className="mx-auto max-w-xl text-lg leading-8 text-slate-400">
            The first 100 people to join get Soro Soke free — forever.
            After that, full access is $9.99/month or $99/year.
          </p>
        </section>

        {/* ── Billing toggle ── */}
        <div className="py-10 flex justify-center">
          <div
            className="inline-flex rounded-2xl p-1"
            style={{ border: "1px solid var(--stroke-m)", background: "var(--surface-1)" }}
          >
            <button
              onClick={() => setAnnual(false)}
              className="rounded-xl px-5 py-2 text-sm font-semibold transition"
              style={{
                background: !annual ? "var(--surface-4)" : "transparent",
                color: !annual ? "var(--foreground)" : "color-mix(in oklab, var(--foreground) 50%, transparent)",
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className="flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold transition"
              style={{
                background: annual ? "var(--surface-4)" : "transparent",
                color: annual ? "var(--foreground)" : "color-mix(in oklab, var(--foreground) 50%, transparent)",
              }}
            >
              Annual
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  padding: "0.15em 0.5em",
                  borderRadius: "9999px",
                  background: "rgba(52,211,153,0.15)",
                  color: "#6ee7b7",
                  border: "1px solid rgba(52,211,153,0.25)",
                }}
              >
                SAVE 17%
              </span>
            </button>
          </div>
        </div>

        {/* ── Pricing cards ── */}
        <div className="grid gap-6 lg:grid-cols-2 pb-20">

          {/* Founder card */}
          <div
            className="relative flex flex-col rounded-3xl p-8 space-y-6"
            style={{
              border: "1px solid rgba(52,211,153,0.35)",
              background: "linear-gradient(135deg, rgba(6,78,59,0.25) 0%, rgba(2,44,34,0.18) 50%, rgba(1,13,26,0.55) 100%)",
              boxShadow: "0 0 60px rgba(52,211,153,0.08), inset 0 1px 0 rgba(52,211,153,0.15)",
            }}
          >
            {/* Badge */}
            <div className="flex items-center justify-between">
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4em",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#6ee7b7",
                  border: "1px solid rgba(52,211,153,0.3)",
                  borderRadius: "9999px",
                  padding: "0.3em 0.75em",
                  background: "rgba(52,211,153,0.08)",
                }}
              >
                <Crown className="h-3 w-3" />
                Founder — {spotsLeft} of {FOUNDER_SPOTS_TOTAL} spots left
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-2xl font-extrabold text-white">Free</p>
              <p className="text-sm text-slate-400">Forever — no card, no trial, no expiry</p>
            </div>

            {/* Claim bar */}
            <div className="space-y-1.5">
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    background: "linear-gradient(90deg, #10b981, #34d399)",
                    transition: "width 0.6s ease",
                  }}
                />
              </div>
              <p className="text-xs text-slate-500">{FOUNDER_SPOTS_TAKEN} of {FOUNDER_SPOTS_TOTAL} spots claimed</p>
            </div>

            <ul className="flex-1 space-y-2.5">
              {FOUNDER_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/login"
              className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-6 py-3.5 text-base font-bold text-slate-950 transition hover:bg-emerald-300"
              style={{ boxShadow: "0 0 30px rgba(74,222,128,0.2)" }}
            >
              Claim your spot <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="text-center text-xs text-slate-600">
              No credit card required · Spots are first-come, first-served
            </p>
          </div>

          {/* Pro card */}
          <div
            className="relative flex flex-col rounded-3xl p-8 space-y-6"
            style={{
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            <div className="flex items-center justify-between">
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4em",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#94a3b8",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "9999px",
                  padding: "0.3em 0.75em",
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                <Zap className="h-3 w-3" />
                Pro
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-end gap-2">
                <p className="text-2xl font-extrabold text-white">
                  {annual ? "$99" : "$9.99"}
                </p>
                <p className="text-sm text-slate-400 mb-0.5">
                  {annual ? "/ year" : "/ month"}
                </p>
              </div>
              <p className="text-sm text-slate-400">
                {annual
                  ? "Billed annually · equivalent to $8.25/mo"
                  : "Billed monthly · or save 17% with annual"}
              </p>
            </div>

            {/* Trial note */}
            <div
              className="rounded-xl p-3"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <p className="text-xs text-slate-400">
                <span className="text-white font-semibold">14-day free trial</span> — full access, no card required.
                Start today and subscribe only if you love it.
              </p>
            </div>

            <ul className="flex-1 space-y-2.5">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/login"
              className="flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-base font-bold text-white transition"
              style={{
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.07)",
              }}
            >
              Start free trial <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="text-center text-xs text-slate-600">
              Cancel anytime · No questions asked
            </p>
          </div>
        </div>

        {/* ── Founder urgency bar ── */}
        <section className="py-12 border-t border-white/8">
          <div
            className="rounded-3xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            style={{
              border: "1px solid rgba(52,211,153,0.2)",
              background: "rgba(6,78,59,0.12)",
            }}
          >
            <div className="space-y-1">
              <p className="font-bold text-white">
                Only {spotsLeft} founder spots remaining
              </p>
              <p className="text-sm text-slate-400">
                After these fill, the free tier closes permanently. Once it&apos;s gone, it&apos;s gone.
              </p>
            </div>
            <Link
              href="/login"
              className="shrink-0 inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
            >
              Claim a spot now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-16 border-t border-white/8 space-y-10">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">FAQ</p>
            <h2 className="text-2xl font-extrabold text-white">Pricing questions</h2>
          </div>
          <div className="space-y-6 max-w-2xl">
            {PRICING_FAQ.map(({ q, a }) => (
              <div key={q} className="space-y-2">
                <p className="font-semibold text-white">{q}</p>
                <p className="text-sm leading-7 text-slate-400">{a}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      <MarketingFooter />
    </div>
  );
}
