const buckets = new Map<string, { count: number; resetAt: number }>();

/** Instance-local burst protection; distributed quotas require shared storage. */
export function takeRateLimit(key: string, limit: number, now = Date.now()): boolean {
  const bucket = buckets.get(key);
  if (bucket && bucket.resetAt > now) {
    if (bucket.count >= limit) return false;
    bucket.count++;
    return true;
  }
  for (const [id, value] of buckets) if (value.resetAt <= now) buckets.delete(id);
  if (buckets.size >= 2048) return false;
  buckets.set(key, { count: 1, resetAt: now + 60000 });
  return true;
}
