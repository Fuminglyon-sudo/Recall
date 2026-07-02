---
name: project-recall
description: Recall app — tech stack, architecture, auth system, known gaps identified in July 2026 audit
metadata:
  type: project
---

Next.js 16 full-stack spaced-repetition app at `/Users/priscillapc/Documents/Recall/recall-app`.

**Stack:** Next.js 16 / React 19, Prisma + PostgreSQL (Supabase EU), NextAuth v5 (Google OAuth), Anthropic claude-sonnet-4-6, Tailwind v4, Zod.

**Auth:** Dual — env-var admin (HMAC cookie `recall_session`) and Google OAuth (NextAuth JWT). Admin identity = `__admin__`, Prisma userId = null for admin-owned rows.

**Key lib files:**
- `lib/session.ts` — `getCurrentUserId()`, `isAdmin()`, `scopedUserId()`
- `lib/auth.ts` — `createSessionToken()`, `checkCredentials()`
- `lib/anthropic.ts` — all Claude API calls (card draft, social/pitch/speak conversations, sentence challenge, phrase-in-voice)
- `lib/sm2.ts` — SM-2 spaced repetition algorithm
- `lib/mastery.ts` — mastery levels (new/learning/familiar/mastered) by interval

**Features:**
- Core: flashcard review (SM-2), decks, daily queue, free recall, sentence challenge, countries
- AI-assisted: card drafting, pitch practice, social skills lab, speak-up coaching, founder batch word generation, phrase-it (voice matching)
- All features are now open to all authenticated users (admin guard removed July 2026)

**Why admin guards were removed:** Pitch practice, social skills, saved sessions, founder-words were unnecessarily admin-only. All authenticated Google users should be able to use these.

**How to apply:** When adding new features, do NOT add `isAdmin()` guards unless the feature genuinely requires admin privilege (e.g., seeding global data). User-scoped features should use `getCurrentUserId()` + `scopedUserId()`.
