import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ huntId: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 401 });
    }

    const { huntId } = await params;

    // Find channel by overlay token
    const channel = await prisma.channel.findFirst({
      where: { overlayToken: token }
    });

    if (!channel) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Find hunt
    const hunt = await prisma.bonusHunt.findFirst({
      where: {
        id: huntId,
        channelId: channel.id
      },
      include: {
        items: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!hunt) {
      return NextResponse.json({ error: 'Hunt not found' }, { status: 404 });
    }

    // Format for overlay
    const slots = hunt.items.map((item) => {
      const payout = item.payout ?? 0;
      const stakeValue = item.bet;
      const currency = hunt.currency ?? '€';
      const stakeLabel = stakeValue
        ? ` (${stakeValue.toFixed(2)}${currency})`
        : '';

      return {
        id: item.id,
        name: `${item.slotName}${stakeLabel}`,
        payout
      };
    });

    return NextResponse.json({
      currency: hunt.currency ?? '€',
      slots: slots.length > 0 ? slots : []
    });
  } catch (error) {
    console.error('Error fetching overlay hunt:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

