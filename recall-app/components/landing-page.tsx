"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, LayoutDashboard, Settings, LogOut } from "lucide-react";
import { SoroSokeLogo } from "./soro-soke-logo";
import { ThemeToggle } from "./theme-toggle";
import { purgeOfflineCaches } from "@/lib/service-worker";

interface LandingPageProps {
  isLoggedIn?: boolean;
  userName?: string | null;
}

type Slide = {
  id: string;
  label: string; // story-rail label
  image: string | null;
  eyebrow: string | null;
  headlineParts: Array<{ text: string; italic?: boolean }>;
  body: string | null;
  caption: string | null; // micro-caption below body
  loop: string[] | null;  // 3-step loop visual (slide 4 only)
  features: Array<{ label: string; href: string; desc: string }> | null;
};

const SLIDES: Slide[] = [
  {
    id: "pain",
    label: "Problem",
    image: "/slide-1.webp",
    eyebrow: null,
    headlineParts: [
      { text: "You're in the room." },
      { text: "\n" },
      { text: "And you can't find the words.", italic: true },
    ],
    body: "The thought is there. Clear, fully formed. But when the moment comes — it stays locked inside your head.",
    caption: null,
    loop: null,
    features: null,
  },
  {
    id: "escape",
    label: "Freeze",
    image: "/slide-2.webp",
    eyebrow: null,
    headlineParts: [
      { text: "So you let" },
      { text: "\n" },
      { text: "the moment go.", italic: true },
    ],
    body: "You keep it vague. You check your phone. Walking home, you replay the sentence you should have said.",
    caption: "Every missed moment adds up.",
    loop: null,
    features: null,
  },
  {
    id: "turn",
    label: "Shift",
    image: "/slide-3.webp",
    eyebrow: "What changes everything",
    headlineParts: [
      { text: "What if you'd already" },
      { text: "\n" },
      { text: "practiced", italic: true },
      { text: " this exact moment?" },
    ],
    body: "Not scripted. Not memorised. Just practiced — so when it mattered, the right words were already close.",
    caption: "Confidence is rarely spontaneous. It's rehearsed.",
    loop: null,
    features: null,
  },
  {
    id: "product",
    label: "Practice",
    image: "/slide-4.webp",
    eyebrow: "Soro Soke",
    headlineParts: [
      { text: "Practice the moment" },
      { text: "\n" },
      { text: "before the moment.", italic: true },
    ],
    body: "Daily cards surface words right before you forget them. AI scenarios rehearse the room before you enter it. Debate Lab sharpens your reasoning when someone smart pushes back. Every session compounds into someone who knows what to say — and when.",
    caption: null,
    loop: ["Review", "Speak Up", "Converse", "Debate"],
    features: null,
  },
  {
    id: "features",
    label: "Loop",
    image: "/slide-5.webp",
    eyebrow: "Four modes. Done consistently.",
    headlineParts: [
      { text: "Review. Rehearse." },
      { text: "\n" },
      { text: "Respond.", italic: true },
      { text: " Defend." },
    ],
    body: null,
    caption: null,
    loop: null,
    features: [
      {
        label: "Daily Review",
        href: "/today",
        desc: "Capture a word in seconds and review it exactly before you forget.",
      },
      {
        label: "Speak Up",
        href: "/speak-up",
        desc: "Practice high-pressure moments until your response feels natural.",
      },
      {
        label: "Conversation Lab",
        href: "/conversation-lab",
        desc: "Rehearse real social situations and learn the next best move.",
      },
      {
        label: "Debate Lab",
        href: "/debate-lab",
        desc: "Pick a motion, defend your position, and hold your ground against an AI opponent.",
      },
    ],
  },
  {
    id: "cta",
    label: "Start",
    image: "/slide-6.webp",
    eyebrow: null,
    headlineParts: [
      { text: "Become the version of you" },
      { text: "\n" },
      { text: "that knows what to say.", italic: true },
    ],
    body: "Train recall, speaking, and social confidence in one daily loop. Free for the first 50 — then $9.99/mo.",
    caption: null,
    loop: null,
    features: null,
  },
];

const PROOF_CHIPS = ["Free for first 50 spots", "No card required", "Built for speaking + memory"];

export function LandingPage({ isLoggedIn = false }: LandingPageProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  // Per-slide animation key: increments each time a slide becomes active,
  // causing its content div to remount and replay the entrance animation.
  const [animKeys, setAnimKeys] = useState<number[]>(SLIDES.map(() => 0));
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [menuOpen]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = slideRefs.current.findIndex((el) => el === entry.target);
            if (idx >= 0) {
              setActiveSlide(idx);
              setAnimKeys((prev) => {
                const next = [...prev];
                next[idx] = prev[idx] + 1;
                return next;
              });
            }
          }
        });
      },
      { root: container, threshold: 0.55 }
    );
    slideRefs.current.forEach((slide) => { if (slide) observer.observe(slide); });
    return () => observer.disconnect();
  }, []);

  function scrollToSlide(index: number) {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTo({ left: index * container.clientWidth, behavior: "smooth" });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      scrollToSlide(Math.min(activeSlide + 1, SLIDES.length - 1));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      scrollToSlide(Math.max(activeSlide - 1, 0));
    }
  }

  const isLast = activeSlide === SLIDES.length - 1;

  return (
    <>
      <style>{`
        .slides-container::-webkit-scrollbar { display: none; }
        .slides-container { scrollbar-width: none; -ms-overflow-style: none; }
        .slide-bg { transition: transform 4.5s cubic-bezier(0.25,0.46,0.45,0.94); }
        .slide-bg.active { transform: scale(1.04); }
      `}</style>

      <div
        className="relative antialiased"
        style={{ height: "100dvh", overflow: "hidden", background: "#010d1a" }}
      >
        {/* ── Floating nav ──────────────────────────────────────────────── */}
        <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between px-6 sm:px-10">
          <button
            onClick={() => scrollToSlide(0)}
            aria-label="Back to start"
            style={{ background: "none", border: "none", padding: 0, cursor: activeSlide > 0 ? "pointer" : "default" }}
          >
            <SoroSokeLogo fontSize="1.9rem" color="#fff" textShadow="0 1px 12px rgba(0,0,0,0.9)" />
          </button>

          <div className="flex items-center gap-2">
            {[
              { label: "About",    href: "/about" },
              { label: "Features", href: "/features" },
              { label: "Pricing",  href: "/pricing" },
              { label: "Blog",     href: "/blog" },
              { label: "FAQ",      href: "/faq" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="hidden sm:inline-flex items-center rounded-xl border border-white/20 bg-white/5 px-4 py-1.5 backdrop-blur-sm transition hover:border-white/35 hover:bg-white/10"
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: "rgba(255,255,255,0.85)",
                  textShadow: "0 1px 8px rgba(0,0,0,0.9)",
                  letterSpacing: "0.01em",
                }}
              >
                {label}
              </Link>
            ))}
            {isLoggedIn ? (
              <div ref={menuRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                >
                  Dashboard
                  <ChevronDown
                    className="h-3.5 w-3.5 transition-transform"
                    style={{ transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </button>
                {menuOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      minWidth: "168px",
                      background: "rgba(10, 20, 38, 0.97)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "0.875rem",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      boxShadow: "0 20px 56px rgba(0,0,0,0.7)",
                      overflow: "hidden",
                      zIndex: 100,
                    }}
                  >
                    <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/6 hover:text-white">
                      <LayoutDashboard className="h-4 w-4 text-slate-500" />
                      Dashboard
                    </Link>
                    <Link href="/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/6 hover:text-white">
                      <Settings className="h-4 w-4 text-slate-500" />
                      Settings
                    </Link>
                    <div style={{ height: "1px", background: "rgba(255,255,255,0.07)", margin: "2px 0" }} />
                    <a href="/api/logout" onClick={purgeOfflineCaches} className="flex items-center gap-3 px-4 py-3 text-sm text-slate-400 transition hover:bg-white/6 hover:text-rose-400">
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300">
                Sign in
              </Link>
            )}
            <ThemeToggle className="rounded-xl p-2.5 text-white/70 transition hover:text-white hover:bg-white/10" />
          </div>
        </header>

        {/* ── Glass chevron nav — previous ──────────────────────────────── */}
        {activeSlide > 0 && (
          <button
            onClick={() => scrollToSlide(activeSlide - 1)}
            aria-label="Previous slide"
            className="fixed left-4 top-1/2 z-50 sm:left-6"
            style={{
              transform: "translateY(-50%)",
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(1,13,26,0.5)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              color: "rgba(255,255,255,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "border-color 0.2s, background 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(74,222,128,0.5)";
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(1,13,26,0.75)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.18)";
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(1,13,26,0.5)";
            }}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        {/* ── Glass chevron nav — next ──────────────────────────────────── */}
        {!isLast && (
          <button
            onClick={() => scrollToSlide(activeSlide + 1)}
            aria-label="Next slide"
            className="fixed right-4 top-1/2 z-50 sm:right-6"
            style={{
              transform: "translateY(-50%)",
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(1,13,26,0.5)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              color: "rgba(255,255,255,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "border-color 0.2s, background 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(74,222,128,0.5)";
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(1,13,26,0.75)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.18)";
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(1,13,26,0.5)";
            }}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}

        {/* ── Story rail — labeled on desktop, dots on mobile ──────────── */}
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
          {/* Desktop: labeled steps */}
          <div className="hidden sm:flex items-center gap-1">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => scrollToSlide(i)}
                aria-label={`Go to ${s.label}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35em",
                  padding: "0.3em 0.65em",
                  borderRadius: "9999px",
                  border: `1px solid ${activeSlide === i ? "rgba(74,222,128,0.4)" : "rgba(255,255,255,0.08)"}`,
                  background: activeSlide === i ? "rgba(74,222,128,0.1)" : "rgba(0,0,0,0.25)",
                  backdropFilter: "blur(8px)",
                  color: activeSlide === i ? "#4ade80" : "rgba(255,255,255,0.35)",
                  fontSize: "0.65rem",
                  fontFamily: "var(--font-geist-sans)",
                  letterSpacing: "0.06em",
                  fontWeight: activeSlide === i ? 600 : 400,
                  transition: "all 0.35s ease",
                  textTransform: "uppercase",
                }}
              >
                <span style={{
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  background: activeSlide === i ? "#4ade80" : "rgba(255,255,255,0.2)",
                  flexShrink: 0,
                  transition: "background 0.35s ease",
                }} />
                {s.label}
              </button>
            ))}
          </div>
          {/* Mobile: simple dots */}
          <div className="flex sm:hidden items-center gap-2">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => scrollToSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  width: activeSlide === i ? "20px" : "5px",
                  height: "5px",
                  borderRadius: "3px",
                  background: activeSlide === i ? "#4ade80" : "rgba(255,255,255,0.2)",
                  transition: "all 0.35s ease",
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Mobile nav links — visible on slides 1-5, sm:hidden ─────── */}
        {activeSlide < SLIDES.length - 1 && (
          <div className="sm:hidden fixed bottom-14 left-0 right-0 z-50 flex justify-center pointer-events-none">
            <div
              className="pointer-events-auto flex items-center gap-0.5"
              style={{
                padding: "0.3rem 0.55rem",
                borderRadius: "9999px",
                background: "rgba(1,13,26,0.72)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {[
                { label: "About",    href: "/about" },
                { label: "Features", href: "/features" },
                { label: "Pricing",  href: "/pricing" },
                { label: "Blog",     href: "/blog" },
                { label: "FAQ",      href: "/faq" },
              ].map(({ label, href }, idx, arr) => (
                <span key={label} style={{ display: "contents" }}>
                  <Link
                    href={href}
                    style={{
                      fontSize: "0.68rem",
                      letterSpacing: "0.03em",
                      color: "rgba(255,255,255,0.55)",
                      padding: "0.25rem 0.55rem",
                      borderRadius: "9999px",
                      transition: "color 0.15s",
                    }}
                  >
                    {label}
                  </Link>
                  {idx < arr.length - 1 && (
                    <span style={{ width: "1px", height: "10px", background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Horizontal scroll container ───────────────────────────────── */}
        <div
          ref={containerRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="slides-container"
          style={{
            display: "flex",
            flexDirection: "row",
            height: "100dvh",
            overflowX: "scroll",
            scrollSnapType: "x mandatory",
            outline: "none",
          }}
        >
          {SLIDES.map((slide, i) => {
            if (i === SLIDES.length - 1) {
              /* ── CTA slide ────────────────────────────────────────── */
              return (
                <section
                  key={slide.id}
                  ref={(el) => { slideRefs.current[i] = el; }}
                  style={{
                    scrollSnapAlign: "start",
                    minWidth: "100vw",
                    width: "100vw",
                    height: "100dvh",
                    flexShrink: 0,
                  }}
                  className="relative flex flex-col items-center justify-center overflow-hidden px-8 text-center"
                >
                  {/* Background photo with Ken Burns */}
                  {slide.image && (
                    <div
                      className={`slide-bg${activeSlide === i ? " active" : ""}`}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundImage: `url('${slide.image}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  )}
                  {/* Dark overlays for text legibility */}
                  <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(1,13,26,0.68)" }} />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{ background: "radial-gradient(ellipse 65% 55% at 50% 52%, rgba(74,222,128,0.08) 0%, transparent 70%)" }}
                  />
                  <div
                    key={animKeys[i]}
                    className="relative max-w-2xl space-y-7"
                    style={{ animation: "slideContentIn 0.55s cubic-bezier(0.25,0.46,0.45,0.94) both" }}
                  >
                    <div className="flex justify-center">
                      <SoroSokeLogo
                        fontSize="1.35rem"
                        color="#4ade80"
                        textShadow="0 0 32px rgba(52,211,153,0.45), 0 0 12px rgba(52,211,153,0.2)"
                        duration={1.0}
                      />
                    </div>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)", fontWeight: 700, lineHeight: 1.08, color: "#f1f5f9", whiteSpace: "pre-line" }}>
                      {slide.headlineParts.map((part, pi) =>
                        part.text === "\n" ? <br key={pi} /> : (
                          <span key={pi} style={{ fontStyle: part.italic ? "italic" : "normal", fontWeight: part.italic ? 400 : 700, color: part.italic ? "#86efac" : "#f1f5f9" }}>
                            {part.text}
                          </span>
                        )
                      )}
                    </h2>
                    <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#94a3b8", maxWidth: "28rem", margin: "0 auto" }}>
                      {slide.body}
                    </p>
                    {isLoggedIn ? (
                      <Link href="/" className="inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-8 py-4 text-base font-bold text-slate-950 transition hover:bg-emerald-300" style={{ boxShadow: "0 0 40px rgba(74,222,128,0.18)" }}>
                        Go to dashboard <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : (
                      <Link href="/login" className="inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-8 py-4 text-base font-bold text-slate-950 transition hover:bg-emerald-300" style={{ boxShadow: "0 0 40px rgba(74,222,128,0.18)" }}>
                        Get started free <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                    {/* Proof chips */}
                    <div className="flex flex-wrap justify-center gap-2 pt-1">
                      {PROOF_CHIPS.map((chip) => (
                        <span
                          key={chip}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35em",
                            padding: "0.28em 0.75em",
                            borderRadius: "9999px",
                            border: "1px solid rgba(52,211,153,0.22)",
                            background: "rgba(52,211,153,0.06)",
                            fontSize: "0.72rem",
                            color: "#6ee7b7",
                            letterSpacing: "0.02em",
                          }}
                        >
                          <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#34d399", flexShrink: 0 }} />
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="absolute bottom-16 flex flex-wrap justify-center gap-5 text-xs text-slate-700">
                    {[
                      { label: "About", href: "/about" },
                      { label: "Features", href: "/features" },
                      { label: "Pricing", href: "/pricing" },
                      { label: "FAQ", href: "/faq" },
                      { label: "Blog", href: "/blog" },
                      { label: "Guide", href: "/guide" },
                      { label: "Contact", href: "/contact" },
                      { label: "Privacy", href: "/privacy" },
                      { label: "Terms", href: "/terms" },
                    ].map(({ label, href }) => (
                      <Link key={label} href={href} className="transition hover:text-slate-400">{label}</Link>
                    ))}
                    <span>© {new Date().getFullYear()} Soro Soke</span>
                  </div>
                </section>
              );
            }

            /* ── Image slides ─────────────────────────────────────────── */
            return (
              <section
                key={slide.id}
                ref={(el) => { slideRefs.current[i] = el; }}
                style={{
                  scrollSnapAlign: "start",
                  minWidth: "100vw",
                  width: "100vw",
                  height: "100dvh",
                  flexShrink: 0,
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  overflow: "hidden",
                  paddingLeft: "clamp(1.75rem, 6vw, 5rem)",
                  paddingRight: "clamp(1.75rem, 12vw, 10rem)",
                  paddingBottom: "clamp(4.5rem, 9vh, 6.5rem)",
                }}
              >
                {/* Background image — CSS approach avoids next/image fill quirks
                    in horizontal scroll-snap containers. Fills 100%; Ken Burns
                    scale(1.04) is clipped by the parent overflow:hidden. */}
                <div
                  className={`slide-bg${activeSlide === i ? " active" : ""}`}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url('${slide.image}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />

                {/* Gradient overlays — bottom-up dark for text legibility */}
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, #010d1a 0%, rgba(1,13,26,0.84) 36%, rgba(1,13,26,0.42) 62%, rgba(1,13,26,0.2) 100%)" }}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to right, rgba(1,13,26,0.65) 0%, transparent 62%)" }}
                />

                {/* Slide content — each element enters independently on slide activation.
                    Headline splits at \n so line 1 sweeps from left, line 2 from right.
                    Body/caption/extras fade up in sequence after the headline lands. */}
                {(() => {
                  // Split headlineParts on "\n" → one array per display line
                  const headlineLines: Array<typeof slide.headlineParts> = [];
                  let cur: typeof slide.headlineParts = [];
                  for (const p of slide.headlineParts) {
                    if (p.text === "\n") { headlineLines.push(cur); cur = []; }
                    else { cur.push(p); }
                  }
                  if (cur.length) headlineLines.push(cur);

                  const snap = "cubic-bezier(0.22, 0.61, 0.36, 1)";
                  // If there's an eyebrow, headline starts a beat later
                  const hlBase = slide.eyebrow ? 0.13 : 0.0;

                  return (
                    <div key={animKeys[i]} className="relative" style={{ maxWidth: "min(640px, 80vw)" }}>
                      {slide.eyebrow ? (
                        <p style={{
                          fontFamily: "var(--font-display)", fontStyle: "italic",
                          fontSize: "clamp(0.78rem, 1.1vw, 0.95rem)", letterSpacing: "0.08em",
                          color: "#4ade80", marginBottom: "0.9rem",
                          textShadow: "0 1px 8px rgba(0,0,0,0.8)",
                          animation: "textFadeUp 0.5s ease 0s both",
                        }}>
                          {slide.eyebrow}
                        </p>
                      ) : null}

                      <h2 style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(2.6rem, 6.5vw, 5.2rem)",
                        lineHeight: 1.06,
                        color: "#f8fafc",
                        textShadow: "0 2px 24px rgba(0,0,0,0.55)",
                        marginBottom: "1.1rem",
                      }}>
                        {headlineLines.map((lineParts, li) => (
                          <span
                            key={li}
                            style={{
                              display: "block",
                              animation: `${li === 0 ? "textFromLeft" : "textFromRight"} 0.65s ${snap} ${(hlBase + li * 0.16).toFixed(2)}s both`,
                            }}
                          >
                            {lineParts.map((part, pi) => (
                              <span key={pi} style={{
                                fontStyle: part.italic ? "italic" : "normal",
                                fontWeight: part.italic ? 400 : 700,
                                color: part.italic ? "#86efac" : "#f8fafc",
                              }}>
                                {part.text}
                              </span>
                            ))}
                          </span>
                        ))}
                      </h2>

                      {slide.body ? (
                        <p style={{
                          fontSize: "clamp(0.95rem, 1.45vw, 1.12rem)", lineHeight: 1.72,
                          color: "#cbd5e1", maxWidth: "36rem",
                          textShadow: "0 1px 10px rgba(0,0,0,0.65)",
                          marginBottom: slide.caption || slide.loop ? "0.85rem" : 0,
                          animation: "textFadeUp 0.6s ease 0.42s both",
                        }}>
                          {slide.body}
                        </p>
                      ) : null}

                      {slide.caption ? (
                        <p style={{
                          fontSize: "0.8rem", letterSpacing: "0.04em",
                          color: "rgba(134,239,172,0.75)", fontStyle: "italic",
                          textShadow: "0 1px 8px rgba(0,0,0,0.7)",
                          marginBottom: slide.loop ? "1rem" : 0,
                          animation: "textFadeUp 0.5s ease 0.56s both",
                        }}>
                          {slide.caption}
                        </p>
                      ) : null}

                      {slide.loop ? (
                        <div style={{
                          display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap",
                          animation: "textFadeUp 0.5s ease 0.62s both",
                        }}>
                          {slide.loop.map((step, si) => (
                            <span key={step} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <span style={{ padding: "0.28em 0.7em", borderRadius: "9999px", border: "1px solid rgba(52,211,153,0.28)", background: "rgba(52,211,153,0.08)", fontSize: "0.75rem", color: "#86efac", letterSpacing: "0.04em" }}>
                                {step}
                              </span>
                              {si < slide.loop!.length - 1 && (
                                <span style={{ color: "rgba(52,211,153,0.4)", fontSize: "0.8rem" }}>→</span>
                              )}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      {slide.features ? (
                        <div style={{ marginTop: "1.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.65rem", maxWidth: "640px" }}>
                          {slide.features.map((f, fi) => (
                            <Link
                              key={f.label}
                              href={isLoggedIn ? f.href : "/login"}
                              className="group rounded-2xl p-4 backdrop-blur-sm transition"
                              style={{
                                background: "rgba(1,13,26,0.65)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                animation: `textFadeUp 0.5s ease ${(0.36 + fi * 0.1).toFixed(2)}s both`,
                              }}
                              onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.background = "rgba(1,13,26,0.82)";
                                (e.currentTarget as HTMLElement).style.borderColor = "rgba(74,222,128,0.35)";
                              }}
                              onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.background = "rgba(1,13,26,0.65)";
                                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
                              }}
                            >
                              <p className="flex items-center gap-1.5" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.98rem", color: "#f1f5f9" }}>
                                {f.label}
                                <ArrowRight className="h-3 w-3 text-emerald-400 opacity-0 transition group-hover:opacity-100" />
                              </p>
                              <p style={{ marginTop: "0.3rem", fontSize: "0.76rem", lineHeight: 1.5, color: "#94a3b8" }}>
                                {f.desc}
                              </p>
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })()}
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
