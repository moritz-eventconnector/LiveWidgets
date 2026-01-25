import { redis } from '@/lib/redis';

type RealtimeMessage = {
  event: string;
  room: string;
  payload: unknown;
};

export async function publishRealtime(message: RealtimeMessage) {
  await redis.publish('livewidgets:realtime', JSON.stringify(message));
}
