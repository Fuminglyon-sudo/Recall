import Link from "next/link";
import {
  BrainCircuit,
  Repeat2,
  Sparkles,
  BookOpen,
  CalendarCheck2,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Zap,
  FileText,
  Bell,
} from "lucide-react";
import { LandingUserMenu } from "./landing-user-menu";
import { LandingFaq } from "./landing-faq";

interface LandingPageProps {
  isLoggedIn?: boolean;
  userName?: string | null;
}

const COMPARISON_ROWS: [string, boolean, boolean, boolean, boolean][] = [
  ["SM-2 spaced repetition",    true,  true,  false, false],
  ["AI-drafted card content",   true,  false, false, false],
  ["Free recall sessions",      true,  false, false, false],
  ["Clean, focused UI",         true,  false, true,  false],
  ["CSV export & import",       true,  true,  false, false],
  ["Push reminders",            true,  false, true,  false],
  ["Build your own vocabulary", true,  true,  false, true ],
  ["Free forever",              true,  true,  true,  true ],
];

export function LandingPage({ isLoggedIn = false, userName }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white antialiased">

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/8 bg-slate-950/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/landing" className="flex items-center gap-2.5">
            <div className="rounded-xl bg-emerald-400/15 p-2 text-emerald-300">
              <BrainCircuit className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold tracking-tight text-white">Recall</span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm text-slate-400 md:flex">
            <Link href="#how-it-works" className="transition hover:text-white">How it works</Link>
            <Link href="#features" className="transition hover:text-white">Features</Link>
            <Link href="#faq" className="transition hover:text-white">FAQ</Link>
            <Link href="/about" className="transition hover:text-white">About</Link>
            <Link href="/contact" className="transition hover:text-white">Contact</Link>
          </nav>

          {isLoggedIn ? (
            <LandingUserMenu userName={userName} />
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden text-sm text-slate-400 transition hover:text-white sm:block">
                Sign in
              </Link>
              <Link
                href="/login"
                className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
              >
                Get started free
              </Link>
            </div>
          )}
        </div>
      </header>

      <main>
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pb-24 pt-40">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-[-80px] h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[140px]" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
          </div>

          <div className="mx-auto max-w-6xl px-6 text-center">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-300">
              <Zap className="h-3 w-3" />
              SM-2 spaced repetition · Claude AI · Free
            </div>

            <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-[72px] lg:leading-[1.08]">
              The smarter way to build{" "}
              <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                vocabulary that sticks
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-400">
              Recall uses proven spaced repetition science and Claude AI to help you capture words,
              concepts, and ideas — then tells you exactly what to review and when.
              Short sessions, lasting results.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              {isLoggedIn ? (
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-7 py-3.5 text-base font-bold text-slate-950 shadow-lg shadow-emerald-400/20 transition hover:bg-emerald-300 hover:shadow-emerald-300/30"
                >
                  Go to your dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-7 py-3.5 text-base font-bold text-slate-950 shadow-lg shadow-emerald-400/20 transition hover:bg-emerald-300 hover:shadow-emerald-300/30"
                  >
                    Start for free
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="#how-it-works"
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/12 bg-white/5 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-white/10"
                  >
                    See how it works
                  </Link>
                </>
              )}
            </div>

            <div className="mx-auto mt-16 grid max-w-xl grid-cols-3 gap-6 border-t border-white/8 pt-10">
              {[
                { value: "SM-2", label: "Proven algorithm" },
                { value: "AI",   label: "Claude-powered" },
                { value: "Free", label: "No card required" },
              ].map(({ value, label }) => (
                <div key={label} className="space-y-1">
                  <p className="text-3xl font-black text-white">{value}</p>
                  <p className="text-xs text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Feature strip ─────────────────────────────────────────────────── */}
        <div className="border-y border-white/8 bg-white/[0.025] py-5">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-400">
              {[
                "SM-2 spaced repetition",
                "AI-drafted cards",
                "Free recall sessions",
                "Daily streak tracking",
                "CSV export & import",
                "Push reminders",
                "Mastery progress view",
              ].map((f) => (
                <span key={f} className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Problem / Why ─────────────────────────────────────────────────── */}
        <section className="py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
              <div className="space-y-7">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">The problem</p>
                <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                  You're learning words.<br />
                  But you're not <em className="not-italic text-emerald-300">keeping</em> them.
                </h2>
                <p className="text-base leading-7 text-slate-400">
                  The forgetting curve is steep. Without a structured review system, most of what you
                  read disappears within days. Highlighting, re-reading, and random flashcards don't
                  fight it efficiently — they just feel productive.
                </p>
                <p className="text-base leading-7 text-slate-400">
                  Recall uses SM-2, the same algorithm behind Anki and SuperMemo, to schedule the
                  right card at the right time. You spend less time reviewing and remember more.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Clock,       title: "5-minute sessions",         body: "Only due cards surface each day. No wading through a full deck." },
                  { icon: TrendingUp,  title: "Intervals compound",        body: "Cards you know get longer gaps. You never review what's already solid." },
                  { icon: BrainCircuit, title: "Free recall",              body: "Write what you remember before you flip. The single highest-ROI review technique." },
                  { icon: Sparkles,    title: "Claude writes the first draft", body: "Type a word. Claude fills definition, hook, and example. You own it." },
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
          </div>
        </section>

        {/* ── How it works ──────────────────────────────────────────────────── */}
        <section id="how-it-works" className="scroll-mt-20 border-t border-white/8 bg-white/[0.02] py-28">
          <div className="mx-auto max-w-6xl space-y-16 px-6">
            <div className="mx-auto max-w-2xl space-y-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">How it works</p>
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Three steps. Daily habit.</h2>
              <p className="text-slate-400">
                Recall is designed to fit inside two minutes of your day. Most users review before their first coffee.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { n: "01", title: "Capture", body: "Something stands out — a word, a concept, an idea. Open Recall, type the front, and let Claude draft the back in seconds." },
                { n: "02", title: "Review", body: "Each day, Recall shows exactly what's due. Grade how well you remembered each card. Done in minutes." },
                { n: "03", title: "Compound", body: "Cards you know earn longer gaps. Ones you forget come back sooner. Your retention compounds over weeks and months." },
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

        {/* ── Feature deep-dives ────────────────────────────────────────────── */}
        <section id="features" className="scroll-mt-20 py-28 space-y-32">
          {([
            {
              label: "Spaced repetition",
              title: "Designed around how memory actually works",
              body: "The SM-2 algorithm calculates the optimal interval between reviews based on how accurately you remembered each card. Cards drift from daily to weekly to monthly as they strengthen — shrinking your workload automatically over time. New cards are introduced gradually so you never feel overwhelmed.",
              icon: Repeat2,
              bullets: [
                "Automatic interval scheduling",
                "Per-card ease factor adjustment",
                "New, learning, familiar, and mastered levels",
                "Separate queue for new vs. due cards",
              ],
            },
            {
              label: "AI assistance",
              title: "Stop staring at a blank card",
              body: "Type a word or phrase. Claude drafts the definition, a memory hook, an example sentence, and simple synonyms in seconds. You edit anything you like — the card is yours. Creating a high-quality card takes thirty seconds instead of five minutes.",
              icon: Sparkles,
              bullets: [
                "One-click draft generation",
                "Definition, hook, example, and synonyms",
                "Edit freely before saving",
                "Works for any language or subject",
              ],
            },
            {
              label: "Free recall",
              title: "The most underused memory technique",
              body: "Before seeing your cards, write down everything you remember from a deck without any cues. Free recall — retrieval practice without hints — is one of the highest-ROI techniques in cognitive science. Recall makes it a first-class part of your review, not an afterthought.",
              icon: BrainCircuit,
              bullets: [
                "Write-first, compare-second workflow",
                "No peeking enforced before you recall",
                "SM-2 grades update on submission",
                "Confirmation feedback after each session",
              ],
            },
          ] as const).map(({ label, title, body, icon: Icon, bullets }, i) => (
            <div
              key={label}
              className={`mx-auto max-w-6xl px-6 grid gap-14 lg:grid-cols-2 lg:items-center ${
                i % 2 === 1 ? "lg:[&>*:first-child]:order-last" : ""
              }`}
            >
              <div className="space-y-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">{label}</p>
                <h3 className="text-2xl font-extrabold text-white sm:text-3xl">{title}</h3>
                <p className="text-base leading-7 text-slate-400">{body}</p>
                <ul className="space-y-3">
                  {bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm text-slate-300">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex min-h-[260px] items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-950/40 via-slate-900/60 to-slate-950 p-10">
                <div className="space-y-4 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/20">
                    <Icon className="h-9 w-9" />
                  </div>
                  <p className="text-xs text-slate-600">Screenshot coming soon</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* ── More features strip ───────────────────────────────────────────── */}
        <section className="border-t border-white/8 bg-white/[0.02] py-20">
          <div className="mx-auto max-w-6xl px-6 space-y-12">
            <div className="mx-auto max-w-2xl space-y-3 text-center">
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Everything else you'll want</h2>
              <p className="text-slate-400">Built-in features that most flashcard apps charge for.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: BookOpen,     title: "Personal decks",    body: "Organise cards by topic, language, or project. All decks feed into a single daily review queue." },
                { icon: CalendarCheck2, title: "Streak calendar",  body: "28-day review calendar. Small, consistent sessions matter more than long occasional ones." },
                { icon: FileText,    title: "CSV export & import", body: "Export any deck to CSV. Import cards in bulk. Your data is always portable." },
                { icon: Bell,        title: "Push reminders",     body: "Opt-in daily reminders so you never miss a review. Works on mobile and desktop." },
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

        {/* ── Comparison table ──────────────────────────────────────────────── */}
        <section className="py-28">
          <div className="mx-auto max-w-6xl space-y-12 px-6">
            <div className="mx-auto max-w-2xl space-y-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Comparison</p>
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Built for people who want results</h2>
              <p className="text-slate-400">
                Most tools make you work harder to remember less. Recall does the scheduling for you.
              </p>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04]">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-slate-400">
                      Feature
                    </th>
                    {["Recall", "Anki", "Duolingo", "Paper cards"].map((col, i) => (
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

        {/* ── FAQ ───────────────────────────────────────────────────────────── */}
        <section id="faq" className="scroll-mt-20 border-t border-white/8 bg-white/[0.02] py-28">
          <div className="mx-auto max-w-3xl space-y-12 px-6">
            <div className="space-y-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">FAQ</p>
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Common questions</h2>
            </div>
            <LandingFaq />
          </div>
        </section>

        {/* ── CTA banner ────────────────────────────────────────────────────── */}
        <section className="py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div className="relative overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-950/70 via-slate-900/80 to-slate-950 p-14 text-center">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/12 blur-[120px]" />
              </div>
              <div className="relative space-y-6">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
                  Start building vocabulary that lasts
                </h2>
                <p className="mx-auto max-w-lg text-slate-400">
                  Free forever. Sign in with Google and your first deck is ready in under a minute.
                </p>
                {isLoggedIn ? (
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-8 py-4 text-base font-bold text-slate-950 shadow-lg shadow-emerald-400/25 transition hover:bg-emerald-300"
                  >
                    Back to dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-8 py-4 text-base font-bold text-slate-950 shadow-lg shadow-emerald-400/25 transition hover:bg-emerald-300"
                  >
                    Get started for free
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/8">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-10 sm:grid-cols-4">
            <div className="sm:col-span-2 space-y-4">
              <Link href="/landing" className="flex items-center gap-2.5">
                <div className="rounded-xl bg-emerald-400/15 p-2 text-emerald-300">
                  <BrainCircuit className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold text-white">Recall</span>
              </Link>
              <p className="max-w-xs text-sm leading-6 text-slate-500">
                A calm flashcard app powered by spaced repetition and Claude AI.
                Remember what matters.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Product</p>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li><Link href="/login" className="transition hover:text-white">Get started</Link></li>
                <li><Link href="/guide" className="transition hover:text-white">Guide</Link></li>
                {isLoggedIn && (
                  <li><Link href="/" className="transition hover:text-white">Dashboard</Link></li>
                )}
                <li><Link href="/login" className="transition hover:text-white">Sign in</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Company</p>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li><Link href="/about" className="transition hover:text-white">About</Link></li>
                <li><Link href="/contact" className="transition hover:text-white">Contact</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/8 pt-8 sm:flex-row sm:items-center">
            <p className="text-xs text-slate-600">© {new Date().getFullYear()} Recall. All rights reserved.</p>
            <p className="text-xs text-slate-700">Built with spaced repetition and care.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
