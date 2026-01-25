import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { publishRealtime } from '@/lib/realtime';

export async function POST(request: Request) {
  const { channelId, title, size } = await request.json();

  if (!channelId || !title || !size) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  const tournament = await prisma.tournament.create({
    data: {
      channelId,
      title,
      size: Number(size)
    }
  });

  await publishRealtime({
    event: 'tournament:update',
    room: `tournament:${tournament.id}`,
    payload: {
      round: 'Round 1',
      match: `${title} gestartet`
    }
  });

  return NextResponse.json({ tournament });
}
