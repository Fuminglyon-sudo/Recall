// Simple in-memory rate limiter. Resets per window on the same serverless
// instance. Not shared across instances — upgrade to Upstash Redis for
// true per-user limits across all edge nodes.

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_BUCKETS = 10_000;

/**
 * Returns true if the caller is within the allowed limit for this scope.
 * Buckets are keyed per-scope so one route's traffic can't drain another
 * route's budget (e.g. a burst of debate exchanges shouldn't lock a user
 * out of debate prep, which has a separate, lower limit).
 * @param scope a per-endpoint namespace, e.g. "debate"
 * @param key   usually `userId` or `ip`
 * @param limit max requests per window
 */
export function checkRateLimit(scope: string, key: string, limit: number): boolean {
  const now = Date.now();

  if (buckets.size > MAX_BUCKETS) {
    for (const [k, b] of buckets) if (now >= b.resetAt) buckets.delete(k);
  }

  const bucketKey = `${scope}:${key}`;
  let bucket = buckets.get(bucketKey);
  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + WINDOW_MS };
    buckets.set(bucketKey, bucket);
  }

  bucket.count += 1;
  return bucket.count <= limit;
}
