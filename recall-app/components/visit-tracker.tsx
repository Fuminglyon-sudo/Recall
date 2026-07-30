"use client";

import { useEffect } from "react";

// Root layout only remounts on a full page load, not on client-side
// navigation between routes — so this naturally fires once per real visit
// rather than once per page, with no extra dedup logic needed.
export function VisitTracker() {
  useEffect(() => {
    fetch("/api/analytics/visit", { method: "POST", keepalive: true }).catch(() => {});
  }, []);
  return null;
}
