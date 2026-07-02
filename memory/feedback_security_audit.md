---
name: feedback-security-audit
description: Security and UX changes applied during July 2026 full-codebase audit — what was fixed and what remains
metadata:
  type: feedback
---

Full audit run 2026-07-01. Changes applied:

**Fixed:**
- Security headers added to `next.config.ts` (X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy, HSTS)
- Login brute-force protection: in-memory rate limiter (10 attempts / 15 min per IP) in `app/login/actions.ts`
- Social sessions API (`app/api/social-sessions/route.ts` and `[id]/route.ts`) now checks auth and scopes all reads/writes/deletes to the current user's `userId`
- Admin-only guards removed from pitch-practice, social-skills, saved-sessions, founder-words pages
- `founder-words/page.tsx` deck query now scoped to current user (was fetching all decks)
- Sidebar now shows logged-in user name/email with "admin" badge; all features visible to all authenticated users

**Still open (not fixed — out of scope or needs external tooling):**
- `.env` with real credentials committed to git — user must rotate DB, Anthropic key, admin password, and regenerate AUTH_SECRET (32+ random chars), and add `.env` to `.gitignore`
- Weak `AUTH_SECRET` (`recall-session-s3cr3t-key-2026`) — must be rotated
- HMAC token payload is constant string "authenticated" — no timestamp/nonce, so token is replayable if secret leaks
- No CSP header — requires nonce setup in Next.js to avoid breaking things
- No tests
- Free recall doesn't feed back into SM-2 scheduling
- No export/import for cards
- No notifications/reminders for due reviews

**Why:** Security gaps were partially closed to reduce immediate risk; credential rotation must be done manually by the user outside the codebase.
