"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowDown, BrainCircuit } from "lucide-react";

interface LandingPageProps {
  isLoggedIn?: boolean;
  userName?: string | null;
}

type Slide = {
  id: string;
  image: string | null;
  eyebrow: string | null;
  headline: string;
  body: string | null;
  features: Array<{ label: string; href: string; desc: string }> | null;
};

const SLIDES: Slide[] = [
  {
    id: "pain",
    image: "/scenerios/speak-up-interview-intro.webp",
    eyebrow: null,
    headline: "You're in the room.\nAnd you can't find the words.",
    body: "The thought is there. Clear, fully formed. But when the moment comes — it stays locked inside your head.",
    features: null,
  },
  {
    id: "escape",
    image: "/scenerios/lab-elevator.webp",
    eyebrow: null,
    headline: "So you wait\nfor it to pass.",
    body: "You keep it vague. You check your phone. Walking home, you find the sentence you should have said.",
    features: null,
  },
  {
    id: "turn",
    image: "/scenerios/speak-up-big-decision.webp",
    eyebrow: "What changes everything",
    headline: "What if you'd already\npracticed this exact moment?",
    body: "Not scripted. Not memorised. Just practiced — so when it mattered, the right words were already close.",
    features: null,
  },
  {
    id: "product",
    image: "/scenerios/speak-up-raise.webp",
    eyebrow: "Recall",
    headline: "A practice\nthat compounds.",
    body: "Real scenarios. Honest coaching. A system that builds the version of you that knows what to say — before you walk through the door.",
    features: null,
  },
  {
    id: "features",
    image: "/scenerios/lab-networking.webp",
    eyebrow: "The loop",
    headline: "Three things.\nDone consistently.",
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
    headline: "Build the version of you\nthat knows what to say.",
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
    slideRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      scrollToSlide(Math.min(activeSlide + 1, SLIDES.length - 1));
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      scrollToSlide(Math.max(activeSlide - 1, 0));
    }
  }

  return (
    <div
      className="relative antialiased"
      style={{ height: "100dvh", overflow: "hidden", background: "#010d1a" }}
    >
      {/* ── Floating nav ─────────────────────────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between px-6 sm:px-10">
        <Link href="/landing" className="flex items-center gap-2.5">
          <div className="rounded-xl bg-emerald-400/20 p-1.5 text-emerald-300">
            <BrainCircuit className="h-4 w-4" />
          </div>
          <span
            className="text-sm font-bold tracking-tight text-white"
            style={{ textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}
          >
            Recall
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/about"
            className="hidden text-sm text-white/55 transition hover:text-white sm:block"
            style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}
          >
            About
          </Link>
          {isLoggedIn ? (
            <Link
              href="/"
              className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
            >
              Sign in
            </Link>
          )}
        </div>
      </header>

      {/* ── Vertical dot nav ─────────────────────────────────────────────── */}
      <div className="fixed right-4 top-1/2 z-50 flex -translate-y-1/2 flex-col items-center gap-3 sm:right-6">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => scrollToSlide(i)}
            aria-label={`Slide ${i + 1}`}
            className="flex items-center justify-center transition-all duration-300"
            style={{
              width: "20px",
              height: "6px",
              borderRadius: "3px",
              background: activeSlide === i ? "#4ade80" : "rgba(255,255,255,0.25)",
              transform: activeSlide === i ? "scaleX(1.4)" : "scaleX(1)",
            }}
          />
        ))}
      </div>

      {/* ── Scroll container ─────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        style={{
          height: "100dvh",
          overflowY: "scroll",
          scrollSnapType: "y mandatory",
          outline: "none",
        }}
      >
        {SLIDES.map((slide, i) => {
          const isLast = i === SLIDES.length - 1;

          if (isLast) {
            return (
              <section
                key={slide.id}
                ref={(el) => { slideRefs.current[i] = el; }}
                style={{ scrollSnapAlign: "start", height: "100dvh" }}
                className="relative flex flex-col items-center justify-center overflow-hidden px-6 text-center"
              >
                {/* Glow */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ background: "radial-gradient(ellipse 60% 50% at 50% 55%, rgba(74,222,128,0.10) 0%, transparent 70%)" }}
                />

                <div className="relative max-w-2xl space-y-7">
                  <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Recall</p>
                  <h2
                    className="font-extrabold leading-tight text-white"
                    style={{
                      fontSize: "clamp(2rem, 5vw, 3.5rem)",
                      whiteSpace: "pre-line",
                      textWrap: "balance",
                    } as React.CSSProperties}
                  >
                    {slide.headline}
                  </h2>
                  <p className="mx-auto max-w-sm text-base leading-7 text-slate-400">
                    {slide.body}
                  </p>
                  {isLoggedIn ? (
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-7 py-3.5 text-base font-bold text-slate-950 shadow-lg transition hover:bg-emerald-300"
                      style={{ boxShadow: "0 0 32px rgba(74,222,128,0.2)" }}
                    >
                      Go to dashboard <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-7 py-3.5 text-base font-bold text-slate-950 shadow-lg transition hover:bg-emerald-300"
                      style={{ boxShadow: "0 0 32px rgba(74,222,128,0.2)" }}
                    >
                      Get started free <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>

                {/* Footer strip */}
                <div className="absolute bottom-7 flex flex-wrap justify-center gap-5 text-xs text-slate-700">
                  <Link href="/about" className="transition hover:text-slate-400">About</Link>
                  <Link href="/guide" className="transition hover:text-slate-400">Guide</Link>
                  <Link href="/contact" className="transition hover:text-slate-400">Contact</Link>
                  <span>© {new Date().getFullYear()} Recall</span>
                </div>
              </section>
            );
          }

          return (
            <section
              key={slide.id}
              ref={(el) => { slideRefs.current[i] = el; }}
              style={{ scrollSnapAlign: "start", height: "100dvh" }}
              className="relative flex flex-col justify-end overflow-hidden px-7 pb-16 sm:px-14 sm:pb-20"
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

              {/* Gradient overlay — dark base, fades up */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, #010d1a 0%, rgba(1,13,26,0.78) 40%, rgba(1,13,26,0.35) 70%, rgba(1,13,26,0.20) 100%)",
                }}
              />

              {/* Side vignette — makes left-anchored text always readable */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to right, rgba(1,13,26,0.55) 0%, transparent 60%)",
                }}
              />

              {/* Content */}
              <div className="relative max-w-2xl space-y-4">
                {slide.eyebrow ? (
                  <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                    {slide.eyebrow}
                  </p>
                ) : null}

                <h2
                  className="font-extrabold leading-[1.08] text-white"
                  style={{
                    fontSize: "clamp(2rem, 5.5vw, 4rem)",
                    whiteSpace: "pre-line",
                    textShadow: "0 2px 20px rgba(0,0,0,0.5)",
                  }}
                >
                  {slide.headline}
                </h2>

                {slide.body ? (
                  <p
                    className="max-w-lg text-base leading-7 text-slate-300 sm:text-lg"
                    style={{ textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}
                  >
                    {slide.body}
                  </p>
                ) : null}

                {slide.features ? (
                  <div className="mt-2 grid gap-2.5 sm:grid-cols-3 pt-2">
                    {slide.features.map((f) => (
                      <Link
                        key={f.label}
                        href={isLoggedIn ? f.href : "/login"}
                        className="group rounded-2xl border border-white/12 bg-slate-950/65 p-4 backdrop-blur-sm transition hover:border-emerald-400/30 hover:bg-slate-950/80"
                      >
                        <p className="flex items-center gap-1.5 text-sm font-semibold text-white">
                          {f.label}
                          <ArrowRight className="h-3 w-3 text-emerald-400 opacity-0 transition group-hover:opacity-100" />
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-400">{f.desc}</p>
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>

              {/* Scroll cue — first slide only */}
              {i === 0 ? (
                <button
                  onClick={() => scrollToSlide(1)}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/30 transition hover:text-white/60"
                >
                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em]">Scroll</span>
                  <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
                </button>
              ) : null}
            </section>
          );
        })}
      </div>
    </div>
  );
}
