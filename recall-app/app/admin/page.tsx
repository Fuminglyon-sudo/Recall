import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { UsersTable } from "./users-table";
import { UsagePanel, type FeatureUsage } from "./usage-panel";
import { upsertSiteConfig } from "./actions";
import { bucketCountsByDay } from "@/lib/usage-stats";
import { Users, Crown, Zap, BarChart2, Settings, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

// ── Data fetching ────────────────────────────────────────────────────────────

// Non-null userId excludes the env-var admin's own rows (admin-owned decks,
// streak, and sessions all carry userId: null) — otherwise the founder's
// own testing/QA activity would inflate "active users" and feature usage.
const REAL_USER = { userId: { not: null as string | null } };

async function getData() {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const fourteenDaysAgo = new Date(now);
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
  fourteenDaysAgo.setHours(0, 0, 0, 0);

  const realReviewLog = { card: { deck: { userId: { not: null as string | null } } } };

  const [
    users,
    founderConfig,
    totalReviews,
    pushCount,
    activeToday,
    activeWeek,
    activeMonth,
    newUsersRaw,
    reviewsRaw,
    reviewsRecent30d,
    speakUpTotal,
    speakUpRecent30d,
    socialTotal,
    socialRecent30d,
    debateTotal,
    debateRecent30d,
  ] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        plan: true,
        planStartedAt: true,
        _count: {
          select: { decks: true },
        },
        decks: {
          select: {
            cards: {
              select: { _count: { select: { reviewLogs: true } } },
            },
          },
        },
      },
    }),
    prisma.siteConfig.findUnique({ where: { key: "founder_spots_total" } }),
    prisma.reviewLog.count({ where: realReviewLog }),
    prisma.pushSubscription.count(),
    // Active users — "active" mirrors lib/record-activity.ts's own
    // definition (any review, Speak Up, Small Talk Lab, or Debate Lab
    // session), since every one of those updates Streak.lastReviewDate.
    prisma.streak.count({ where: { ...REAL_USER, lastReviewDate: { gte: todayStart } } }),
    prisma.streak.count({ where: { ...REAL_USER, lastReviewDate: { gte: sevenDaysAgo } } }),
    prisma.streak.count({ where: { ...REAL_USER, lastReviewDate: { gte: thirtyDaysAgo } } }),
    prisma.user.findMany({ where: { createdAt: { gte: fourteenDaysAgo } }, select: { createdAt: true } }),
    prisma.reviewLog.findMany({ where: { ...realReviewLog, reviewedAt: { gte: fourteenDaysAgo } }, select: { reviewedAt: true } }),
    prisma.reviewLog.count({ where: { ...realReviewLog, reviewedAt: { gte: thirtyDaysAgo } } }),
    prisma.speakUpSession.count({ where: REAL_USER }),
    prisma.speakUpSession.count({ where: { ...REAL_USER, createdAt: { gte: thirtyDaysAgo } } }),
    prisma.socialSession.count({ where: REAL_USER }),
    prisma.socialSession.count({ where: { ...REAL_USER, createdAt: { gte: thirtyDaysAgo } } }),
    prisma.debateSession.count({ where: REAL_USER }),
    prisma.debateSession.count({ where: { ...REAL_USER, createdAt: { gte: thirtyDaysAgo } } }),
  ]);

  const founderTotal = parseInt(founderConfig?.value ?? "50", 10);

  const usage = {
    activeToday,
    activeWeek,
    activeMonth,
    signupBuckets: bucketCountsByDay(newUsersRaw.map((u) => u.createdAt), 14, now),
    reviewBuckets: bucketCountsByDay(reviewsRaw.map((r) => r.reviewedAt), 14, now),
    features: [
      { label: "Card reviews", total: totalReviews, recent30d: reviewsRecent30d, color: "#4ade80" },
      { label: "Speak Up", total: speakUpTotal, recent30d: speakUpRecent30d, color: "#38bdf8" },
      { label: "Small Talk Lab", total: socialTotal, recent30d: socialRecent30d, color: "#a78bfa" },
      { label: "Debate Lab", total: debateTotal, recent30d: debateRecent30d, color: "#fbbf24" },
    ] satisfies FeatureUsage[],
  };

  const enriched = users.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    createdAt: u.createdAt,
    plan: u.plan,
    planStartedAt: u.planStartedAt,
    deckCount: u._count.decks,
    cardCount: u.decks.flatMap((d) => d.cards).length,
    reviewCount: u.decks
      .flatMap((d) => d.cards)
      .reduce((sum, c) => sum + c._count.reviewLogs, 0),
  }));

  const founderCount = enriched.filter((u) => u.plan === "founder").length;
  const proCount = enriched.filter((u) => u.plan === "pro").length;
  const freeCount = enriched.filter((u) => u.plan === "free").length;

  return {
    users: enriched,
    stats: {
      total: enriched.length,
      founders: founderCount,
      pro: proCount,
      free: freeCount,
      totalReviews,
      pushCount,
    },
    founderTotal,
    usage,
  };
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}) {
  return (
    <div
      style={{
        borderRadius: "1rem",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.03)",
        padding: "1.25rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Icon className="h-4 w-4 text-slate-500" />
        <span style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#64748b" }}>
          {label}
        </span>
      </div>
      <p style={{ fontSize: "1.75rem", fontWeight: 700, lineHeight: 1, color: accent ?? "#f1f5f9" }}>
        {value.toLocaleString()}
      </p>
      {sub && <p style={{ fontSize: "0.72rem", color: "#475569" }}>{sub}</p>}
    </div>
  );
}

// ── Site config form (inline server action) ────────────────────────────────

function SiteConfigPanel({ founderTotal }: { founderTotal: number }) {
  return (
    <section
      style={{
        borderRadius: "1rem",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.03)",
        padding: "1.5rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
        <Settings className="h-4 w-4 text-slate-500" />
        <h2 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#e2e8f0" }}>Site configuration</h2>
      </div>

      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>

        {/* Founder spots total */}
        <form
          action={async (fd: FormData) => {
            "use server";
            const v = fd.get("value")?.toString().trim() ?? "";
            if (/^\d+$/.test(v)) await upsertSiteConfig("founder_spots_total", v);
          }}
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <label style={{ fontSize: "0.72rem", fontWeight: 600, color: "#94a3b8", letterSpacing: "0.04em" }}>
            Founder spots — total available
          </label>
          <p style={{ fontSize: "0.68rem", color: "#475569", lineHeight: 1.5 }}>
            Shown on /pricing as the capacity. Currently <strong style={{ color: "#94a3b8" }}>{founderTotal}</strong>.
          </p>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              name="value"
              type="number"
              min={1}
              max={9999}
              defaultValue={founderTotal}
              style={{
                flex: 1,
                borderRadius: "0.6rem",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.05)",
                color: "#e2e8f0",
                padding: "0.4em 0.75em",
                fontSize: "0.82rem",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                borderRadius: "0.6rem",
                background: "rgba(52,211,153,0.15)",
                border: "1px solid rgba(52,211,153,0.3)",
                color: "#6ee7b7",
                padding: "0.4em 1em",
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Save
            </button>
          </div>
        </form>

        {/* Announcement banner */}
        <form
          action={async (fd: FormData) => {
            "use server";
            const v = fd.get("value")?.toString().trim() ?? "";
            await upsertSiteConfig("announcement", v);
          }}
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <label style={{ fontSize: "0.72rem", fontWeight: 600, color: "#94a3b8", letterSpacing: "0.04em" }}>
            Announcement banner
          </label>
          <p style={{ fontSize: "0.68rem", color: "#475569", lineHeight: 1.5 }}>
            Shown at the top of every page. Leave blank to hide.
          </p>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              name="value"
              type="text"
              placeholder="e.g. We're back from maintenance…"
              style={{
                flex: 1,
                borderRadius: "0.6rem",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.05)",
                color: "#e2e8f0",
                padding: "0.4em 0.75em",
                fontSize: "0.82rem",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                borderRadius: "0.6rem",
                background: "rgba(52,211,153,0.15)",
                border: "1px solid rgba(52,211,153,0.3)",
                color: "#6ee7b7",
                padding: "0.4em 1em",
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Save
            </button>
          </div>
        </form>

      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/login");

  const { users, stats, founderTotal, usage } = await getData();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "#e2e8f0",
        fontFamily: "var(--font-geist-sans), Arial, sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(2,6,23,0.92)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        <div
          style={{
            maxWidth: "72rem",
            margin: "0 auto",
            padding: "0 1.5rem",
            height: "3.75rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.78rem",
              color: "#64748b",
              textDecoration: "none",
              transition: "color 150ms",
            }}
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
          </Link>
          <span style={{ color: "rgba(255,255,255,0.12)" }}>·</span>
          <h1 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#f1f5f9" }}>
            Admin — Sọrọ Sọkẹ AI
          </h1>
          <span
            style={{
              marginLeft: "auto",
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "0.25em 0.65em",
              borderRadius: "9999px",
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#fca5a5",
            }}
          >
            Admin
          </span>
        </div>
      </header>

      <main style={{ maxWidth: "72rem", margin: "0 auto", padding: "2rem 1.5rem", display: "flex", flexDirection: "column", gap: "2rem" }}>

        {/* Stats */}
        <section>
          <h2 style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#475569", marginBottom: "0.75rem" }}>
            Overview
          </h2>
          <div style={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
            <StatCard icon={Users}    label="Total users"   value={stats.total} />
            <StatCard icon={Crown}    label="Founders"      value={stats.founders} sub={`${founderTotal - stats.founders} spots left`} accent="#6ee7b7" />
            <StatCard icon={Zap}      label="Pro"           value={stats.pro}     accent="#93c5fd" />
            <StatCard icon={Users}    label="Free"          value={stats.free} />
            <StatCard icon={BarChart2} label="Total reviews" value={stats.totalReviews} />
            <StatCard icon={Users}    label="Push subs"     value={stats.pushCount} />
          </div>
        </section>

        {/* Usage */}
        <UsagePanel {...usage} />

        {/* Site config */}
        <SiteConfigPanel founderTotal={founderTotal} />

        {/* Users */}
        <section>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <h2 style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#475569" }}>
              Subscribers
            </h2>
            <a
              href="/admin/export"
              style={{ fontSize: "0.72rem", color: "#4ade80", textDecoration: "none" }}
            >
              Export CSV ↓
            </a>
          </div>
          <UsersTable users={users} />
        </section>

      </main>
    </div>
  );
}
