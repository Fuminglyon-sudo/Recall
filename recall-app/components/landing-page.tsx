"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SummonLogo } from "./summon-logo";

interface LandingPageProps {
  isLoggedIn?: boolean;
  userName?: string | null;
}

type Slide = {
  id: string;
  image: string | null;
  eyebrow: string | null;
  headlineParts: Array<{ text: string; italic?: boolean; bold?: boolean }>;
  body: string | null;
  features: Array<{ label: string; href: string; desc: string }> | null;
};

const SLIDES: Slide[] = [
  {
    id: "pain",
    image: "/scenerios/speak-up-interview-intro.webp",
    eyebrow: null,
    headlineParts: [
      { text: "You're in the room." },
      { text: "\n" },
      { text: "And you can't find the words.", italic: true },
    ],
    body: "The thought is there. Clear, fully formed. But when the moment comes — it stays locked inside your head.",
    features: null,
  },
  {
    id: "escape",
    image: "/scenerios/lab-elevator.webp",
    eyebrow: null,
    headlineParts: [
      { text: "So you wait" },
      { text: "\n" },
      { text: "for it to pass.", italic: true },
    ],
    body: "You keep it vague. You check your phone. Walking home, you find the sentence you should have said.",
    features: null,
  },
  {
    id: "turn",
    image: "/scenerios/speak-up-big-decision.webp",
    eyebrow: "What changes everything",
    headlineParts: [
      { text: "What if you'd already" },
      { text: "\n" },
      { text: "practiced", italic: true },
      { text: " this exact moment?" },
    ],
    body: "Not scripted. Not memorised. Just practiced — so when it mattered, the right words were already close.",
    features: null,
  },
  {
    id: "product",
    image: "/scenerios/speak-up-raise.webp",
    eyebrow: "Summon",
    headlineParts: [
      { text: "A practice" },
      { text: "\n" },
      { text: "that compounds.", italic: true },
    ],
    body: "Real scenarios. Honest coaching. A system that builds the version of you that knows what to say — before you walk through the door.",
    features: null,
  },
  {
    id: "features",
    image: "/scenerios/lab-networking.webp",
    eyebrow: "The loop",
    headlineParts: [
      { text: "Three things." },
      { text: "\n" },
      { text: "Done consistently.", italic: true },
    ],
    body: null,
    features: [
      {
        label: "Daily Review",
        href: "/today",
        desc: "SM-2 spaced repetition. The right card at the right moment. Words that actually stay.",
      },
      {
        label: "Speak Up",
        href: "/speak-up",
        desc: "High-stakes scenarios. Honest AI feedback. The room where you rehearse before the room that counts.",
      },
      {
        label: "Conversation Lab",
        href: "/conversation-lab",
        desc: "Open, sustain, and end conversations naturally — with anyone, in any room.",
      },
    ],
  },
  {
    id: "cta",
    image: null,
    eyebrow: null,
    headlineParts: [
      { text: "Build the version of you" },
      { text: "\n" },
      { text: "that knows what to say.", italic: true },
    ],
    body: "Free to use. No card required. Start your first session today.",
    features: null,
  },
];

export function LandingPage({ isLoggedIn = false }: LandingPageProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = slideRefs.current.findIndex((el) => el === entry.target);
            if (idx >= 0) setActiveSlide(idx);
          }
        });
      },
      { root: container, threshold: 0.55 }
    );

    slideRefs.current.forEach((slide) => {
      if (slide) observer.observe(slide);
    });

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
        @keyframes triangleAdvance {
          0%   { opacity: 0.35; transform: translateX(0px);  }
          55%  { opacity: 1;    transform: translateX(7px);  }
          100% { opacity: 0.35; transform: translateX(0px);  }
        }
        @keyframes triangleGlow {
          0%, 100% { filter: drop-shadow(0 0 5px rgba(74,222,128,0.4)); }
          55%       { filter: drop-shadow(0 0 14px rgba(74,222,128,0.9)); }
        }
        @keyframes triangleBack {
          0%   { opacity: 0.35; transform: translateX(0px);  }
          55%  { opacity: 1;    transform: translateX(-7px); }
          100% { opacity: 0.35; transform: translateX(0px);  }
        }
        @keyframes triangleBackGlow {
          0%, 100% { filter: drop-shadow(0 0 5px rgba(74,222,128,0.4)); }
          55%       { filter: drop-shadow(0 0 14px rgba(74,222,128,0.9)); }
        }
        .slides-container::-webkit-scrollbar { display: none; }
        .slides-container { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>

      <div
        className="relative antialiased"
        style={{ height: "100dvh", overflow: "hidden", background: "#010d1a" }}
      >
        {/* ── Floating nav ──────────────────────────────────────────────── */}
        <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between px-6 sm:px-10">
          <Link href="/landing">
            <SummonLogo fontSize="1.9rem" textShadow="0 1px 12px rgba(0,0,0,0.9)" />
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/about"
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
              About
            </Link>
            <Link
              href="/blog"
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
              Blog
            </Link>
            <Link
              href="/contact"
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
              Contact
            </Link>
            {isLoggedIn ? (
              <Link href="/" className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300">
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300">
                Sign in
              </Link>
            )}
          </div>
        </header>

        {/* ── Flashing left triangle (back, slides 2–6) ────────────────── */}
        {activeSlide > 0 && (
          <button
            onClick={() => scrollToSlide(activeSlide - 1)}
            aria-label="Previous slide"
            className="fixed left-5 top-1/2 z-50 sm:left-8"
            style={{ transform: "translateY(-50%)" }}
          >
            <div
              style={{
                animation: "triangleBack 1.6s ease-in-out infinite, triangleBackGlow 1.6s ease-in-out infinite",
                width: 0,
                height: 0,
                borderTop: "16px solid transparent",
                borderBottom: "16px solid transparent",
                borderRight: "26px solid #4ade80",
              }}
            />
          </button>
        )}

        {/* ── Flashing right triangle ───────────────────────────────────── */}
        {!isLast && (
          <button
            onClick={() => scrollToSlide(activeSlide + 1)}
            aria-label="Next slide"
            className="fixed right-5 top-1/2 z-50 sm:right-8"
            style={{ transform: "translateY(-50%)" }}
          >
            <div
              style={{
                animation: "triangleAdvance 1.6s ease-in-out infinite, triangleGlow 1.6s ease-in-out infinite",
                width: 0,
                height: 0,
                borderTop: "16px solid transparent",
                borderBottom: "16px solid transparent",
                borderLeft: "26px solid #4ade80",
              }}
            />
          </button>
        )}

        {/* ── Slide progress dots (small, bottom-center) ───────────────── */}
        <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => scrollToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: activeSlide === i ? "24px" : "6px",
                height: "6px",
                borderRadius: "3px",
                background: activeSlide === i ? "#4ade80" : "rgba(255,255,255,0.2)",
                transition: "all 0.35s ease",
              }}
            />
          ))}
        </div>

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
              /* ── CTA slide (no image) ─────────────────────────────── */
              return (
                <section
                  key={slide.id}
                  ref={(el) => { slideRefs.current[i] = el; }}
                  style={{
                    scrollSnapAlign: "start",
                    minWidth: "100vw",
                    height: "100dvh",
                    flexShrink: 0,
                  }}
                  className="relative flex flex-col items-center justify-center overflow-hidden px-8 text-center"
                >
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: "radial-gradient(ellipse 65% 55% at 50% 52%, rgba(74,222,128,0.09) 0%, transparent 70%)",
                    }}
                  />

                  <div className="relative max-w-2xl space-y-8">
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontStyle: "italic",
                        fontSize: "1rem",
                        letterSpacing: "0.12em",
                        color: "#4ade80",
                        textTransform: "uppercase",
                      }}
                    >
                      Summon
                    </p>

                    <h2
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)",
                        fontWeight: 700,
                        lineHeight: 1.08,
                        color: "#f1f5f9",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {slide.headlineParts.map((part, pi) =>
                        part.text === "\n" ? (
                          <br key={pi} />
                        ) : (
                          <span
                            key={pi}
                            style={{
                              fontStyle: part.italic ? "italic" : "normal",
                              fontWeight: part.italic ? 400 : 700,
                              color: part.italic ? "#86efac" : "#f1f5f9",
                            }}
                          >
                            {part.text}
                          </span>
                        )
                      )}
                    </h2>

                    <p
                      style={{
                        fontSize: "1.05rem",
                        lineHeight: 1.75,
                        color: "#94a3b8",
                        maxWidth: "28rem",
                        margin: "0 auto",
                      }}
                    >
                      {slide.body}
                    </p>

                    {isLoggedIn ? (
                      <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-8 py-4 text-base font-bold text-slate-950 transition hover:bg-emerald-300"
                        style={{ boxShadow: "0 0 40px rgba(74,222,128,0.18)" }}
                      >
                        Go to dashboard <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : (
                      <Link
                        href="/login"
                        className="inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-8 py-4 text-base font-bold text-slate-950 transition hover:bg-emerald-300"
                        style={{ boxShadow: "0 0 40px rgba(74,222,128,0.18)" }}
                      >
                        Get started free <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}

                    <p style={{ fontSize: "0.75rem", color: "#475569", marginTop: "0.5rem" }}>
                      <Link href="/about" className="transition hover:text-slate-400">
                        Learn more about Summon →
                      </Link>
                    </p>
                  </div>

                  <div className="absolute bottom-7 flex flex-wrap justify-center gap-5 text-xs text-slate-700">
                    <Link href="/about" className="transition hover:text-slate-400">About</Link>
                    <Link href="/blog" className="transition hover:text-slate-400">Blog</Link>
                    <Link href="/guide" className="transition hover:text-slate-400">Guide</Link>
                    <Link href="/contact" className="transition hover:text-slate-400">Contact</Link>
                    <span>© {new Date().getFullYear()} Summon</span>
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
                  height: "100dvh",
                  flexShrink: 0,
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  overflow: "hidden",
                  paddingLeft: "clamp(1.75rem, 6vw, 5rem)",
                  paddingRight: "clamp(1.75rem, 12vw, 10rem)",
                  paddingBottom: "clamp(4rem, 8vh, 6rem)",
                }}
              >
                {/* Background image */}
                <Image
                  src={slide.image!}
                  alt=""
                  fill
                  className="object-cover"
                  priority={i <= 1}
                  sizes="100vw"
                />

                {/* Bottom-up dark gradient */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, #010d1a 0%, rgba(1,13,26,0.82) 38%, rgba(1,13,26,0.4) 65%, rgba(1,13,26,0.22) 100%)",
                  }}
                />
                {/* Left vignette for text contrast */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to right, rgba(1,13,26,0.6) 0%, transparent 65%)",
                  }}
                />

                {/* Slide content */}
                <div className="relative" style={{ maxWidth: "min(680px, 80vw)" }}>
                  {slide.eyebrow ? (
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontStyle: "italic",
                        fontSize: "clamp(0.8rem, 1.2vw, 1rem)",
                        letterSpacing: "0.08em",
                        color: "#4ade80",
                        marginBottom: "1rem",
                        textShadow: "0 1px 8px rgba(0,0,0,0.8)",
                      }}
                    >
                      {slide.eyebrow}
                    </p>
                  ) : null}

                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(2.6rem, 6.5vw, 5.2rem)",
                      lineHeight: 1.06,
                      color: "#f8fafc",
                      textShadow: "0 2px 24px rgba(0,0,0,0.55)",
                      marginBottom: "1.25rem",
                    }}
                  >
                    {slide.headlineParts.map((part, pi) =>
                      part.text === "\n" ? (
                        <br key={pi} />
                      ) : (
                        <span
                          key={pi}
                          style={{
                            fontStyle: part.italic ? "italic" : "normal",
                            fontWeight: part.italic ? 400 : 700,
                            color: part.italic ? "#86efac" : "#f8fafc",
                          }}
                        >
                          {part.text}
                        </span>
                      )
                    )}
                  </h2>

                  {slide.body ? (
                    <p
                      style={{
                        fontSize: "clamp(0.95rem, 1.5vw, 1.15rem)",
                        lineHeight: 1.72,
                        color: "#cbd5e1",
                        maxWidth: "38rem",
                        textShadow: "0 1px 10px rgba(0,0,0,0.65)",
                      }}
                    >
                      {slide.body}
                    </p>
                  ) : null}

                  {slide.features ? (
                    <div
                      style={{
                        marginTop: "2rem",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: "0.75rem",
                        maxWidth: "680px",
                      }}
                    >
                      {slide.features.map((f) => (
                        <Link
                          key={f.label}
                          href={isLoggedIn ? f.href : "/login"}
                          className="group rounded-2xl border border-white/10 bg-slate-950/65 p-4 backdrop-blur-sm transition hover:border-emerald-400/35 hover:bg-slate-950/80"
                        >
                          <p
                            className="flex items-center gap-1.5"
                            style={{
                              fontFamily: "var(--font-display)",
                              fontWeight: 600,
                              fontSize: "1rem",
                              color: "#f1f5f9",
                            }}
                          >
                            {f.label}
                            <ArrowRight
                              className="h-3 w-3 text-emerald-400 opacity-0 transition group-hover:opacity-100"
                              style={{ transition: "opacity 0.2s" }}
                            />
                          </p>
                          <p
                            style={{
                              marginTop: "0.35rem",
                              fontSize: "0.78rem",
                              lineHeight: 1.55,
                              color: "#64748b",
                            }}
                          >
                            {f.desc}
                          </p>
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
