import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { getAuthOptions } from '@/lib/auth';
import { getChannelForUser } from '@/lib/access';
import { prisma } from '@/lib/prisma';

async function getUserId() {
  const session = await getServerSession(getAuthOptions());
  return session?.user?.id ?? null;
}

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const channel = await getChannelForUser(userId);
    if (!channel) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

    const hunts = await prisma.bonusHunt.findMany({
      where: { channelId: channel.id },
      include: {
        items: {
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    const formattedHunts = hunts.map((hunt) => {
      const slots = hunt.items.map((item) => ({
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
    });

    return NextResponse.json({ hunts: formattedHunts });
  } catch (error) {
    console.error('Error fetching hunts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const channel = await getChannelForUser(userId);
    if (!channel) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const { title, settings, slots } = body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const hunt = await prisma.bonusHunt.create({
      data: {
        channelId: channel.id,
        title: title,
        status: 'PENDING',
        startBalance: settings?.startBalance
          ? parseFloat(settings.startBalance)
          : null,
        targetCashout: settings?.targetCashout
          ? parseFloat(settings.targetCashout)
          : null,
        currency: settings?.currency ?? '€',
        items: {
          create: (slots ?? []).map((slot: any) => ({
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
        }
      },
      include: {
        items: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    const formattedSlots = hunt.items.map((item) => ({
      id: item.id,
      name: item.slotName,
      provider: item.provider ?? '',
      stake: item.bet.toString(),
      targetSpins: item.targetSpins?.toString() ?? '',
      collectedSpins: item.collectedSpins?.toString() ?? '',
      payout: item.payout?.toString() ?? '',
      status: item.status as 'open' | 'spinning' | 'done'
    }));

    const totalSlots = formattedSlots.length;
    const startBalance = hunt.startBalance?.toString() ?? '';
    const currency = hunt.currency ?? '€';
    const summary =
      totalSlots > 0
        ? `${totalSlots} Slots · ${startBalance} ${currency} Startbalance`
        : 'Noch keine Slots';

    return NextResponse.json({
      hunt: {
        id: hunt.id,
        title: hunt.title,
        status: 'prepared',
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
        slots: formattedSlots
      }
    });
  } catch (error) {
    console.error('Error creating hunt:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
