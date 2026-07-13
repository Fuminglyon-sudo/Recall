// Simple in-memory rate limiter. Resets per window on the same serverless
// instance. Not shared across instances — upgrade to Upstash Redis for
// true per-user limits across all edge nodes.

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

const WINDOW_MS = 60_000; // 1 minute

/**
 * Returns true if the key is within the allowed limit, false if rate-limited.
 * @param key  usually `userId` or `ip`
 * @param limit max requests per window
 */
export function checkRateLimit(key: string, limit: number): boolean {
  const now = Date.now();
  let bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + WINDOW_MS };
    buckets.set(key, bucket);
  }

  bucket.count += 1;
  return bucket.count <= limit;
}
