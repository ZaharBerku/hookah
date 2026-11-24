type RateLimiterOptions = {
  limit: number;
  windowMs: number;
  maxKeys?: number;
};

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

export const createRateLimiter = ({
  limit,
  windowMs,
  maxKeys = 5000
}: RateLimiterOptions) => {
  const hits = new Map<string, number[]>();

  const prune = (now: number) => {
    hits.forEach((timestamps, key) => {
      if (timestamps[timestamps.length - 1] <= now - windowMs) hits.delete(key);
    });
    while (hits.size >= maxKeys) {
      hits.delete(hits.keys().next().value as string);
    }
  };

  return {
    check(key: string, now: number = Date.now()): RateLimitResult {
      const recent = (hits.get(key) || []).filter(
        (timestamp) => timestamp > now - windowMs
      );
      if (recent.length >= limit) {
        hits.set(key, recent);
        return {
          allowed: false,
          retryAfterSeconds: Math.ceil((recent[0] + windowMs - now) / 1000)
        };
      }
      if (!hits.has(key) && hits.size >= maxKeys) prune(now);
      hits.delete(key);
      hits.set(key, [...recent, now]);
      return { allowed: true, retryAfterSeconds: 0 };
    }
  };
};
