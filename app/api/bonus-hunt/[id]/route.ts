import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { getAuthOptions } from '@/lib/auth';
import { getChannelForUser } from '@/lib/access';
import { prisma } from '@/lib/prisma';

async function getUserId() {
  const session = await getServerSession(getAuthOptions());
  return session?.user?.id ?? null;
}

function formatHunt(hunt: any) {
  const slots = hunt.items.map((item: any) => ({
    id: item.id,
    name: item.slotName,
    provider: item.provider ?? '',
    stake: item.bet.toString(),
    targetSpins: item.targetSpins?.toString() ?? '',
    collectedSpins: item.collectedSpins?.toString() ?? '',
    payout: item.payout?.toString() ?? '',
    status: item.status as 'open' | 'spinning' | 'done'
  }));

  const totalSlots = slots.length;
  const startBalance = hunt.startBalance?.toString() ?? '';
  const currency = hunt.currency ?? '€';
  const summary =
    totalSlots > 0
      ? `${totalSlots} Slots · ${startBalance} ${currency} Startbalance`
      : 'Noch keine Slots';

  const statusMap: Record<string, 'prepared' | 'active' | 'done'> = {
    PENDING: 'prepared',
    OPENED: 'active',
    FINISHED: 'done'
  };

  return {
    id: hunt.id,
    title: hunt.title,
    status: statusMap[hunt.status] ?? 'prepared',
    updatedAt: new Date(hunt.updatedAt).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    summary,
    settings: {
      title: hunt.title,
      startBalance: hunt.startBalance?.toString() ?? '',
      targetCashout: hunt.targetCashout?.toString() ?? '',
      currency
    },
    slots
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const channel = await getChannelForUser(userId);
    if (!channel) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

    const { id } = await params;

    const hunt = await prisma.bonusHunt.findFirst({
      where: {
        id,
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

    return NextResponse.json({ hunt: formatHunt(hunt) });
  } catch (error) {
    console.error('Error fetching hunt:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const channel = await getChannelForUser(userId);
  if (!channel) {
    return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
  }

  const { id } = await params;

  const existingHunt = await prisma.bonusHunt.findFirst({
    where: {
      id,
      channelId: channel.id
    }
  });

  if (!existingHunt) {
    return NextResponse.json({ error: 'Hunt not found' }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const { title, settings, slots, status } = body;

  // Update hunt
  const updatedHunt = await prisma.bonusHunt.update({
    where: { id },
    data: {
      title: title ?? existingHunt.title,
      startBalance: settings?.startBalance
        ? parseFloat(settings.startBalance)
        : existingHunt.startBalance,
      targetCashout: settings?.targetCashout
        ? parseFloat(settings.targetCashout)
        : existingHunt.targetCashout,
      currency: settings?.currency ?? existingHunt.currency,
      status:
        status === 'active'
          ? 'OPENED'
          : status === 'done'
            ? 'FINISHED'
            : existingHunt.status
    },
    include: {
      items: {
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  // Update or create items
  if (Array.isArray(slots)) {
    // Delete existing items
    await prisma.bonusItem.deleteMany({
      where: { huntId: id }
    });

    // Create new items
    if (slots.length > 0) {
      await prisma.bonusItem.createMany({
        data: slots.map((slot: any) => ({
          huntId: id,
          slotName: slot.name ?? '',
          provider: slot.provider ?? null,
          bet: slot.stake ? parseFloat(slot.stake) : 0,
          buyCost: 0,
          type: 'bonus',
          targetSpins: slot.targetSpins ? parseInt(slot.targetSpins) : null,
          collectedSpins: slot.collectedSpins
            ? parseInt(slot.collectedSpins)
            : null,
          status: slot.status ?? 'open',
          payout: slot.payout ? parseFloat(slot.payout) : null
        }))
      });
    }

    // Reload with items
    const reloadedHunt = await prisma.bonusHunt.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (reloadedHunt) {
      return NextResponse.json({ hunt: formatHunt(reloadedHunt) });
    }
  }

    return NextResponse.json({ hunt: formatHunt(updatedHunt) });
  } catch (error) {
    console.error('Error updating hunt:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const channel = await getChannelForUser(userId);
  if (!channel) {
    return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
  }

  const { id } = await params;

  const hunt = await prisma.bonusHunt.findFirst({
    where: {
      id,
      channelId: channel.id
    }
  });

  if (!hunt) {
    return NextResponse.json({ error: 'Hunt not found' }, { status: 404 });
  }

  await prisma.bonusHunt.delete({
    where: { id }
  });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting hunt:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

