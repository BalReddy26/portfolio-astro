export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number };

type Bucket = {
  windowStartMs: number;
  count: number;
};

// Minimal in-memory rate limiting.
// Note: in-memory works for a single instance; for production across instances
// you would use durable storage (e.g., KV/D1). This is intentionally mockable.
export class InMemoryRateLimiter {
  private buckets = new Map<string, Bucket>();

  constructor(
    private options: {
      windowMs: number;
      max: number;
    }
  ) {}

  check(key: string, nowMs: number = Date.now()): RateLimitResult {
    const bucket = this.buckets.get(key);

    if (!bucket) {
      this.buckets.set(key, { windowStartMs: nowMs, count: 1 });
      return { allowed: true };
    }

    const elapsed = nowMs - bucket.windowStartMs;
    if (elapsed >= this.options.windowMs) {
      this.buckets.set(key, { windowStartMs: nowMs, count: 1 });
      return { allowed: true };
    }

    if (bucket.count < this.options.max) {
      bucket.count += 1;
      return { allowed: true };
    }

    const retryAfterMs = this.options.windowMs - elapsed;
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil(retryAfterMs / 1000)
    };
  }
}

