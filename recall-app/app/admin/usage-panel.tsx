import { Activity, TrendingUp } from "lucide-react";
import type { DayBucket } from "@/lib/usage-stats";

// ── Active-user stat cards ──────────────────────────────────────────────────

function ActiveStat({ label, value, sub }: { label: string; value: number; sub: string }) {
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
      <span style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#64748b" }}>
        {label}
      </span>
      <p style={{ fontSize: "1.75rem", fontWeight: 700, lineHeight: 1, color: "#f1f5f9" }}>
        {value.toLocaleString()}
      </p>
      <p style={{ fontSize: "0.72rem", color: "#475569" }}>{sub}</p>
    </div>
  );
}

// ── 14-day trend mini bar chart ─────────────────────────────────────────────

function MiniBarChart({ title, buckets, color }: { title: string; buckets: DayBucket[]; color: string }) {
  const max = Math.max(1, ...buckets.map((b) => b.count));
  const total = buckets.reduce((sum, b) => sum + b.count, 0);

  return (
    <div
      style={{
        borderRadius: "1rem",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.03)",
        padding: "1.25rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.9rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <span style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#64748b" }}>
          {title}
        </span>
        <span style={{ fontSize: "0.72rem", color: "#475569" }}>{total.toLocaleString()} in 14 days</span>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "56px" }}>
        {buckets.map((b) => (
          <div
            key={b.key}
            title={`${b.label}: ${b.count}`}
            style={{ flex: 1, height: "100%", display: "flex", alignItems: "flex-end" }}
          >
            <div
              style={{
                width: "100%",
                height: `${Math.max(3, (b.count / max) * 100)}%`,
                background: color,
                borderRadius: "2px 2px 0 0",
                opacity: b.count === 0 ? 0.15 : 1,
              }}
            />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", color: "#475569" }}>
        <span>{buckets[0]?.label}</span>
        <span>{buckets[buckets.length - 1]?.label}</span>
      </div>
    </div>
  );
}

// ── Feature usage breakdown ─────────────────────────────────────────────────

export type FeatureUsage = {
  label: string;
  total: number;
  recent30d: number;
  color: string;
};

function FeatureBar({ feature, max }: { feature: FeatureUsage; max: number }) {
  const pct = max > 0 ? (feature.total / max) * 100 : 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "#cbd5e1" }}>{feature.label}</span>
        <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
          {feature.total.toLocaleString()} total · {feature.recent30d.toLocaleString()} in 30d
        </span>
      </div>
      <div style={{ height: "8px", borderRadius: "4px", background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: feature.color, borderRadius: "4px" }} />
      </div>
    </div>
  );
}

// ── Panel ────────────────────────────────────────────────────────────────────

export function UsagePanel({
  activeToday,
  activeWeek,
  activeMonth,
  signupBuckets,
  reviewBuckets,
  features,
}: {
  activeToday: number;
  activeWeek: number;
  activeMonth: number;
  signupBuckets: DayBucket[];
  reviewBuckets: DayBucket[];
  features: FeatureUsage[];
}) {
  const maxFeatureTotal = Math.max(1, ...features.map((f) => f.total));

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Activity className="h-3.5 w-3.5" style={{ color: "#475569" }} />
        <h2 style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#475569" }}>
          Usage
        </h2>
      </div>

      {/* Active users — defined the same way the app's own streak logic
          defines "active": any completed review, Speak Up, Conversation
          Lab, or Debate Lab session. Excludes the env-var admin account. */}
      <div style={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
        <ActiveStat label="Active today" value={activeToday} sub="Practiced something today" />
        <ActiveStat label="Active this week" value={activeWeek} sub="Practiced in the last 7 days" />
        <ActiveStat label="Active this month" value={activeMonth} sub="Practiced in the last 30 days" />
      </div>

      {/* 14-day trends */}
      <div style={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        <MiniBarChart title="New signups" buckets={signupBuckets} color="#4ade80" />
        <MiniBarChart title="Reviews per day" buckets={reviewBuckets} color="#6ee7b7" />
      </div>

      {/* Feature usage breakdown */}
      <div
        style={{
          borderRadius: "1rem",
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.03)",
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <TrendingUp className="h-3.5 w-3.5" style={{ color: "#64748b" }} />
          <h3 style={{ fontSize: "0.78rem", fontWeight: 700, color: "#e2e8f0" }}>Feature usage</h3>
        </div>
        {features.map((f) => (
          <FeatureBar key={f.label} feature={f} max={maxFeatureTotal} />
        ))}
      </div>
    </section>
  );
}
