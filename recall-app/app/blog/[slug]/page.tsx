import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { POSTS, getPost, formatDate, type Block } from "../data";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    keywords: [post.category, "spaced repetition", "vocabulary", "conversation skills", "Recall"],
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary",
      title: post.title,
      description: post.description,
    },
  };
}

function renderBlock(block: Block, index: number) {
  if (block.type === "h2") {
    return (
      <h2
        key={index}
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.3rem, 2.5vw, 1.7rem)",
          fontWeight: 700,
          lineHeight: 1.2,
          color: "#f1f5f9",
          marginTop: "2.5rem",
          marginBottom: "0.75rem",
        }}
      >
        {block.text}
      </h2>
    );
  }
  if (block.type === "ul") {
    return (
      <ul
        key={index}
        style={{
          margin: "1rem 0",
          paddingLeft: "1.4rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem",
        }}
      >
        {block.items.map((item, i) => (
          <li
            key={i}
            style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#94a3b8" }}
          >
            {item}
          </li>
        ))}
      </ul>
    );
  }
  return (
    <p
      key={index}
      style={{
        fontSize: "1.05rem",
        lineHeight: 1.8,
        color: "#94a3b8",
        margin: "1rem 0",
      }}
    >
      {block.text}
    </p>
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const postIndex = POSTS.findIndex((p) => p.slug === slug);
  const prev = POSTS[postIndex - 1] ?? null;
  const next = POSTS[postIndex + 1] ?? null;

  return (
    <div className="min-h-screen bg-slate-950 text-white antialiased">
      {/* Nav */}
      <header className="border-b border-white/8 bg-slate-950/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link href="/landing">
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: "1.9rem",
                color: "#fff",
                letterSpacing: "-0.01em",
              }}
            >
              Recall
            </span>
          </Link>
          <Link
            href="/blog"
            className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            All articles
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-14">
        {/* Eyebrow */}
        <div className="mb-6 flex items-center gap-3 text-xs text-slate-500">
          <span className="rounded-full bg-emerald-400/10 px-2.5 py-0.5 text-emerald-400 font-medium">
            {post.category}
          </span>
          <span>{formatDate(post.date)}</span>
          <span>{post.readTime}</span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.9rem, 5vw, 2.9rem)",
            fontWeight: 700,
            lineHeight: 1.1,
            color: "#f1f5f9",
            marginBottom: "2rem",
          }}
        >
          {post.title}
        </h1>

        {/* Divider */}
        <div className="mb-8 h-px bg-white/8" />

        {/* Content */}
        <div>{post.content.map((block, i) => renderBlock(block, i))}</div>

        {/* CTA */}
        <div
          className="mt-14 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-8 text-center space-y-4"
          style={{ backdropFilter: "blur(8px)" }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#f1f5f9",
              lineHeight: 1.2,
            }}
          >
            Put this into practice.
          </p>
          <p className="text-slate-400 text-sm mx-auto max-w-sm" style={{ lineHeight: 1.7 }}>
            Recall gives you spaced repetition, high-stakes speaking practice, and Conversation Lab — all in one place. Free to use.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
          >
            Get started free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Prev / Next */}
        {(prev || next) && (
          <nav className="mt-12 grid grid-cols-2 gap-4">
            {prev ? (
              <Link
                href={`/blog/${prev.slug}`}
                className="group rounded-xl border border-white/10 bg-white/3 p-4 transition hover:border-white/20 hover:bg-white/6"
              >
                <p className="mb-1 text-xs text-slate-500">← Previous</p>
                <p
                  className="text-sm font-medium text-slate-300 transition group-hover:text-white"
                  style={{ lineHeight: 1.4 }}
                >
                  {prev.title}
                </p>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`/blog/${next.slug}`}
                className="group rounded-xl border border-white/10 bg-white/3 p-4 text-right transition hover:border-white/20 hover:bg-white/6"
              >
                <p className="mb-1 text-xs text-slate-500">Next →</p>
                <p
                  className="text-sm font-medium text-slate-300 transition group-hover:text-white"
                  style={{ lineHeight: 1.4 }}
                >
                  {next.title}
                </p>
              </Link>
            ) : (
              <div />
            )}
          </nav>
        )}
      </main>

      <footer className="border-t border-white/8 mt-10 py-10">
        <div className="mx-auto max-w-2xl px-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
          <span>© {new Date().getFullYear()} Recall</span>
          <div className="flex gap-5">
            <Link href="/blog" className="transition hover:text-slate-400">Blog</Link>
            <Link href="/about" className="transition hover:text-slate-400">About</Link>
            <Link href="/contact" className="transition hover:text-slate-400">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
