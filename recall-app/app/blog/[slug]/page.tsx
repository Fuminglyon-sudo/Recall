import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SoroSokeLogo } from "@/components/soro-soke-logo";
import { SoroSokeMark } from "@/components/soro-soke-mark";
import { ReadingProgressBar } from "@/components/reading-progress-bar";
import { ThemeToggle } from "@/components/theme-toggle";
import { BlogContentGate } from "@/components/blog-content-gate";
import { MarketingFooter } from "@/components/marketing-footer";
import { POSTS, getPost, formatDate } from "../data";
import { POST_IMAGES } from "../images";

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
  const image = POST_IMAGES[slug];
  return {
    title: post.title,
    description: post.description,
    keywords: [post.category, "spaced repetition", "vocabulary", "conversation skills", "Soro Soke"],
    robots: { index: true, follow: true },
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url: `/blog/${slug}`,
      ...(image ? { images: [{ url: image, width: 1200, height: 630, alt: post.title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      ...(image ? { images: [image] } : {}),
    },
  };
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
  const image = POST_IMAGES[slug];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sorosokeai.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}/blog/${slug}` },
    author: { "@type": "Organization", name: "Sọrọ Sọkẹ AI" },
    publisher: {
      "@type": "Organization",
      name: "Sọrọ Sọkẹ AI",
      logo: { "@type": "ImageObject", url: `${siteUrl}/favicon.svg` },
    },
    ...(image ? { image: `${siteUrl}${image}` } : {}),
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadingProgressBar />

      {/* Nav */}
      <header className="border-b border-white/8 bg-slate-950/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link href="/landing" className="flex items-center gap-2">
            <SoroSokeMark size={30} className="shrink-0" />
            <SoroSokeLogo fontSize="1.9rem" />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/blog"
              className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-slate-100"
            >
              <ArrowLeft className="h-4 w-4" />
              All articles
            </Link>
            <ThemeToggle className="rounded-xl p-2 text-slate-400 transition hover:bg-white/8 hover:text-slate-100" />
          </div>
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
            color: "var(--heading)",
            marginBottom: "2rem",
          }}
        >
          {post.title}
        </h1>

        {/* Hero image */}
        {image && (
          <div className="mb-8 overflow-hidden rounded-2xl border border-white/10">
            <Image
              src={image}
              alt={post.title}
              width={800}
              height={450}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        )}

        {/* Divider */}
        <div className="mb-8 h-px bg-white/8" />

        {/* Content */}
        <BlogContentGate blocks={post.content} />

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
              color: "var(--heading)",
              lineHeight: 1.2,
            }}
          >
            Put this into practice.
          </p>
          <p className="text-slate-400 text-sm mx-auto max-w-sm" style={{ lineHeight: 1.7 }}>
            Soro Soke gives you spaced repetition, high-stakes speaking practice, and Small Talk Lab — all in one place. Free to use.
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
                className="group rounded-xl border border-white/10 bg-white/3 p-4 transition hover:border-white/20 hover:bg-white/8"
              >
                <p className="mb-1 text-xs text-slate-500">← Previous</p>
                <p
                  className="text-sm font-medium text-slate-300 transition group-hover:text-slate-100"
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
                  className="text-sm font-medium text-slate-300 transition group-hover:text-slate-100"
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

      <MarketingFooter />
    </div>
  );
}
