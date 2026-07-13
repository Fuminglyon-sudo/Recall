import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MarketingNav } from "@/components/marketing-nav";
import { MarketingFooter } from "@/components/marketing-footer";
import { POSTS, formatDate } from "./data";
import { POST_IMAGES, CATEGORY_STYLES } from "./images";

export const metadata: Metadata = {
  title: "Blog — Sọrọ Sọkẹ AI",
  description:
    "Articles on spaced repetition, vocabulary building, speaking confidence, and the science of memory — from the Sọrọ Sọkẹ AI team.",
  keywords: [
    "spaced repetition blog",
    "vocabulary tips",
    "conversation skills",
    "speaking confidence",
    "learning science",
    "SM-2",
    "communication blog",
    "memory research",
    "Soro Soke",
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog — Sọrọ Sọkẹ AI",
    description:
      "Articles on spaced repetition, vocabulary, conversation skills, and the science of memory.",
    type: "website",
    url: "/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Sọrọ Sọkẹ AI",
    description:
      "Articles on spaced repetition, vocabulary, conversation skills, and the science of memory.",
  },
};

export default function BlogPage() {
  const [featured, ...rest] = POSTS;

  return (
    <div className="min-h-screen bg-slate-950 text-white antialiased flex flex-col">
      <MarketingNav />

      <main className="mx-auto max-w-6xl flex-1 px-6 py-16">

        {/* ── Header ── */}
        <header className="mb-14 space-y-3 border-b border-white/8 pb-12">
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
            The Sọrọ Sọkẹ Blog
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              color: "var(--heading)",
            }}
          >
            Learning, memory,
            <br />
            <span style={{ fontStyle: "italic", fontWeight: 400, color: "var(--heading-em)" }}>
              and how to say the right thing.
            </span>
          </h1>
          <p className="text-slate-400 max-w-lg" style={{ lineHeight: 1.7 }}>
            Articles on spaced repetition, vocabulary, conversation skills, and the science of
            memory — written for people who want to communicate better.
          </p>
        </header>

        {/* ── Featured post (full width) ── */}
        <Link
          href={`/blog/${featured.slug}`}
          className="group mb-12 block overflow-hidden rounded-3xl border border-white/10 transition hover:border-white/20"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <div className="grid md:grid-cols-2">
            {/* Image */}
            <div className="relative aspect-[16/9] md:aspect-auto md:min-h-[280px] overflow-hidden">
              <Image
                src={POST_IMAGES[featured.slug] ?? "/dashboard.png"}
                alt={featured.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <span
                style={{
                  position: "absolute",
                  top: "1rem",
                  left: "1rem",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "0.3em 0.75em",
                  borderRadius: "9999px",
                  background: "rgba(52,211,153,0.2)",
                  border: "1px solid rgba(52,211,153,0.4)",
                  color: "#6ee7b7",
                  backdropFilter: "blur(6px)",
                }}
              >
                Featured
              </span>
            </div>
            {/* Text */}
            <div className="flex flex-col justify-center gap-4 p-8">
              <CategoryBadge category={featured.category} />
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.3rem, 2.5vw, 1.85rem)",
                  fontWeight: 700,
                  lineHeight: 1.2,
                  color: "var(--heading)",
                }}
                className="transition group-hover:text-emerald-300"
              >
                {featured.title}
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-auto">
                <span>{formatDate(featured.date)}</span>
                <span>·</span>
                <span>{featured.readTime}</span>
              </div>
            </div>
          </div>
        </Link>

        {/* ── 3-column grid ── */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const s = CATEGORY_STYLES[category] ?? { color: "#94a3b8", bg: "rgba(148,163,184,0.1)" };
  return (
    <span
      style={{
        display: "inline-flex",
        alignSelf: "flex-start",
        fontSize: "0.65rem",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding: "0.3em 0.75em",
        borderRadius: "9999px",
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.color}33`,
      }}
    >
      {category}
    </span>
  );
}

function PostCard({ post }: { post: (typeof POSTS)[number] }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 transition duration-300 hover:border-white/20 hover:-translate-y-0.5"
      style={{ background: "rgba(255,255,255,0.03)" }}
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={POST_IMAGES[post.slug] ?? "/dashboard.png"}
          alt={post.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* gradient overlay for text readability */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(2,6,23,0.4) 0%, transparent 60%)" }}
        />
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 gap-3 p-5">
        <CategoryBadge category={post.category} />
        <h2
          className="transition group-hover:text-emerald-300 line-clamp-2"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.05rem",
            fontWeight: 700,
            lineHeight: 1.3,
            color: "var(--heading)",
          }}
        >
          {post.title}
        </h2>
        <p
          className="text-slate-400 text-xs leading-relaxed line-clamp-2 flex-1"
        >
          {post.excerpt}
        </p>
        <div className="flex items-center gap-2 text-xs text-slate-600 mt-auto pt-3 border-t border-white/5">
          <span>{formatDate(post.date)}</span>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>
      </div>
    </Link>
  );
}
