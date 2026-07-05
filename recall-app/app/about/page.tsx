import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SummonLogo } from "@/components/summon-logo";
import {
  BrainCircuit,
  ArrowLeft,
  Repeat2,
  Sparkles,
  Clock,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Mic,
  MessageCircle,
  Globe,
  BookOpen,
  CalendarCheck2,
  FileText,
  Bell,
} from "lucide-react";
import { LandingFaq } from "@/components/landing-faq";

export const metadata: Metadata = {
  title: "About Summon — Learn Words. Practice Using Them. Keep Both.",
  description:
    "Summon is a free communication-confidence tool: SM-2 spaced repetition builds vocabulary that sticks, Speak Up rehearses high-stakes career conversations, and Conversation Lab sharpens social fluency. Learn the word. Practice using it. Own it.",
  keywords: [
    "how Summon works",
    "spaced repetition algorithm",
    "SM-2",
    "Speak Up practice",
    "Conversation Lab",
    "vocabulary app comparison",
    "AI flashcards",
    "free spaced repetition",
  ],
  openGraph: {
    title: "About Summon — Spaced Repetition, Speak Up & Conversation Lab",
    description:
      "How Summon works: SM-2 spaced repetition, AI-drafted flashcards, high-stakes Speak Up scenarios, and Conversation Lab social practice. Free forever.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "About Summon",
    description:
      "How Summon works: SM-2 spaced repetition, AI-drafted flashcards, and Speak Up & Conversation Lab practice.",
  },
};

const COMPARISON_ROWS: [string, boolean, boolean, boolean, boolean][] = [
  ["SM-2 spaced repetition",    true,  true,  false, false],
  ["Summon-drafted cards",       true,  false, false, false],
  ["Free recall sessions",      true,  false, false, false],
  ["Clean, focused UI",         true,  false, true,  false],
  ["CSV export & import",       true,  true,  false, false],
  ["Push reminders",            true,  false, true,  false],
  ["Speak Up speaking practice",true,  false, false, false],
  ["Conversation Lab coaching", true,  false, false, false],
  ["Build your own vocabulary", true,  true,  false, true ],
  ["Free forever",              true,  true,  true,  true ],
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white antialiased">

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-white/8 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link href="/landing">
            <SummonLogo fontSize="1.9rem" />
          </Link>
          <Link href="/landing" className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section className="py-20 space-y-6 border-b border-white/8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">About Summon</p>
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
            Summon is for people who live in that space. Who are done letting the right words come
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

        {/* ── Why it exists ────────────────────────────────────────────────── */}
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
                Summon uses SM-2, the same algorithm behind Anki and SuperMemo, to schedule the
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

        {/* ── How it works ─────────────────────────────────────────────────── */}
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

        {/* ── Audacity / Core features ─────────────────────────────────────── */}
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
                Summon has three features built for exactly this.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: Mic,
                  label: "Speak Up",
                  href: "/speak-up",
                  tagline: "The room where you rehearse before the room that counts.",
                  body: "Pick a scenario: the raise conversation, a pitch, pushing back in a meeting. Set the pressure level. Speak your answer. Summon responds in character, then gives you honest feedback and a stronger version to try again.",
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

        {/* ── App screenshots gallery ──────────────────────────────────────── */}
        <section className="py-10 border-b border-white/8">
          <div className="grid gap-4 sm:grid-cols-3">
            {([
              { src: "/dashboard.png", alt: "Summon dashboard showing review streak, 30-day activity heatmap, and deck list with mastery progress", label: "Dashboard" },
              { src: "/speak_up_cards.png", alt: "Speak Up scenario picker with high-stakes practice categories including salary negotiation, pitching, and pushback", label: "Speak Up" },
              { src: "/conversation_lab.png", alt: "Conversation Lab social scenario picker with networking, dinner party, and flight conversation scenarios", label: "Conversation Lab" },
            ] as const).map(({ src, alt, label }) => (
              <div key={label} className="overflow-hidden rounded-2xl border border-white/10 shadow-lg shadow-black/30">
                <Image src={src} alt={alt} width={600} height={420} className="w-full h-auto" />
                <p className="border-t border-white/8 bg-slate-900/60 px-4 py-2.5 text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Feature deep-dives ───────────────────────────────────────────── */}
        <section id="features" className="py-20 border-b border-white/8 space-y-20">
          <div className="max-w-2xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Features</p>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Designed around how memory actually works</h2>
          </div>

          {/* ── Spaced repetition ── */}
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Spaced repetition</p>
              <h3 className="text-2xl font-extrabold text-white sm:text-3xl" style={{ textWrap: "balance" } as React.CSSProperties}>The SM-2 algorithm, quietly running in the background</h3>
              <p className="text-base leading-7 text-slate-400">SM-2 calculates the optimal interval between reviews based on how accurately you remembered each card. Cards drift from daily to weekly to monthly as they strengthen — shrinking your workload automatically over time.</p>
              <ul className="space-y-3">
                {["Automatic interval scheduling", "Per-card ease factor adjustment", "New, learning, familiar, and mastered levels", "Separate queue for new vs. due cards"].map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />{b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="hidden lg:block overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/40">
              <Image
                src="/today_card.png"
                alt="Summon review card showing a vocabulary word revealed with definition, memory hook, and 6 grading buttons"
                width={900}
                height={620}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* ── Smart drafting ── */}
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div className="hidden lg:block overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/40">
              <Image
                src="/cards_new.png"
                alt="Summon add card page showing AI-generated definition, memory hook, and example sentence for a word"
                width={900}
                height={620}
                className="w-full h-auto"
              />
            </div>
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Smart drafting</p>
              <h3 className="text-2xl font-extrabold text-white sm:text-3xl" style={{ textWrap: "balance" } as React.CSSProperties}>Stop staring at a blank card</h3>
              <p className="text-base leading-7 text-slate-400">Type a word or phrase. Summon drafts the definition, a memory hook, an example sentence, and synonyms in seconds. You edit anything you like — the card is yours. Creating a high-quality card takes thirty seconds instead of five minutes.</p>
              <ul className="space-y-3">
                {["One-click draft generation", "Definition, hook, example, and synonyms", "Edit freely before saving", "Works for any language or subject"].map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />{b}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Free recall ── */}
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Free recall</p>
              <h3 className="text-2xl font-extrabold text-white sm:text-3xl" style={{ textWrap: "balance" } as React.CSSProperties}>The most underused memory technique</h3>
              <p className="text-base leading-7 text-slate-400">Before seeing your cards, write down everything you remember from a deck without any cues. Free recall — retrieval practice without hints — is one of the highest-ROI techniques in cognitive science. Summon makes it a first-class part of your review, not an afterthought.</p>
              <ul className="space-y-3">
                {["Write-first, compare-second workflow", "No peeking enforced before you recall", "SM-2 grades update on submission", "Confirmation feedback after each session"].map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />{b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="hidden lg:block overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/40">
              <Image
                src="/deck_learning.png"
                alt="Summon decks page showing mastery progress bars across New, Learning, Familiar, and Mastered levels"
                width={900}
                height={620}
                className="w-full h-auto"
              />
            </div>
          </div>
        </section>

        {/* ── Everything else ───────────────────────────────────────────────── */}
        <section className="py-20 border-b border-white/8">
          <div className="space-y-10">
            <div className="max-w-2xl space-y-3">
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Everything else, without the noise</h2>
              <p className="text-slate-400">The features that make a practice sustainable.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: BookOpen,      title: "Personal decks",     body: "Organise cards by topic, language, or project. All decks feed into a single daily review queue." },
                { icon: CalendarCheck2, title: "Streak calendar",   body: "28-day review calendar. Small, consistent sessions matter more than long occasional ones." },
                { icon: FileText,      title: "CSV export & import", body: "Export any deck to CSV. Import cards in bulk. Your data is always portable." },
                { icon: Bell,          title: "Push reminders",     body: "Opt-in daily reminders so you never miss a review. Works on mobile and desktop." },
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="font-semibold text-white">{title}</p>
                  <p className="text-sm leading-6 text-slate-400">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Comparison table ─────────────────────────────────────────────── */}
        <section className="py-20 border-b border-white/8">
          <div className="space-y-10">
            <div className="max-w-2xl space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Comparison</p>
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl" style={{ textWrap: "balance" } as React.CSSProperties}>
                Built for people who want language that comes when they need it
              </h2>
              <p className="text-slate-400">
                Most tools ask you to manage the practice. Summon manages it for you — so you can just show up.
              </p>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04]">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-slate-400">
                      Feature
                    </th>
                    {["Summon", "Anki", "Duolingo", "Paper cards"].map((col, i) => (
                      <th
                        key={col}
                        className={`px-6 py-4 text-center text-xs font-semibold uppercase tracking-widest ${
                          i === 0 ? "text-emerald-300" : "text-slate-500"
                        }`}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/8">
                  {COMPARISON_ROWS.map(([feature, ...vals]) => (
                    <tr key={feature} className="transition hover:bg-white/[0.02]">
                      <td className="px-6 py-3.5 font-medium text-slate-200">{feature}</td>
                      {vals.map((v, i) => (
                        <td key={i} className="px-6 py-3.5 text-center">
                          {v ? (
                            <CheckCircle2
                              className={`mx-auto h-4 w-4 ${i === 0 ? "text-emerald-400" : "text-slate-500"}`}
                            />
                          ) : (
                            <XCircle className="mx-auto h-4 w-4 text-slate-800" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────────────── */}
        <section id="faq" className="py-20 border-b border-white/8">
          <div className="max-w-3xl space-y-10">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">FAQ</p>
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Common questions</h2>
            </div>
            <LandingFaq />
          </div>
        </section>

        {/* ── What we believe ──────────────────────────────────────────────── */}
        <section className="py-20 border-b border-white/8">
          <div className="space-y-10">
            <div className="max-w-xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Principles</p>
              <h2 className="text-2xl font-extrabold text-white">What we believe</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              {[
                { icon: Repeat2,      title: "Science over streaks",  body: "SM-2 scheduling is more effective than gamification. We track your streak because consistency matters, not because it should be a game." },
                { icon: Sparkles,     title: "Summon assists, you decide", body: "Summon drafts a definition. You edit it before it becomes a card. Your memory, your words, your learning." },
                { icon: BrainCircuit, title: "Calm by design",         body: "No social features, no leaderboards, no engagement tricks. Summon is a tool, not an app trying to own your attention." },
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

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <section className="py-20">
          <div className="rounded-3xl border border-emerald-400/15 bg-gradient-to-br from-emerald-950/50 via-slate-900/60 to-slate-950 p-12 text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/8 px-4 py-1.5 text-xs font-medium text-emerald-300">
              Free while in beta · Pro tier coming
            </div>
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl" style={{ textWrap: "balance" } as React.CSSProperties}>
              The words you reach for — finally within reach
            </h2>
            <p className="text-slate-400">Free to use during beta. All features included — no card, no trial period, no limits.</p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-7 py-3.5 text-base font-bold text-slate-950 transition hover:bg-emerald-300"
            >
              Get started free
            </Link>
            <p className="text-xs text-slate-600">Early users get grandfathered pricing when Pro launches.</p>
          </div>
        </section>

      </main>

      <footer className="border-t border-white/8 py-8 text-center text-xs text-slate-700">
        © {new Date().getFullYear()} Summon.{" "}
        <Link href="/landing" className="hover:text-slate-400 transition">Home</Link>
        {" · "}
        <Link href="/guide" className="hover:text-slate-400 transition">Guide</Link>
        {" · "}
        <Link href="/contact" className="hover:text-slate-400 transition">Contact</Link>
      </footer>
    </div>
  );
}
