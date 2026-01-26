import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { publishRealtime } from '@/lib/realtime';

type JoinPageProps = {
  params: { tournamentId: string };
  searchParams?: { name?: string; joined?: string };
};

export default async function TournamentJoinPage({
  params,
  searchParams
}: JoinPageProps) {
  const tournament = await prisma.tournament.findUnique({
    where: { id: params.tournamentId },
    include: { players: true, matches: true }
  });

  async function joinTournament(formData: FormData) {
    'use server';
    const tournamentId = String(formData.get('tournamentId') ?? '');
    const displayName = String(formData.get('displayName') ?? '').trim();
    const slotName = String(formData.get('slotName') ?? '').trim();
    if (!tournamentId || !displayName || !slotName) {
      return;
    }

    const currentTournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: { players: true, matches: true }
    });

    if (!currentTournament || currentTournament.matches.length > 0) {
      return;
    }

    if (currentTournament.players.length >= currentTournament.size) {
      return;
    }

    const alreadyJoined = currentTournament.players.some(
      (player) => player.displayName.toLowerCase() === displayName.toLowerCase()
    );

    if (alreadyJoined) {
      return;
    }

    await prisma.tournamentPlayer.create({
      data: {
        tournamentId,
        displayName,
        slotName,
        seed: currentTournament.players.length + 1
      }
    });

    await publishRealtime({
      room: `tournament:${tournamentId}`,
      event: 'tournament:update',
      payload: {
        round: 'Lobby',
        match: `${displayName} joined (${slotName})`
      }
    });

    redirect(
      `/t/${tournamentId}/join?name=${encodeURIComponent(displayName)}&joined=1`
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-obs-black px-6 py-10 text-white">
        <div className="mx-auto max-w-xl space-y-6 rounded-2xl bg-obs-card p-6">
          <h1 className="text-2xl font-semibold">Turnier nicht gefunden</h1>
          <Link href="/" className="text-sm text-white/60">
            Zurück zur Landingpage
          </Link>
        </div>
      </div>
    );
  }

  const prefillName = typeof searchParams?.name === 'string' ? searchParams.name : '';
  const joined = searchParams?.joined === '1';

  return (
    <div className="min-h-screen bg-obs-black px-6 py-10 text-white">
      <div className="mx-auto max-w-xl space-y-6 rounded-2xl bg-obs-card p-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-obs-accent">
            Tournament Join
          </p>
          <h1 className="text-2xl font-semibold">{tournament.title}</h1>
          <p className="text-sm text-white/70">
            Trage deinen Twitch-Namen und deinen Slot ein, um teilzunehmen.
          </p>
        </header>
        {joined ? (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
            Du bist eingetragen. Viel Erfolg!
          </div>
        ) : null}
        {tournament.matches.length > 0 ? (
          <p className="text-sm text-white/70">
            Das Turnier hat bereits begonnen. Neue Teilnehmer können nicht mehr beitreten.
          </p>
        ) : (
          <form action={joinTournament} className="grid gap-3 text-sm">
            <input type="hidden" name="tournamentId" value={tournament.id} />
            <input
              type="text"
              name="displayName"
              defaultValue={prefillName}
              placeholder="Twitch Name"
              className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2"
            />
            <input
              type="text"
              name="slotName"
              placeholder="Slot (z. B. Book of Dead)"
              className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2"
            />
            <button className="w-full rounded-full bg-obs-accent px-4 py-2 font-semibold">
              Beitreten
            </button>
          </form>
        )}
        <Link href={`/t/${tournament.id}`} className="text-sm text-white/60">
          Turnierstatus ansehen
        </Link>
      </div>
    </div>
  );
}
