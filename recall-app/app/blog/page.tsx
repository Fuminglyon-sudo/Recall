import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SummonLogo } from "@/components/summon-logo";
import { POSTS, formatDate } from "./data";

export const metadata: Metadata = {
  title: "Blog — Summon",
  description:
    "Articles on spaced repetition, vocabulary building, conversation skills, speaking confidence, and the science of memory. From the Summon team.",
  keywords: [
    "spaced repetition blog",
    "vocabulary tips",
    "conversation skills",
    "learning science",
    "SM-2",
    "communication blog",
    "memory research",
  ],
  openGraph: {
    title: "Blog — Summon",
    description:
      "Articles on spaced repetition, vocabulary, conversation skills, and the science of memory.",
    type: "website",
  },
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white antialiased">
      {/* Nav */}
      <header className="border-b border-white/8 bg-slate-950/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link href="/landing">
            <SummonLogo fontSize="1.9rem" />
          </Link>
          <nav className="flex items-center gap-5 text-sm text-slate-400">
            <Link href="/about" className="transition hover:text-white">About</Link>
            <Link href="/blog" className="text-white font-medium">Blog</Link>
            <Link href="/contact" className="transition hover:text-white">Contact</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16 space-y-2">
        {/* Header */}
        <div className="mb-14 space-y-3">
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "0.85rem",
              letterSpacing: "0.12em",
              color: "#4ade80",
              textTransform: "uppercase",
            }}
          >
            The Summon Blog
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              color: "#f1f5f9",
            }}
          >
            Learning, memory,
            <br />
            <span style={{ fontStyle: "italic", fontWeight: 400, color: "#86efac" }}>
              and how to say the right thing.
            </span>
          </h1>
          <p className="text-slate-400 max-w-lg" style={{ lineHeight: 1.7 }}>
            Articles on spaced repetition, vocabulary, conversation skills, and the science of
            memory — written for people who want to communicate better.
          </p>
        </div>

        {/* Post list */}
        <div className="divide-y divide-white/8">
          {POSTS.map((post) => (
            <article key={post.slug} className="group py-8">
              <Link href={`/blog/${post.slug}`} className="block space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span
                    className="rounded-full bg-emerald-400/10 px-2.5 py-0.5 text-emerald-400 font-medium"
                  >
                    {post.category}
                  </span>
                  <span>{formatDate(post.date)}</span>
                  <span>{post.readTime}</span>
                </div>

                <h2
                  className="transition group-hover:text-emerald-300"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.15rem, 2.5vw, 1.5rem)",
                    fontWeight: 700,
                    lineHeight: 1.25,
                    color: "#f1f5f9",
                  }}
                >
                  {post.title}
                </h2>

                <p
                  className="text-slate-400 max-w-xl"
                  style={{ fontSize: "0.9rem", lineHeight: 1.7 }}
                >
                  {post.excerpt}
                </p>

                <span className="inline-flex items-center gap-1.5 text-sm text-emerald-400 transition group-hover:gap-2.5">
                  Read article <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </article>
          ))}
        </div>
      </main>

      <footer className="border-t border-white/8 mt-16 py-10">
        <div className="mx-auto max-w-3xl px-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
          <span>© {new Date().getFullYear()} Summon</span>
          <div className="flex gap-5">
            <Link href="/about" className="transition hover:text-slate-400">About</Link>
            <Link href="/contact" className="transition hover:text-slate-400">Contact</Link>
            <Link href="/landing" className="transition hover:text-slate-400">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
