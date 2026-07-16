import fs from "fs";
import path from "path";

// Regression guard for C1: `where: { userId: uid ?? undefined }` silently
// drops the Prisma filter for admin sessions, because Prisma treats
// `undefined` as "no constraint" while `null` correctly matches
// admin-owned rows (scopedUserId() returns null for the admin sentinel).
// That let the env-var admin account read every user's debate/speak-up/
// conversation history and dashboard counts.
//
// lib/session.ts can't be imported directly here without pulling in
// NextAuth + Prisma client construction (which need a live request
// context / DATABASE_URL), so this guards the fix at the source level
// instead: none of the previously-affected files may reintroduce the
// `uid ?? undefined` pattern.

const AFFECTED_FILES = [
  "app/api/debate-sessions/route.ts",
  "app/debate-lab/history/page.tsx",
  "app/debate-lab/history/[id]/page.tsx",
  "app/conversation-lab/history/page.tsx",
  "app/speak-up/history/page.tsx",
  "app/page.tsx",
];

const DANGEROUS_PATTERN = /uid\s*\?\?\s*undefined/;

describe("uid ?? undefined regression guard (C1)", () => {
  for (const relativePath of AFFECTED_FILES) {
    test(`${relativePath} does not use the "uid ?? undefined" pattern`, () => {
      const filePath = path.join(__dirname, "..", relativePath);
      const source = fs.readFileSync(filePath, "utf8");
      expect(DANGEROUS_PATTERN.test(source)).toBe(false);
    });
  }
});
