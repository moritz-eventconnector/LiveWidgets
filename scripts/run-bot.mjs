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
        requestedBy: tags['display-name'] ?? 'viewer',
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

  if (command === '!ts' && isModerator(tags)) {
    const size = Number(rest.pop());
    const title = rest.join(' ') || 'Tournament';
    const tournament = await prisma.tournament.create({
      data: {
        channelId: channel.id,
        title,
        size: Number.isNaN(size) ? 8 : size
      }
    });
    await publishRealtime({
      event: 'tournament:update',
      room: `tournament:${tournament.id}`,
      payload: { round: 'Round 1', match: `${title} gestartet` }
    });
    client.say(channelName, `Turnier gestartet: ${title}`);
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
    await prisma.tournamentPlayer.create({
      data: {
        tournamentId: tournament.id,
        displayName: tags['display-name'] ?? 'viewer',
        seed: Math.floor(Math.random() * 1000)
      }
    });
    await publishRealtime({
      event: 'tournament:update',
      room: `tournament:${tournament.id}`,
      payload: { round: 'Round 1', match: 'Player joined' }
    });
    client.say(channelName, `${tags['display-name'] ?? 'viewer'} joined.`);
    return;
  }

  if (command === '!win' && isModerator(tags)) {
    const winner = rest.join(' ');
    const tournament = await prisma.tournament.findFirst({
      where: { channelId: channel.id },
      orderBy: { createdAt: 'desc' }
    });
    if (!tournament || !winner) {
      return;
    }
    await prisma.tournamentMatch.create({
      data: {
        tournamentId: tournament.id,
        round: 1,
        winner
      }
    });
    await publishRealtime({
      event: 'tournament:update',
      room: `tournament:${tournament.id}`,
      payload: { round: 'Round 1', match: `Winner: ${winner}` }
    });
    client.say(channelName, `Winner gesetzt: ${winner}`);
  }
});

await client.connect();
console.log('Twitch bot connected');
