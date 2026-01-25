import SectionCard from '@/components/SectionCard';
import { getChannelForUser, getSessionUser } from '@/lib/access';
import { prisma } from '@/lib/prisma';
import { publishRealtime } from '@/lib/realtime';
import { BonusHuntStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export default async function BonusHuntsPage() {
  const user = await getSessionUser();
  const channel = user ? await getChannelForUser(user.id) : null;

  if (!user || !channel) {
    return (
      <div className="rounded-2xl border border-white/10 bg-obs-card p-6 text-sm text-white/70">
        Bitte melde dich als Broadcaster an, um Bonus Hunts zu verwalten.
      </div>
    );
  }

  async function createHunt(formData: FormData) {
    'use server';
    const currentUser = await getSessionUser();
    const currentChannel = currentUser
      ? await getChannelForUser(currentUser.id)
      : null;
    if (!currentUser || !currentChannel) {
      return;
    }

    const title = String(formData.get('title') ?? '').trim();
    const slotName = String(formData.get('slotName') ?? '').trim();
    const bet = Number(formData.get('bet') ?? 0);
    const buyCost = Number(formData.get('buyCost') ?? 0);
    const type = String(formData.get('type') ?? 'buy');

    if (!title) {
      return;
    }

    await prisma.bonusHunt.create({
      data: {
        channelId: currentChannel.id,
        title,
        items: slotName
          ? {
              create: {
                slotName,
                bet: Number.isFinite(bet) ? bet : 0,
                buyCost: Number.isFinite(buyCost) ? buyCost : 0,
                type
              }
            }
          : undefined
      }
    });

    revalidatePath('/app/bonus-hunts');
  }

  async function addSlot(formData: FormData) {
    'use server';
    const currentUser = await getSessionUser();
    const currentChannel = currentUser
      ? await getChannelForUser(currentUser.id)
      : null;
    if (!currentUser || !currentChannel) {
      return;
    }

    const huntId = String(formData.get('huntId') ?? '');
    const slotName = String(formData.get('slotName') ?? '').trim();
    const bet = Number(formData.get('bet') ?? 0);
    const buyCost = Number(formData.get('buyCost') ?? 0);
    const type = String(formData.get('type') ?? 'buy');

    if (!huntId || !slotName) {
      return;
    }

    await prisma.bonusItem.create({
      data: {
        huntId,
        slotName,
        bet: Number.isFinite(bet) ? bet : 0,
        buyCost: Number.isFinite(buyCost) ? buyCost : 0,
        type
      }
    });

    revalidatePath('/app/bonus-hunts');
  }

  async function updateHuntStatus(formData: FormData) {
    'use server';
    const currentUser = await getSessionUser();
    const currentChannel = currentUser
      ? await getChannelForUser(currentUser.id)
      : null;
    if (!currentUser || !currentChannel) {
      return;
    }

    const huntId = String(formData.get('huntId') ?? '');
    const status = String(formData.get('status') ?? '');
    if (!huntId || !Object.values(BonusHuntStatus).includes(status as BonusHuntStatus)) {
      return;
    }

    await prisma.bonusHunt.update({
      where: { id: huntId },
      data: { status: status as BonusHuntStatus }
    });

    revalidatePath('/app/bonus-hunts');
  }

  async function updateHuntResult(formData: FormData) {
    'use server';
    const currentUser = await getSessionUser();
    const currentChannel = currentUser
      ? await getChannelForUser(currentUser.id)
      : null;
    if (!currentUser || !currentChannel) {
      return;
    }

    const huntId = String(formData.get('huntId') ?? '');
    const winAmount = Number(formData.get('winAmount') ?? 0);
    const multiplier = Number(formData.get('multiplier') ?? 0);

    if (!huntId) {
      return;
    }

    const updated = await prisma.bonusHunt.update({
      where: { id: huntId },
      data: {
        winAmount: Number.isFinite(winAmount) ? winAmount : 0,
        multiplier: Number.isFinite(multiplier) ? multiplier : null,
        status: BonusHuntStatus.FINISHED
      }
    });

    await publishRealtime({
      room: `channel:${currentChannel.id}`,
      event: 'bonus-hunt:update',
      payload: {
        totalWin: `${(updated.winAmount ?? 0).toFixed(2)}€`
      }
    });

    revalidatePath('/app/bonus-hunts');
  }

  const hunts = await prisma.bonusHunt.findMany({
    where: { channelId: channel.id },
    include: { items: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Bonus Hunts</h1>
        <p className="mt-2 text-sm text-white/70">
          Erstelle Hunts, verwalte Slots und tracke Ergebnisse in Echtzeit.
        </p>
      </div>

      <SectionCard title="Aktive Hunts" description="Übersicht deiner Hunts">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-white/60">
              <tr>
                <th className="py-2">Titel</th>
                <th>Status</th>
                <th>Slots</th>
                <th>Win</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {hunts.length === 0 ? (
                <tr className="border-t border-white/10">
                  <td className="py-3 text-white/70" colSpan={5}>
                    Noch keine Hunts angelegt.
                  </td>
                </tr>
              ) : (
                hunts.map((hunt) => (
                  <tr key={hunt.id} className="border-t border-white/10 align-top">
                    <td className="py-3 font-medium">{hunt.title}</td>
                    <td className="capitalize text-white/70">{hunt.status}</td>
                    <td className="text-white/70">{hunt.items.length}</td>
                    <td className="text-white/70">
                      {hunt.winAmount ? `${hunt.winAmount.toFixed(2)}€` : '-'}
                    </td>
                    <td className="py-3">
                      <div className="flex flex-col gap-3">
                        <form action={addSlot} className="grid gap-2 md:grid-cols-4">
                          <input type="hidden" name="huntId" value={hunt.id} />
                          <input
                            type="text"
                            name="slotName"
                            placeholder="Slot Name"
                            className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs"
                          />
                          <input
                            type="number"
                            name="bet"
                            step="0.01"
                            placeholder="Bet"
                            className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs"
                          />
                          <input
                            type="number"
                            name="buyCost"
                            step="0.01"
                            placeholder="Buy Cost"
                            className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs"
                          />
                          <select
                            name="type"
                            className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs"
                          >
                            <option value="buy">Buy</option>
                            <option value="freespins">Free Spins</option>
                          </select>
                          <button className="col-span-full w-fit rounded-full bg-obs-accent px-3 py-1 text-xs font-semibold">
                            Slot hinzufügen
                          </button>
                        </form>
                        <form action={updateHuntStatus} className="flex flex-wrap gap-2">
                          <input type="hidden" name="huntId" value={hunt.id} />
                          <select
                            name="status"
                            defaultValue={hunt.status}
                            className="rounded-lg border border-white/10 bg-black/40 px-3 py-1 text-xs"
                          >
                            <option value={BonusHuntStatus.PENDING}>Pending</option>
                            <option value={BonusHuntStatus.OPENED}>Opened</option>
                            <option value={BonusHuntStatus.FINISHED}>Finished</option>
                          </select>
                          <button className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold">
                            Status setzen
                          </button>
                        </form>
                        <form action={updateHuntResult} className="flex flex-wrap gap-2">
                          <input type="hidden" name="huntId" value={hunt.id} />
                          <input
                            type="number"
                            name="winAmount"
                            step="0.01"
                            placeholder="Win Amount"
                            className="w-32 rounded-lg border border-white/10 bg-black/40 px-3 py-1 text-xs"
                          />
                          <input
                            type="number"
                            name="multiplier"
                            step="0.01"
                            placeholder="Multiplier"
                            className="w-28 rounded-lg border border-white/10 bg-black/40 px-3 py-1 text-xs"
                          />
                          <button className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold">
                            Ergebnis speichern
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="Neuen Hunt anlegen" description="Slots und Startdaten">
        <form action={createHunt} className="grid gap-4 text-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <input
              type="text"
              name="title"
              placeholder="Titel"
              className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2"
            />
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <input
              type="text"
              name="slotName"
              placeholder="Slot Name (optional)"
              className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2"
            />
            <input
              type="number"
              name="bet"
              step="0.01"
              placeholder="Bet"
              className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2"
            />
            <input
              type="number"
              name="buyCost"
              step="0.01"
              placeholder="Buy Cost"
              className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2"
            />
          </div>
          <select
            name="type"
            className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm"
          >
            <option value="buy">Buy</option>
            <option value="freespins">Free Spins</option>
          </select>
          <button className="w-fit rounded-full bg-obs-accent px-4 py-2 text-sm font-semibold">
            Hunt erstellen
          </button>
        </form>
      </SectionCard>
    </div>
  );
}
