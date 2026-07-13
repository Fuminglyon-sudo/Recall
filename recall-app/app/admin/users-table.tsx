"use client";

import { useState, useTransition, useMemo } from "react";
import { updateUserPlan, deleteUser } from "./actions";
import { Search, Trash2, ChevronUp, ChevronDown } from "lucide-react";

type Plan = "free" | "founder" | "pro";

type User = {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  plan: string;
  planStartedAt: Date | null;
  deckCount: number;
  cardCount: number;
  reviewCount: number;
};

const PLAN_STYLES: Record<string, { label: string; color: string; bg: string; border: string }> = {
  founder: {
    label: "Founder",
    color: "#6ee7b7",
    bg: "rgba(52,211,153,0.12)",
    border: "rgba(52,211,153,0.3)",
  },
  pro: {
    label: "Pro",
    color: "#93c5fd",
    bg: "rgba(147,197,253,0.1)",
    border: "rgba(147,197,253,0.25)",
  },
  free: {
    label: "Free",
    color: "#94a3b8",
    bg: "rgba(148,163,184,0.08)",
    border: "rgba(148,163,184,0.15)",
  },
};

function PlanBadge({ plan }: { plan: string }) {
  const s = PLAN_STYLES[plan] ?? PLAN_STYLES.free;
  return (
    <span
      style={{
        fontSize: "0.65rem",
        fontWeight: 700,
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        padding: "0.2em 0.6em",
        borderRadius: "9999px",
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.border}`,
      }}
    >
      {s.label}
    </span>
  );
}

function PlanPicker({
  userId,
  current,
}: {
  userId: string;
  current: string;
}) {
  const [pending, startTransition] = useTransition();
  const [value, setValue] = useState<Plan>(current as Plan);

  function handleChange(next: Plan) {
    setValue(next);
    startTransition(async () => {
      await updateUserPlan(userId, next);
    });
  }

  return (
    <select
      value={value}
      onChange={(e) => handleChange(e.target.value as Plan)}
      disabled={pending}
      style={{
        fontSize: "0.75rem",
        padding: "0.25em 0.6em",
        borderRadius: "0.5rem",
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(255,255,255,0.05)",
        color: "#e2e8f0",
        cursor: pending ? "wait" : "pointer",
        opacity: pending ? 0.6 : 1,
      }}
    >
      <option value="free">Free</option>
      <option value="founder">Founder</option>
      <option value="pro">Pro</option>
    </select>
  );
}

function DeleteButton({ userId }: { userId: string }) {
  const [pending, startTransition] = useTransition();
  const [confirm, setConfirm] = useState(false);

  if (!confirm) {
    return (
      <button
        onClick={() => setConfirm(true)}
        className="text-slate-600 transition hover:text-red-400"
        title="Delete user"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    );
  }

  return (
    <span className="flex items-center gap-1">
      <button
        onClick={() => startTransition(async () => { await deleteUser(userId); })}
        disabled={pending}
        style={{
          fontSize: "0.65rem",
          padding: "0.2em 0.5em",
          borderRadius: "0.4rem",
          background: "rgba(239,68,68,0.15)",
          border: "1px solid rgba(239,68,68,0.3)",
          color: "#fca5a5",
          cursor: pending ? "wait" : "pointer",
        }}
      >
        {pending ? "…" : "Confirm"}
      </button>
      <button
        onClick={() => setConfirm(false)}
        style={{ fontSize: "0.65rem", color: "#64748b" }}
      >
        Cancel
      </button>
    </span>
  );
}

type SortKey = "createdAt" | "plan" | "deckCount" | "reviewCount";

export function UsersTable({ users }: { users: User[] }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [planFilter, setPlanFilter] = useState<"all" | Plan>("all");

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return users
      .filter((u) => {
        const matchesSearch =
          !q ||
          u.email.toLowerCase().includes(q) ||
          (u.name ?? "").toLowerCase().includes(q);
        const matchesPlan = planFilter === "all" || u.plan === planFilter;
        return matchesSearch && matchesPlan;
      })
      .sort((a, b) => {
        let av: number | string, bv: number | string;
        if (sortKey === "createdAt") { av = a.createdAt.getTime(); bv = b.createdAt.getTime(); }
        else if (sortKey === "plan") { av = a.plan; bv = b.plan; }
        else if (sortKey === "deckCount") { av = a.deckCount; bv = b.deckCount; }
        else { av = a.reviewCount; bv = b.reviewCount; }
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [users, query, planFilter, sortKey, sortDir]);

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return null;
    return sortDir === "asc"
      ? <ChevronUp className="inline h-3 w-3 ml-0.5" />
      : <ChevronDown className="inline h-3 w-3 ml-0.5" />;
  }

  function th(label: string, k: SortKey) {
    return (
      <th
        onClick={() => toggleSort(k)}
        style={{
          padding: "0.65rem 1rem",
          textAlign: "left",
          fontSize: "0.7rem",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#64748b",
          cursor: "pointer",
          userSelect: "none",
          whiteSpace: "nowrap",
        }}
      >
        {label}<SortIcon k={k} />
      </th>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2"
          style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", minWidth: "220px" }}
        >
          <Search className="h-3.5 w-3.5 shrink-0 text-slate-500" />
          <input
            type="text"
            placeholder="Search email or name…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: "0.8rem",
              color: "#e2e8f0",
              width: "100%",
            }}
          />
        </div>
        <div className="flex gap-1">
          {(["all", "free", "founder", "pro"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPlanFilter(p)}
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                padding: "0.3em 0.75em",
                borderRadius: "9999px",
                border: "1px solid",
                borderColor: planFilter === p ? "rgba(52,211,153,0.4)" : "rgba(255,255,255,0.1)",
                background: planFilter === p ? "rgba(52,211,153,0.1)" : "rgba(255,255,255,0.03)",
                color: planFilter === p ? "#6ee7b7" : "#94a3b8",
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {p === "all" ? "All plans" : p}
            </button>
          ))}
        </div>
        <span style={{ fontSize: "0.75rem", color: "#64748b", marginLeft: "auto" }}>
          {filtered.length} user{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", borderRadius: "1rem", border: "1px solid rgba(255,255,255,0.08)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
          <thead style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <tr>
              <th style={{ padding: "0.65rem 1rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#64748b", whiteSpace: "nowrap" }}>
                User
              </th>
              {th("Joined", "createdAt")}
              {th("Plan", "plan")}
              {th("Decks", "deckCount")}
              {th("Reviews", "reviewCount")}
              <th style={{ padding: "0.65rem 1rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#64748b" }}>
                Change plan
              </th>
              <th style={{ padding: "0.65rem 1rem", width: "2rem" }} />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: "#475569", fontSize: "0.8rem" }}>
                  No users match your filters.
                </td>
              </tr>
            )}
            {filtered.map((u, i) => (
              <tr
                key={u.id}
                style={{
                  borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.05)",
                  transition: "background 150ms",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "0.7rem 1rem", maxWidth: "260px" }}>
                  <p style={{ color: "#e2e8f0", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {u.name ?? <span style={{ color: "#475569" }}>—</span>}
                  </p>
                  <p style={{ fontSize: "0.72rem", color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {u.email}
                  </p>
                </td>
                <td style={{ padding: "0.7rem 1rem", color: "#64748b", whiteSpace: "nowrap" }}>
                  {u.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td style={{ padding: "0.7rem 1rem" }}>
                  <PlanBadge plan={u.plan} />
                </td>
                <td style={{ padding: "0.7rem 1rem", color: "#94a3b8", textAlign: "right" }}>
                  {u.deckCount}
                </td>
                <td style={{ padding: "0.7rem 1rem", color: "#94a3b8", textAlign: "right" }}>
                  {u.reviewCount.toLocaleString()}
                </td>
                <td style={{ padding: "0.7rem 1rem" }}>
                  <PlanPicker userId={u.id} current={u.plan} />
                </td>
                <td style={{ padding: "0.7rem 0.75rem", textAlign: "center" }}>
                  <DeleteButton userId={u.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
