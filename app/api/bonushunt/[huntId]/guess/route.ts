import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';
import { publishRealtime } from '@/lib/realtime';

export async function POST(
  request: Request,
  { params }: { params: { huntId: string } }
) {
  const { twitchUserId, guess } = await request.json();
  if (!twitchUserId || !guess) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  const limiter = await rateLimit({
    key: `guess:${params.huntId}:${twitchUserId}`,
    limit: 1,
    windowSeconds: 60
  });

  if (!limiter.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const hunt = await prisma.bonusHunt.findUnique({
    where: { id: params.huntId }
  });

  if (!hunt) {
    return NextResponse.json({ error: 'Hunt not found' }, { status: 404 });
  }

  const user = await prisma.user.upsert({
    where: { twitchUserId },
    update: {},
    create: {
      twitchUserId,
      role: 'MOD'
    }
  });

  const entry = await prisma.guess.upsert({
    where: {
      huntId_userId: {
        huntId: params.huntId,
        userId: user.id
      }
    },
    update: { guess: Number(guess) },
    create: {
      huntId: params.huntId,
      userId: user.id,
      guess: Number(guess)
    }
  });

  await publishRealtime({
    event: 'bonus-hunt:update',
    room: `channel:${hunt.channelId}`,
    payload: {
      huntId: params.huntId,
      totalWin: `${Number(guess).toFixed(2)}€`
    }
  });

  return NextResponse.json({ guess: entry });
}
