import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

const user = await prisma.user.upsert({
  where: { email: 'demo@livewidgets.de' },
  update: {},
  create: {
    email: 'demo@livewidgets.de',
    role: 'STREAMER'
  }
});

await prisma.channel.upsert({
  where: { twitchBroadcasterId: '123456' },
  update: {},
  create: {
    slug: 'demochannel',
    ownerUserId: user.id,
    twitchBroadcasterId: '123456',
    twitchBroadcasterLogin: 'demochannel',
    overlayToken: crypto.randomBytes(16).toString('hex'),
    subscriptionStatus: 'ACTIVE'
  }
});

console.log('Demo data ready');
await prisma.$disconnect();
