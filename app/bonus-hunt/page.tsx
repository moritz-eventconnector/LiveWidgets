import BonusHuntClient from './bonus-hunt-client';
import CreatorShell from '@/components/creator-shell';
import crypto from 'crypto';

export default async function BonusHuntPage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://livewidgets.de';
  let channel: { overlayToken: string; slug: string; twitchBroadcasterId: string } | null = null;
  let isDefaultChannel = false;

  if (process.env.NEXTAUTH_SECRET && process.env.DATABASE_URL) {
    const { getChannelForUser, getSessionUser } = await import('@/lib/access');
    const { prisma } = await import('@/lib/prisma');
    const sessionUser = await getSessionUser();
    
    if (sessionUser) {
      let channelData = await getChannelForUser(sessionUser.id);
      
      // If no channel exists, create a default one (for Bonus-Hunt to work without Twitch)
      if (!channelData) {
        const defaultSlug = sessionUser.email?.split('@')[0] ?? `user-${sessionUser.id.substring(0, 8)}`;
        const twitchBroadcasterId = `default-${sessionUser.id}`;
        
        try {
          channelData = await prisma.channel.create({
            data: {
              slug: defaultSlug,
              ownerUserId: sessionUser.id,
              twitchBroadcasterId: twitchBroadcasterId,
              twitchBroadcasterLogin: defaultSlug,
              overlayToken: crypto.randomBytes(16).toString('hex'),
              subscriptionStatus: 'INACTIVE'
            }
          });
        } catch (error: any) {
          // If creation fails (e.g., unique constraint), try to find it
          if (error?.code === 'P2002') {
            channelData = await prisma.channel.findUnique({
              where: { twitchBroadcasterId: twitchBroadcasterId }
            });
          }
        }
      }
      
      if (channelData) {
        channel = {
          overlayToken: channelData.overlayToken,
          slug: channelData.slug,
          twitchBroadcasterId: channelData.twitchBroadcasterId
        };
        // Check if it's a default channel (created automatically, not from Twitch)
        isDefaultChannel = channelData.twitchBroadcasterId.startsWith('default-');
      }
    }
  }

  return (
    <CreatorShell
      title="Bonus Hunt"
      subtitle="Freispiele sauber tracken, Ergebnisse teilen und deinen Chat aktiv einbinden."
    >
      <BonusHuntClient
        baseUrl={baseUrl}
        overlayToken={channel?.overlayToken ?? null}
        channelSlug={channel?.slug ?? null}
        isDefaultChannel={isDefaultChannel}
      />
    </CreatorShell>
  );
}
