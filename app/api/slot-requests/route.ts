import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';
import { publishRealtime } from '@/lib/realtime';

export async function POST(request: Request) {
  const { channelId, slotName, requestedBy } = await request.json();

  if (!channelId || !slotName || !requestedBy) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  const limiter = await rateLimit({
    key: `slot-request:${channelId}:${requestedBy}`,
    limit: 5,
    windowSeconds: 300
  });

  if (!limiter.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const entry = await prisma.slotRequest.create({
    data: {
      channelId,
      slotName,
      requestedBy
    }
  });

  const queue = await prisma.slotRequest.findMany({
    where: { channelId, status: 'QUEUED' },
    orderBy: { createdAt: 'asc' }
  });

  await publishRealtime({
    event: 'slot-requests:update',
    room: `channel:${channelId}`,
    payload: { queue: queue.map((item) => item.slotName) }
  });

  return NextResponse.json({ slotRequest: entry });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channelId = searchParams.get('channelId');

  if (!channelId) {
    return NextResponse.json({ error: 'channelId required' }, { status: 400 });
  }

  const items = await prisma.slotRequest.findMany({
    where: { channelId, status: 'QUEUED' },
    orderBy: { createdAt: 'asc' }
  });

  return NextResponse.json({ items });
}
