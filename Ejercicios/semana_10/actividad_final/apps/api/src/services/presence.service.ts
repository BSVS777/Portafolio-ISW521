import { redisConnection } from "../lib/redis.js";
import { prisma } from "../db/index.js";

const ONLINE_SET_KEY = "presence:online";

export async function markOnline(userId: string): Promise<void> {
  await redisConnection.sadd(ONLINE_SET_KEY, userId);
}

export async function markOffline(userId: string): Promise<void> {
  await redisConnection.srem(ONLINE_SET_KEY, userId);
  await prisma.user.update({ where: { id: userId }, data: { lastSeenAt: new Date() } });
}

export async function isOnline(userId: string): Promise<boolean> {
  return (await redisConnection.sismember(ONLINE_SET_KEY, userId)) === 1;
}
