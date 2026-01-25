import { redis } from '@/lib/redis';

export async function rateLimit({
  key,
  limit,
  windowSeconds
}: {
  key: string;
  limit: number;
  windowSeconds: number;
}) {
  const now = Date.now();
  const windowStart = now - windowSeconds * 1000;
  const redisKey = `ratelimit:${key}`;

  await redis.zremrangebyscore(redisKey, 0, windowStart);
  const count = await redis.zcard(redisKey);

  if (count >= limit) {
    return { allowed: false };
  }

  await redis.zadd(redisKey, now, `${now}`);
  await redis.expire(redisKey, windowSeconds);
  return { allowed: true };
}
