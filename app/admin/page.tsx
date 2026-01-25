import SectionCard from '@/components/SectionCard';
import { getSessionUser } from '@/lib/access';
import { prisma } from '@/lib/prisma';
import { SubscriptionPlan, SubscriptionStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export default async function AdminPage() {
  const user = await getSessionUser();

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-obs-black px-6 py-10 text-white">
        <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-obs-card p-6 text-sm text-white/70">
          Kein Zugriff. Bitte als Admin anmelden.
        </div>
      </div>
    );
  }

  async function updateChannel(formData: FormData) {
    'use server';
    const currentUser = await getSessionUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return;
    }

    const channelId = String(formData.get('channelId') ?? '');
    const plan = String(formData.get('plan') ?? '');
    const status = String(formData.get('status') ?? '');

    if (!channelId) {
      return;
    }

    if (
      !Object.values(SubscriptionPlan).includes(plan as SubscriptionPlan) ||
      !Object.values(SubscriptionStatus).includes(status as SubscriptionStatus)
    ) {
      return;
    }

    await prisma.channel.update({
      where: { id: channelId },
      data: {
        subscriptionPlan: plan as SubscriptionPlan,
        subscriptionStatus: status as SubscriptionStatus
      }
    });

    revalidatePath('/admin');
  }

  async function toggleAdminDisabled(formData: FormData) {
    'use server';
    const currentUser = await getSessionUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return;
    }

    const channelId = String(formData.get('channelId') ?? '');
    if (!channelId) {
      return;
    }

    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
      select: { adminDisabled: true }
    });

    if (!channel) {
      return;
    }

    await prisma.channel.update({
      where: { id: channelId },
      data: { adminDisabled: !channel.adminDisabled }
    });

    revalidatePath('/admin');
  }

  const channels = await prisma.channel.findMany({
    include: { owner: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-obs-black px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">Admin Backoffice</h1>
          <p className="mt-2 text-sm text-white/70">
            Verwalte Channels, Subscriptions und manuelle Sperren.
          </p>
        </div>
        <SectionCard title="Channels">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-white/60">
                <tr>
                  <th className="py-2">Channel</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Owner</th>
                  <th>Stripe Customer</th>
                  <th>Stripe Subscription</th>
                  <th>Admin Disabled</th>
                  <th className="text-right">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {channels.map((channel) => (
                  <tr key={channel.id} className="border-t border-white/10">
                    <td className="py-3 font-medium">{channel.slug}</td>
                    <td className="text-white/70">{channel.subscriptionPlan}</td>
                    <td className="text-white/70">{channel.subscriptionStatus}</td>
                    <td className="text-white/70">
                      {channel.owner.twitchLogin ?? channel.owner.email ?? channel.owner.id}
                    </td>
                    <td className="text-white/70">
                      {channel.stripeCustomerId ? (
                        <a
                          href={`https://dashboard.stripe.com/customers/${channel.stripeCustomerId}`}
                          className="text-obs-accent hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {channel.stripeCustomerId}
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="text-white/70">
                      {channel.stripeSubscriptionId ?? '-'}
                    </td>
                    <td className="text-white/70">
                      {channel.adminDisabled ? 'Ja' : 'Nein'}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <form action={updateChannel} className="flex gap-2">
                          <input type="hidden" name="channelId" value={channel.id} />
                          <select
                            name="plan"
                            defaultValue={channel.subscriptionPlan}
                            className="rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs"
                          >
                            <option value={SubscriptionPlan.CREATOR}>Creator</option>
                            <option value={SubscriptionPlan.CREATOR_PLUS}>Creator+</option>
                          </select>
                          <select
                            name="status"
                            defaultValue={channel.subscriptionStatus}
                            className="rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs"
                          >
                            <option value={SubscriptionStatus.ACTIVE}>Active</option>
                            <option value={SubscriptionStatus.INACTIVE}>Inactive</option>
                            <option value={SubscriptionStatus.PAST_DUE}>Past Due</option>
                          </select>
                          <button className="rounded-full bg-obs-accent px-3 py-1 text-xs font-semibold">
                            Update
                          </button>
                        </form>
                        <form action={toggleAdminDisabled}>
                          <input type="hidden" name="channelId" value={channel.id} />
                          <button className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold">
                            {channel.adminDisabled ? 'Entsperren' : 'Sperren'}
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
        <SectionCard title="Admin Hinweise">
          <div className="text-sm text-white/70">
            Änderungen an Plan/Status wirken sofort auf den Zugriff des Streamers.
            Der Admin-Disabled-Flag sperrt alle App-Routen unabhängig vom Billing.
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
