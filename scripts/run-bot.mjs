import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import Redis from 'ioredis';
import tmi from 'tmi.js';

dotenv.config();

const prisma = new PrismaClient();

const redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL)
  : new Redis({
      host: process.env.REDIS_HOST ?? 'redis',
      port: Number(process.env.REDIS_PORT ?? 6379),
      password: process.env.REDIS_PASSWORD
    });

const channels = await prisma.channel.findMany({
  select: { twitchBroadcasterLogin: true, id: true }
});

const client = new tmi.Client({
  options: { debug: false },
  identity: {
    username: process.env.BOT_TWITCH_USERNAME,
    password: process.env.BOT_TWITCH_OAUTH_TOKEN
  },
  channels: channels.map((channel) => channel.twitchBroadcasterLogin)
});

const isModerator = (tags) =>
  Boolean(tags.mod) || Boolean(tags.badges?.broadcaster);

const publishRealtime = async ({ event, room, payload }) => {
  await redis.publish(
    'livewidgets:realtime',
    JSON.stringify({ event, room, payload })
  );
};

client.on('message', async (channelName, tags, message, self) => {
  if (self) return;
  const [command, ...rest] = message.trim().split(' ');
  const channel = channels.find(
    (entry) => `#${entry.twitchBroadcasterLogin}` === channelName
  );
  if (!channel) return;
  const displayName = tags['display-name'] ?? tags.username ?? 'viewer';
  const appUrl = process.env.APP_URL ?? (process.env.DOMAIN ? `https://${process.env.DOMAIN}` : '');

  if (command === '!sr' && rest[0] === 'clear' && isModerator(tags)) {
    await prisma.slotRequest.deleteMany({
      where: { channelId: channel.id }
    });
    await publishRealtime({
      event: 'slot-requests:update',
      room: `channel:${channel.id}`,
      payload: { queue: [] }
    });
    client.say(channelName, 'Slot Request Queue wurde geleert.');
    return;
  }

  if (command === '!sr' && rest[0] === 'pick' && isModerator(tags)) {
    const next = await prisma.slotRequest.findFirst({
      where: { channelId: channel.id, status: 'QUEUED' },
      orderBy: { createdAt: 'asc' }
    });
    if (!next) {
      client.say(channelName, 'Keine Slot Requests vorhanden.');
      return;
    }
    await prisma.slotRequest.update({
      where: { id: next.id },
      data: { status: 'PICKED' }
    });
    const queue = await prisma.slotRequest.findMany({
      where: { channelId: channel.id, status: 'QUEUED' },
      orderBy: { createdAt: 'asc' }
    });
    await publishRealtime({
      event: 'slot-requests:update',
      room: `channel:${channel.id}`,
      payload: { queue: queue.map((item) => item.slotName) }
    });
    client.say(channelName, `Picked: ${next.slotName}`);
    return;
  }

  if (command === '!sr' && rest.length) {
    const slotName = rest.join(' ');
    await prisma.slotRequest.create({
      data: {
        slotName,
        requestedBy: displayName,
        channelId: channel.id
      }
    });
    const queue = await prisma.slotRequest.findMany({
      where: { channelId: channel.id, status: 'QUEUED' },
      orderBy: { createdAt: 'asc' }
    });
    await publishRealtime({
      event: 'slot-requests:update',
      room: `channel:${channel.id}`,
      payload: { queue: queue.map((item) => item.slotName) }
    });
    client.say(channelName, `Slot Request aufgenommen: ${slotName}`);
    return;
  }

  if (command === '!join') {
    const tournament = await prisma.tournament.findFirst({
      where: { channelId: channel.id },
      orderBy: { createdAt: 'desc' }
    });
    if (!tournament) {
      client.say(channelName, 'Kein aktives Turnier.');
      return;
    }
    if (!appUrl) {
      client.say(channelName, 'Join-Link konnte nicht erstellt werden (APP_URL fehlt).');
      return;
    }
    const joinUrl = `${appUrl}/t/${tournament.id}/join?name=${encodeURIComponent(displayName)}`;
    const whisperTarget = tags.username ?? displayName.toLowerCase();
    try {
      await client.whisper(
        whisperTarget,
        `Hier ist dein Join-Link: ${joinUrl}`
      );
    } catch (error) {
      client.say(channelName, `@${displayName} Join-Link: ${joinUrl}`);
    }
  }
});

await client.connect();
console.log('Twitch bot connected');
