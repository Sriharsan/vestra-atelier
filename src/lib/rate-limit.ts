// BACKEND STUB — in production, use Cloudflare Workers KV or Durable Objects for distributed rate limiting.
const windows = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  maxRequests = 10,
  windowMs = 60_000,
): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const entry = windows.get(key);

  if (!entry || now >= entry.resetAt) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (entry.count < maxRequests) {
    entry.count += 1;
    return { allowed: true, retryAfterMs: 0 };
  }

  return { allowed: false, retryAfterMs: entry.resetAt - now };
}
