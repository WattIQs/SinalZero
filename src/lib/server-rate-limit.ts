import { getRequestHeader } from "@tanstack/react-start/server";
import { createMiddleware } from "@tanstack/react-start";

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 5000;

function clientKey(scope: string): string {
  const forwarded = getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = getRequestHeader("x-real-ip")?.trim();
  const ip = forwarded || realIp || "unknown";
  return `${scope}:${ip}`;
}

function enforce(scope: string, limit: number, windowMs: number): void {
  const now = Date.now();
  const key = clientKey(scope);
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    if (buckets.size >= MAX_BUCKETS) {
      for (const [bucketKey, bucket] of buckets) {
        if (bucket.resetAt <= now) buckets.delete(bucketKey);
        if (buckets.size < MAX_BUCKETS) break;
      }
    }
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (current.count >= limit) {
    throw new Error("Muitas solicitações. Aguarde alguns segundos e tente novamente.");
  }

  current.count += 1;
}

export const searchRateLimitMiddleware = createMiddleware().server(async ({ next }) => {
  enforce("search", 30, 60_000);
  return next();
});

export const scanRateLimitMiddleware = createMiddleware().server(async ({ next }) => {
  enforce("scan", 8, 60_000);
  return next();
});

export const verificationRateLimitMiddleware = createMiddleware().server(async ({ next }) => {
  enforce("verify", 12, 60_000);
  return next();
});
