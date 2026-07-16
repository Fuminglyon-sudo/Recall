import { checkRateLimit } from "@/lib/rate-limit";

// Each test uses its own scope/key names so the shared module-level bucket
// map never leaks state between tests.

describe("checkRateLimit", () => {
  test("allows requests up to the limit", () => {
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit("scopeA", "user1", 5)).toBe(true);
    }
  });

  test("blocks the request that exceeds the limit", () => {
    for (let i = 0; i < 3; i++) {
      expect(checkRateLimit("scopeB", "user1", 3)).toBe(true);
    }
    expect(checkRateLimit("scopeB", "user1", 3)).toBe(false);
  });

  test("different scopes for the same key have independent budgets", () => {
    // This is the exact bug S3 fixed: /api/debate (limit 30) and
    // /api/debate-prep (limit 20) used to share one counter keyed only by
    // userId, so bursts on one route could lock a user out of the other.
    for (let i = 0; i < 2; i++) {
      expect(checkRateLimit("debate", "user2", 2)).toBe(true);
    }
    expect(checkRateLimit("debate", "user2", 2)).toBe(false);
    // A different scope, same user, same moment — must not be affected.
    expect(checkRateLimit("debate-prep", "user2", 2)).toBe(true);
  });

  test("different keys within the same scope have independent budgets", () => {
    for (let i = 0; i < 2; i++) {
      expect(checkRateLimit("scopeC", "userA", 2)).toBe(true);
    }
    expect(checkRateLimit("scopeC", "userA", 2)).toBe(false);
    expect(checkRateLimit("scopeC", "userB", 2)).toBe(true);
  });

  test("the window resets after it elapses", () => {
    jest.useFakeTimers();
    try {
      jest.setSystemTime(0);
      expect(checkRateLimit("scopeD", "user3", 1)).toBe(true);
      expect(checkRateLimit("scopeD", "user3", 1)).toBe(false);

      jest.setSystemTime(61_000); // past the 60s window
      expect(checkRateLimit("scopeD", "user3", 1)).toBe(true);
    } finally {
      jest.useRealTimers();
    }
  });
});
