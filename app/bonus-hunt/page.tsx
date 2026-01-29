import BonusHuntClient from './bonus-hunt-client';
import CreatorShell from '@/components/creator-shell';

export default async function BonusHuntPage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://livewidgets.de';
  let channel: { overlayToken: string; slug: string } | null = null;

  if (process.env.NEXTAUTH_SECRET && process.env.DATABASE_URL) {
    const { getChannelForUser, getSessionUser } = await import('@/lib/access');
    const sessionUser = await getSessionUser();
    channel = sessionUser ? await getChannelForUser(sessionUser.id) : null;
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
      />
    </CreatorShell>
  );
}
