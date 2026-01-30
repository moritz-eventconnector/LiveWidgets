import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import crypto from 'crypto';

import { getAuthOptions } from '@/lib/auth';
import { getChannelForUser } from '@/lib/access';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering to ensure route is registered
export const dynamic = 'force-dynamic';

async function getUserId() {
  const session = await getServerSession(getAuthOptions());
  return session?.user?.id ?? null;
}

async function getOrCreateChannel(userId: string) {
  let channel = await getChannelForUser(userId);
  
  if (!channel) {
    // Create a default channel if none exists (for Bonus-Hunt to work without Twitch)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return null;
    }
    
    // Generate a default slug from email or userId
    const defaultSlug = user.email?.split('@')[0] ?? `user-${userId.substring(0, 8)}`;
    const twitchBroadcasterId = `default-${userId}`;
    
    try {
      channel = await prisma.channel.create({
        data: {
          slug: defaultSlug,
          ownerUserId: userId,
          twitchBroadcasterId: twitchBroadcasterId,
          twitchBroadcasterLogin: defaultSlug,
          overlayToken: crypto.randomBytes(16).toString('hex'),
          subscriptionStatus: 'INACTIVE'
        }
      });
    } catch (error: any) {
      // If channel creation fails (e.g., unique constraint), try to find it
      if (error?.code === 'P2002') {
        channel = await prisma.channel.findUnique({
          where: { twitchBroadcasterId: twitchBroadcasterId }
        });
      }
      if (!channel) {
        console.error('Failed to create or find channel:', error);
        throw error;
      }
    }
  }
  
  return channel;
}

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const channel = await getOrCreateChannel(userId);
    if (!channel) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
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

    const channel = await getOrCreateChannel(userId);
    if (!channel) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
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

