import SectionCard from '@/components/SectionCard';
import { getChannelForUser, getSessionUser } from '@/lib/access';
import { prisma } from '@/lib/prisma';
import { publishRealtime } from '@/lib/realtime';
import { SlotRequestStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export default async function SlotRequestsPage() {
  const user = await getSessionUser();
  const channel = user ? await getChannelForUser(user.id) : null;

  if (!user || !channel) {
    return (
      <div className="rounded-2xl border border-white/10 bg-obs-card p-6 text-sm text-white/70">
        Bitte melde dich als Broadcaster an, um Slot Requests zu verwalten.
      </div>
    );
  }

  async function publishQueueUpdate(channelId: string) {
    const queueItems = await prisma.slotRequest.findMany({
      where: { channelId, status: SlotRequestStatus.QUEUED },
      orderBy: { createdAt: 'asc' }
    });

    await publishRealtime({
      room: `channel:${channelId}`,
      event: 'slot-requests:update',
      payload: {
        queue: queueItems.map((item) => item.slotName)
      }
    });
  }

  async function addRequest(formData: FormData) {
    'use server';
    const currentUser = await getSessionUser();
    const currentChannel = currentUser
      ? await getChannelForUser(currentUser.id)
      : null;
    if (!currentUser || !currentChannel) {
      return;
    }

    const slotName = String(formData.get('slotName') ?? '').trim();
    const requestedBy = String(formData.get('requestedBy') ?? '').trim();
    if (!slotName || !requestedBy) {
      return;
    }

    await prisma.slotRequest.create({
      data: {
        channelId: currentChannel.id,
        slotName,
        requestedBy
      }
    });

    await publishQueueUpdate(currentChannel.id);
    revalidatePath('/app/slot-requests');
  }

  async function pickNext() {
    'use server';
    const currentUser = await getSessionUser();
    const currentChannel = currentUser
      ? await getChannelForUser(currentUser.id)
      : null;
    if (!currentUser || !currentChannel) {
      return;
    }

    const next = await prisma.slotRequest.findFirst({
      where: { channelId: currentChannel.id, status: SlotRequestStatus.QUEUED },
      orderBy: { createdAt: 'asc' }
    });

    if (!next) {
      return;
    }

    await prisma.slotRequest.update({
      where: { id: next.id },
      data: { status: SlotRequestStatus.PICKED }
    });

    await publishQueueUpdate(currentChannel.id);
    revalidatePath('/app/slot-requests');
  }

  async function clearQueue() {
    'use server';
    const currentUser = await getSessionUser();
    const currentChannel = currentUser
      ? await getChannelForUser(currentUser.id)
      : null;
    if (!currentUser || !currentChannel) {
      return;
    }

    await prisma.slotRequest.deleteMany({
      where: { channelId: currentChannel.id }
    });

    await publishQueueUpdate(currentChannel.id);
    revalidatePath('/app/slot-requests');
  }

  async function markPlayed(formData: FormData) {
    'use server';
    const currentUser = await getSessionUser();
    const currentChannel = currentUser
      ? await getChannelForUser(currentUser.id)
      : null;
    if (!currentUser || !currentChannel) {
      return;
    }

    const requestId = String(formData.get('requestId') ?? '');
    if (!requestId) {
      return;
    }

    await prisma.slotRequest.update({
      where: { id: requestId },
      data: { status: SlotRequestStatus.PLAYED }
    });

    await publishQueueUpdate(currentChannel.id);
    revalidatePath('/app/slot-requests');
  }

  const slotRequests = await prisma.slotRequest.findMany({
    where: { channelId: channel.id },
    orderBy: { createdAt: 'asc' }
  });

  const queued = slotRequests.filter((item) => item.status === SlotRequestStatus.QUEUED);
  const picked = slotRequests.filter((item) => item.status === SlotRequestStatus.PICKED);
  const played = slotRequests.filter((item) => item.status === SlotRequestStatus.PLAYED);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Slot Requests</h1>
        <p className="mt-2 text-sm text-white/70">
          Queue und Twitch Commands für deine Community.
        </p>
      </div>
      <SectionCard title="Aktuelle Queue" description="Live-Queue via Chat">
        {queued.length === 0 ? (
          <p className="text-sm text-white/70">Keine offenen Requests.</p>
        ) : (
          <ul className="space-y-2 text-sm text-white/70">
            {queued.map((item, index) => (
              <li key={item.id} className="flex items-center justify-between">
                <span>
                  {index + 1}. {item.slotName}
                </span>
                <span className="text-white/50">{item.requestedBy}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex flex-wrap gap-3">
          <form action={pickNext}>
            <button className="rounded-full bg-obs-accent px-4 py-2 text-sm font-semibold">
              Pick Next
            </button>
          </form>
          <form action={clearQueue}>
            <button className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold">
              Clear Queue
            </button>
          </form>
        </div>
      </SectionCard>
      <SectionCard title="Request hinzufügen" description="Manuell hinzufügen oder via Chat">
        <form action={addRequest} className="grid gap-3 md:grid-cols-3">
          <input
            name="slotName"
            type="text"
            placeholder="Slot Name"
            className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm"
          />
          <input
            name="requestedBy"
            type="text"
            placeholder="Twitch User"
            className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm"
          />
          <button className="w-fit rounded-full bg-obs-accent px-4 py-2 text-sm font-semibold">
            Request speichern
          </button>
        </form>
      </SectionCard>
      <SectionCard title="Picked Requests">
        {picked.length === 0 ? (
          <p className="text-sm text-white/70">Keine Picks aktiv.</p>
        ) : (
          <ul className="space-y-2 text-sm text-white/70">
            {picked.map((item) => (
              <li key={item.id} className="flex items-center justify-between">
                <span>
                  {item.slotName} · {item.requestedBy}
                </span>
                <form action={markPlayed}>
                  <input type="hidden" name="requestId" value={item.id} />
                  <button className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold">
                    Mark Played
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
      <SectionCard title="Played History">
        {played.length === 0 ? (
          <p className="text-sm text-white/70">Noch keine gespielten Slots.</p>
        ) : (
          <ul className="space-y-2 text-sm text-white/70">
            {played.map((item) => (
              <li key={item.id}>
                {item.slotName} · {item.requestedBy}
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
      <SectionCard title="Chat Commands">
        <ul className="space-y-2 text-sm text-white/70">
          <li>!sr &lt;slotname&gt; – Request erstellen</li>
          <li>!sr pick – nächsten Slot auswählen</li>
          <li>!sr clear – Queue leeren</li>
        </ul>
      </SectionCard>
    </div>
  );
}
