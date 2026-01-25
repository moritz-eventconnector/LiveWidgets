import DashboardNav from '@/components/DashboardNav';
import SubscriptionGate from '@/components/SubscriptionGate';
import { getSessionUser, getChannelForUser } from '@/lib/access';

export default async function AppLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  const channel = user ? await getChannelForUser(user.id) : null;

  return (
    <div className="flex min-h-screen bg-obs-black text-white">
      <DashboardNav />
      <main className="flex-1 px-6 py-8 md:px-10">
        {!channel ? (
          <div className="rounded-2xl border border-white/10 bg-obs-card p-6 text-sm text-white/70">
            Kein Channel Workspace gefunden. Bitte melde dich erneut mit Twitch an.
          </div>
        ) : channel.adminDisabled ? (
          <div className="rounded-2xl border border-white/10 bg-obs-card p-6 text-sm text-white/70">
            Dieser Channel ist derzeit gesperrt. Bitte kontaktiere den Support.
          </div>
        ) : (
          <SubscriptionGate status={channel.subscriptionStatus}>
            {children}
          </SubscriptionGate>
        )}
      </main>
    </div>
  );
}
