"use client";

import { useEffect } from "react";
import { TZ_COOKIE_NAME } from "@/lib/date";

// Keeps a cookie refreshed with the browser's UTC offset so server components
// that render a "today" boundary (dashboard overdue counts, the streak
// calendar) can align it with the user's local calendar day instead of the
// server's — the same offset already sent inline with review/practice
// submissions, just made available to plain page loads too.
export function TzSync() {
  useEffect(() => {
    const offset = new Date().getTimezoneOffset();
    document.cookie = `${TZ_COOKIE_NAME}=${offset}; path=/; max-age=31536000; SameSite=Lax`;
  }, []);

  return null;
}
