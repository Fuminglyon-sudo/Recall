import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { MarketingNav } from "@/components/marketing-nav";
import { MarketingFooter } from "@/components/marketing-footer";
import { PricingContent } from "./pricing-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pricing — Sọrọ Sọkẹ AI",
  description:
    "Sọrọ Sọkẹ AI pricing: free for the first 50 founders, then $9.99/month or $99/year for Pro. 14-day free trial, no card required.",
  keywords: ["Soro Soke pricing", "spaced repetition app price", "vocabulary app subscription", "founder pricing", "free trial"],
  robots: { index: true, follow: true },
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pricing — Sọrọ Sọkẹ AI",
    description: "Free for the first 50 users. Then $9.99/mo or $99/yr. 14-day free trial, no card required.",
    type: "website",
    url: "/pricing",
  },
  twitter: {
    card: "summary",
    title: "Pricing — Sọrọ Sọkẹ AI",
    description: "Free for the first 50 founders. Then $9.99/mo or $99/yr.",
  },
};

async function getFounderData() {
  const [founderSpotsTaken, configRow] = await Promise.all([
    prisma.user.count({ where: { plan: "founder" } }),
    prisma.siteConfig.findUnique({ where: { key: "founder_spots_total" } }),
  ]);
  const founderSpotsTotal = parseInt(configRow?.value ?? "50", 10);
  return { founderSpotsTaken, founderSpotsTotal };
}

export default async function PricingPage() {
  const { founderSpotsTaken, founderSpotsTotal } = await getFounderData();

  return (
    <div className="min-h-screen bg-slate-950 text-white antialiased flex flex-col">
      <MarketingNav />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6">

        {/* ── Hero ── */}
        <section className="py-20 text-center space-y-4 border-b border-white/8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Pricing</p>
          <h1
            className="text-4xl font-extrabold sm:text-5xl"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            Honest pricing.{" "}
            <span style={{ fontStyle: "italic", fontWeight: 400, color: "#86efac" }}>
              Early access included.
            </span>
          </h1>
          <p className="mx-auto max-w-xl text-lg leading-8 text-slate-400">
            The first {founderSpotsTotal} founders get Soro Soke free — forever.
            After that, full access is $9.99/month or $99/year.
          </p>
        </section>

        <PricingContent
          founderSpotsTaken={founderSpotsTaken}
          founderSpotsTotal={founderSpotsTotal}
        />

      </main>

      <MarketingFooter />
    </div>
  );
}
