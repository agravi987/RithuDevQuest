import "server-only";

type RateLimitRecord = {
  timestamps: number[];
};

const rateLimitMap = new Map<string, RateLimitRecord>();

const DEFAULT_LIMIT = 10;
const DEFAULT_WINDOW_MS = 60 * 1000; // 1 minute

// Periodically clean up entries older than 2 minutes to prevent memory growth
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      const valid = record.timestamps.filter((ts) => now - ts < DEFAULT_WINDOW_MS * 2);
      if (valid.length === 0) {
        rateLimitMap.delete(key);
      } else {
        rateLimitMap.set(key, { timestamps: valid });
      }
    }
  }, 5 * 60 * 1000).unref?.();
}

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Seconds until full reset
};

export function checkRateLimit(
  key: string,
  limit: number = DEFAULT_LIMIT,
  windowMs: number = DEFAULT_WINDOW_MS,
): RateLimitResult {
  const now = Date.now();
  const record = rateLimitMap.get(key) ?? { timestamps: [] };

  // Filter timestamps within the current sliding window
  const windowStart = now - windowMs;
  const activeTimestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (activeTimestamps.length >= limit) {
    const oldest = activeTimestamps[0] ?? now;
    const reset = Math.ceil((oldest + windowMs - now) / 1000);
    return {
      success: false,
      limit,
      remaining: 0,
      reset: Math.max(1, reset),
    };
  }

  activeTimestamps.push(now);
  rateLimitMap.set(key, { timestamps: activeTimestamps });

  const remaining = Math.max(0, limit - activeTimestamps.length);
  const oldest = activeTimestamps[0] ?? now;
  const reset = Math.ceil((oldest + windowMs - now) / 1000);

  return {
    success: true,
    limit,
    remaining,
    reset: Math.max(1, reset),
  };
}

/** Reset rate limit for testing purposes */
export function _resetRateLimiter(): void {
  rateLimitMap.clear();
}
