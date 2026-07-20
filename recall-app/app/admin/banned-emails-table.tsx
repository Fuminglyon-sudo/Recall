"use client";

import { useTransition } from "react";
import { unbanEmail } from "./actions";

type BannedEmail = { email: string; reason: string | null; bannedAt: Date };

function UnbanButton({ email }: { email: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      onClick={() => startTransition(async () => { await unbanEmail(email); })}
      disabled={pending}
      style={{
        fontSize: "0.7rem",
        fontWeight: 600,
        padding: "0.25em 0.7em",
        borderRadius: "0.5rem",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.12)",
        color: "#94a3b8",
        cursor: pending ? "wait" : "pointer",
      }}
    >
      {pending ? "…" : "Unban"}
    </button>
  );
}

export function BannedEmailsTable({ bans }: { bans: BannedEmail[] }) {
  if (bans.length === 0) {
    return <p style={{ fontSize: "0.78rem", color: "#475569", padding: "0.5rem 0" }}>No banned emails.</p>;
  }

  return (
    <div style={{ overflowX: "auto", borderRadius: "1rem", border: "1px solid rgba(255,255,255,0.08)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
        <thead style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <tr>
            <th style={{ padding: "0.65rem 1rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#64748b" }}>
              Email
            </th>
            <th style={{ padding: "0.65rem 1rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#64748b" }}>
              Reason
            </th>
            <th style={{ padding: "0.65rem 1rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#64748b", whiteSpace: "nowrap" }}>
              Banned
            </th>
            <th style={{ padding: "0.65rem 1rem", width: "5rem" }} />
          </tr>
        </thead>
        <tbody>
          {bans.map((b, i) => (
            <tr key={b.email} style={{ borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding: "0.7rem 1rem", color: "#e2e8f0" }}>{b.email}</td>
              <td style={{ padding: "0.7rem 1rem", color: "#94a3b8" }}>{b.reason ?? "—"}</td>
              <td style={{ padding: "0.7rem 1rem", color: "#64748b", whiteSpace: "nowrap" }}>
                {b.bannedAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </td>
              <td style={{ padding: "0.7rem 1rem" }}>
                <UnbanButton email={b.email} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
