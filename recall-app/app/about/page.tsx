import type { Metadata } from "next";
import Link from "next/link";
import { MarketingNav } from "@/components/marketing-nav";
import { MarketingFooter } from "@/components/marketing-footer";
import {
  BrainCircuit,
  Repeat2,
  Sparkles,
  Clock,
  TrendingUp,
  Mic,
  MessageCircle,
  Globe,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Sọrọ Sọkẹ AI — Learn Words. Practice Using Them. Keep Both.",
  description:
    "Sọrọ Sọkẹ AI is a communication-confidence tool: SM-2 spaced repetition builds vocabulary that sticks, Speak Up rehearses high-stakes career conversations, Conversation Lab eases social anxiety, and Debate Lab builds reasoning confidence. Learn the word. Practice using it. Own it.",
  keywords: [
    "how Soro Soke works",
    "spaced repetition algorithm",
    "SM-2",
    "Speak Up practice",
    "Conversation Lab",
    "Debate Lab",
    "vocabulary app",
    "AI flashcards",
    "spaced repetition app",
    "communication confidence",
    "social anxiety app",
    "confidence building app",
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Sọrọ Sọkẹ AI — Spaced Repetition, Speak Up, Conversation & Debate Lab",
    description:
      "How Sọrọ Sọkẹ AI works: SM-2 spaced repetition, AI-drafted flashcards, high-stakes Speak Up scenarios, Conversation Lab social-anxiety practice, and Debate Lab reasoning practice.",
    type: "website",
    url: "/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Sọrọ Sọkẹ AI",
    description:
      "SM-2 spaced repetition, AI-drafted flashcards, and Speak Up, Conversation Lab & Debate Lab practice for confidence and social anxiety — all in one app.",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white antialiased flex flex-col">
      <MarketingNav />

      <main className="mx-auto max-w-5xl flex-1 px-6">

        {/* ── Hero ── */}
        <section className="py-20 space-y-6 border-b border-white/8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">About Soro Soke</p>
          <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl" style={{ textWrap: "balance" } as React.CSSProperties}>
            For everyone who has felt perfectly understood in their own head —
            and perfectly lost the moment the words needed to come out.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-400">
            There is a particular silence — the one that arrives at exactly the wrong moment. When you
            know exactly what you feel, but the word won&apos;t surface. When a conversation ends and you
            find, walking home, the sentence you should have said.
          </p>
          <p className="max-w-2xl text-lg leading-8 text-slate-400">
            Soro Soke is for people who live in that space. Who are done letting the right words come
            too late — and want to build, quietly and without pressure, the vocabulary and presence
            that makes them feel at home in any room, any conversation, any moment that matters.
          </p>
          <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-300">
            <span className="text-emerald-300 font-medium">Learn the word.</span>
            <span className="text-slate-600">→</span>
            <span className="text-emerald-300 font-medium">Practice using it.</span>
            <span className="text-slate-600">→</span>
            <span className="text-emerald-300 font-medium">Own it.</span>
          </div>
        </section>

        {/* ── Why it exists ── */}
        <section className="py-20 border-b border-white/8">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-start">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">The problem</p>
              <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl" style={{ textWrap: "balance" } as React.CSSProperties}>
                You&apos;re learning words.<br />
                But you&apos;re not <em className="not-italic text-emerald-300">keeping</em> them.
              </h2>
              <p className="text-base leading-7 text-slate-400">
                The forgetting curve is steep. Without a structured review system, most of what you
                read disappears within days. Highlighting, re-reading, and random flashcards don&apos;t
                fight it efficiently — they just feel productive.
              </p>
              <p className="text-base leading-7 text-slate-400">
                Soro Soke uses SM-2, the same algorithm behind Anki and SuperMemo, to schedule the
                right card at the right time. You spend less time reviewing and remember more.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Clock,        title: "5-minute sessions",            body: "Only due cards surface each day. No wading through a full deck." },
                { icon: TrendingUp,   title: "Intervals compound",           body: "Cards you know get longer gaps. You never review what's already solid." },
                { icon: BrainCircuit, title: "Free recall",                  body: "Write what you remember before you flip. The single highest-ROI review technique." },
                { icon: Sparkles,     title: "Claude writes the first draft", body: "Type a word. Claude fills definition, hook, and example. You own it." },
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs leading-5 text-slate-400">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section id="how-it-works" className="py-20 border-b border-white/8">
          <div className="space-y-12">
            <div className="max-w-2xl space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">How it works</p>
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Capture. Review. Practice.</h2>
              <p className="text-slate-400">
                Three things, done consistently, that compound into language you can actually use.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                {
                  n: "01",
                  title: "Capture",
                  body: "Something stands out — a word, a concept, an idea. Type the front, let Claude draft the definition, example, and memory hook in seconds.",
                },
                {
                  n: "02",
                  title: "Review",
                  body: "Each day, your queue shows exactly what's due. Grade how well you remembered each card. Cards you know drift farther away. Ones you struggle with return sooner.",
                },
                {
                  n: "03",
                  title: "Practice",
                  body: "Speak Up puts you in high-stakes scenarios. Conversation Lab drops you into real social moments. Words you can use under pressure are words you actually own.",
                },
              ].map(({ n, title, body }) => (
                <div key={n} className="relative space-y-5 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8">
                  <span className="absolute -right-2 -top-4 select-none text-7xl font-black text-white/[0.05]">{n}</span>
                  <p className="relative text-xs font-bold uppercase tracking-widest text-emerald-400">{n}</p>
                  <p className="text-xl font-bold text-white">{title}</p>
                  <p className="text-sm leading-6 text-slate-400">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Explore more ── */}
        <section className="py-12 border-b border-white/8">
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/features"
              className="group flex items-start justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-emerald-400/30 hover:bg-white/8"
            >
              <div className="space-y-1.5">
                <p className="text-sm font-bold text-white">Features</p>
                <p className="text-xs leading-5 text-slate-400">
                  Spaced repetition, smart drafting, free recall — how each piece works and why it matters.
                </p>
              </div>
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-600 transition group-hover:text-emerald-400" />
            </Link>
            <Link
              href="/faq"
              className="group flex items-start justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-emerald-400/30 hover:bg-white/8"
            >
              <div className="space-y-1.5">
                <p className="text-sm font-bold text-white">FAQ</p>
                <p className="text-xs leading-5 text-slate-400">
                  Common questions about how Soro Soke works, what&apos;s included, and what&apos;s coming.
                </p>
              </div>
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-600 transition group-hover:text-emerald-400" />
            </Link>
          </div>
        </section>

        {/* ── Audacity / Core features ── */}
        <section className="py-20 border-b border-white/8">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-start">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">The opportunity cost</p>
              <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl" style={{ textWrap: "balance" } as React.CSSProperties}>
                The world rewards the ones<br className="hidden sm:block" /> who speak up.
              </h2>
              <p className="text-base leading-7 text-slate-400">
                Think of the last time an opportunity walked past you.
              </p>
              <p className="text-base leading-7 text-slate-400">
                The promotion that went to someone with less experience but more confidence. The
                connection you wanted to make but never approached. The networking event where
                someone extended a hand — and you had nothing to say beyond hello, and the moment passed.
              </p>
              <p className="text-base leading-7 text-slate-400">
                The world is not always fair. But it consistently rewards the ones who know what
                to say, who can hold their position under pressure, and who can find something
                real in common with anyone they meet.
              </p>
              <p className="text-base leading-7 text-slate-300">
                Audacity is not a personality trait. It is a practice.
                Soro Soke has three features built for exactly this.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: Mic,
                  label: "Speak Up",
                  href: "/speak-up",
                  tagline: "The room where you rehearse before the room that counts.",
                  body: "Pick a scenario: the raise conversation, a pitch, pushing back in a meeting. Set the pressure level. Speak your answer. Soro Soke responds in character, then gives you honest feedback and a stronger version to try again.",
                },
                {
                  icon: MessageCircle,
                  label: "Conversation Lab",
                  href: "/conversation-lab",
                  tagline: "Become someone conversations come easily to.",
                  body: "Ten real social scenarios — networking mixers, dinner parties, long-haul flights. Pick your character type. Open the conversation yourself, no guided prompts. Get coaching on your opener and one move to try next time.",
                },
                {
                  icon: Globe,
                  label: "Countries",
                  href: "/countries",
                  tagline: "Know something real about where people are from.",
                  body: "The capital. The greeting in their language. Something that makes their country distinct. Walk into any room in the world with something genuine to say.",
                },
              ].map(({ icon: Icon, label, href, tagline, body }) => (
                <Link
                  key={label}
                  href={href}
                  className="group flex gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-emerald-400/30 hover:bg-white/8"
                >
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-sm font-bold text-white">{label}</p>
                    <p className="text-xs font-medium text-emerald-300/80">{tagline}</p>
                    <p className="text-xs leading-5 text-slate-400">{body}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── What we believe ── */}
        <section className="py-20 border-b border-white/8">
          <div className="space-y-10">
            <div className="max-w-xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Principles</p>
              <h2 className="text-2xl font-extrabold text-white">What we believe</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              {[
                { icon: Repeat2,      title: "Science over streaks",       body: "SM-2 scheduling is more effective than gamification. We track your streak because consistency matters, not because it should be a game." },
                { icon: Sparkles,     title: "Soro Soke assists, you decide", body: "Soro Soke drafts a definition. You edit it before it becomes a card. Your memory, your words, your learning." },
                { icon: BrainCircuit, title: "Calm by design",             body: "No social features, no leaderboards, no engagement tricks. Soro Soke is a tool, not an app trying to own your attention." },
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="font-semibold text-white">{title}</p>
                  <p className="text-sm leading-6 text-slate-400">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20">
          <div className="rounded-3xl border border-emerald-400/15 bg-gradient-to-br from-emerald-950/50 via-slate-900/60 to-slate-950 p-12 text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/8 px-4 py-1.5 text-xs font-medium text-emerald-300">
              First 50 spots free forever · Then $9.99/mo
            </div>
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl" style={{ textWrap: "balance" } as React.CSSProperties}>
              The words you reach for — finally within reach
            </h2>
            <p className="text-slate-400">Claim one of the remaining founder spots and get every feature free — forever. After 100, it&apos;s $9.99/mo.</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-7 py-3.5 text-base font-bold text-slate-950 transition hover:bg-emerald-300"
              >
                Claim your free spot
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-white/8"
              >
                See pricing
              </Link>
            </div>
            <p className="text-xs text-slate-600">No credit card required · Spots are first-come, first-served</p>
          </div>
        </section>

      </main>

      <MarketingFooter />
    </div>
  );
}
