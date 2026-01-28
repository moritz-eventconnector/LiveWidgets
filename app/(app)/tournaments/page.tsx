import SectionCard from '@/components/SectionCard';
import { getChannelForUser, getSessionUser } from '@/lib/access';
import { prisma } from '@/lib/prisma';
import { publishRealtime } from '@/lib/realtime';
import { revalidatePath } from 'next/cache';

type MatchSeed = {
  playerA: string | null;
  playerB: string | null;
  winner?: string | null;
};

function buildNextRoundMatches(winners: string[]): MatchSeed[] {
  const matches: MatchSeed[] = [];
  for (let i = 0; i < winners.length; i += 2) {
    const playerA = winners[i] ?? null;
    const playerB = winners[i + 1] ?? null;
    matches.push({
      playerA,
      playerB,
      winner: playerB ? null : playerA
    });
  }
  return matches;
}

export default async function TournamentsPage() {
  const user = await getSessionUser();
  const channel = user ? await getChannelForUser(user.id) : null;

  if (!user || !channel) {
    return (
      <div className="rounded-2xl border border-white/10 bg-obs-card p-6 text-sm text-white/70">
        Bitte melde dich als Broadcaster an, um Tournaments zu verwalten.
      </div>
    );
  }

  async function createTournament(formData: FormData) {
    'use server';
    const currentUser = await getSessionUser();
    const currentChannel = currentUser
      ? await getChannelForUser(currentUser.id)
      : null;
    if (!currentUser || !currentChannel) {
      return;
    }

    const title = String(formData.get('title') ?? '').trim();
    const size = Number(formData.get('size') ?? 8);
    if (!title || !Number.isFinite(size)) {
      return;
    }

    await prisma.tournament.create({
      data: {
        channelId: currentChannel.id,
        title,
        size
      }
    });

    revalidatePath('/app/tournaments');
  }

  async function addPlayer(formData: FormData) {
    'use server';
    const currentUser = await getSessionUser();
    const currentChannel = currentUser
      ? await getChannelForUser(currentUser.id)
      : null;
    if (!currentUser || !currentChannel) {
      return;
    }

    const tournamentId = String(formData.get('tournamentId') ?? '');
    const displayName = String(formData.get('displayName') ?? '').trim();
    const slotName = String(formData.get('slotName') ?? '').trim();
    if (!tournamentId || !displayName || !slotName) {
      return;
    }

    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: { players: true }
    });

    if (!tournament || tournament.channelId !== currentChannel.id) {
      return;
    }

    if (tournament.players.length >= tournament.size) {
      return;
    }

    await prisma.tournamentPlayer.create({
      data: {
        tournamentId,
        displayName,
        slotName,
        seed: tournament.players.length + 1
      }
    });

    revalidatePath('/app/tournaments');
  }

  async function generateMatches(formData: FormData) {
    'use server';
    const currentUser = await getSessionUser();
    const currentChannel = currentUser
      ? await getChannelForUser(currentUser.id)
      : null;
    if (!currentUser || !currentChannel) {
      return;
    }

    const tournamentId = String(formData.get('tournamentId') ?? '');
    if (!tournamentId) {
      return;
    }

    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: { players: { orderBy: { seed: 'asc' } }, matches: true }
    });

    if (!tournament || tournament.channelId !== currentChannel.id) {
      return;
    }

    if (tournament.matches.length > 0 || tournament.players.length === 0) {
      return;
    }

    const roundMatches = buildNextRoundMatches(
      tournament.players.map((player) => player.displayName)
    );

    await prisma.tournamentMatch.createMany({
      data: roundMatches.map((match) => ({
        tournamentId,
        round: 1,
        playerA: match.playerA ?? undefined,
        playerB: match.playerB ?? undefined,
        winner: match.winner ?? undefined
      }))
    });

    await advanceRoundIfComplete(tournamentId, 1);

    if (roundMatches[0]) {
      await publishRealtime({
        room: `tournament:${tournamentId}`,
        event: 'tournament:update',
        payload: {
          round: 'Round 1',
          match: `${roundMatches[0].playerA ?? 'TBD'} vs ${
            roundMatches[0].playerB ?? 'TBD'
          }`
        }
      });
    }

    revalidatePath('/app/tournaments');
  }

  async function advanceRoundIfComplete(tournamentId: string, round: number) {
    const roundMatches = await prisma.tournamentMatch.findMany({
      where: { tournamentId, round },
      orderBy: { createdAt: 'asc' }
    });

    if (roundMatches.length === 0) {
      return;
    }

    const winners = roundMatches
      .map((item) => item.winner)
      .filter((item): item is string => Boolean(item));

    const allResolved = roundMatches.every((item) => item.winner);

    if (!allResolved || winners.length <= 1) {
      return;
    }

    const nextRound = round + 1;
    const existingNextRound = await prisma.tournamentMatch.count({
      where: { tournamentId, round: nextRound }
    });

    if (existingNextRound > 0) {
      return;
    }

    const nextMatches = buildNextRoundMatches(winners);
    await prisma.tournamentMatch.createMany({
      data: nextMatches.map((item) => ({
        tournamentId,
        round: nextRound,
        playerA: item.playerA ?? undefined,
        playerB: item.playerB ?? undefined,
        winner: item.winner ?? undefined
      }))
    });
  }

  async function reportWinner(formData: FormData) {
    'use server';
    const currentUser = await getSessionUser();
    const currentChannel = currentUser
      ? await getChannelForUser(currentUser.id)
      : null;
    if (!currentUser || !currentChannel) {
      return;
    }

    const matchId = String(formData.get('matchId') ?? '');
    const winner = String(formData.get('winner') ?? '').trim();
    if (!matchId || !winner) {
      return;
    }

    const match = await prisma.tournamentMatch.findUnique({
      where: { id: matchId },
      include: { tournament: true }
    });

    if (!match || match.tournament.channelId !== currentChannel.id) {
      return;
    }

    await prisma.tournamentMatch.update({
      where: { id: matchId },
      data: { winner }
    });

    await advanceRoundIfComplete(match.tournamentId, match.round);

    await publishRealtime({
      room: `tournament:${match.tournamentId}`,
      event: 'tournament:update',
      payload: {
        round: `Round ${match.round}`,
        match: `${match.playerA ?? 'TBD'} vs ${match.playerB ?? 'TBD'} (Winner: ${winner})`
      }
    });

    revalidatePath('/app/tournaments');
  }

  const tournaments = await prisma.tournament.findMany({
    where: { channelId: channel.id },
    include: {
      players: { orderBy: { seed: 'asc' } },
      matches: { orderBy: [{ round: 'asc' }, { createdAt: 'asc' }] }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Tournaments</h1>
        <p className="mt-2 text-sm text-white/70">
          Erstelle Brackets, verwalte Matches und update Ergebnisse live.
        </p>
      </div>
      <SectionCard title="Aktive Turniere" description="Deine laufenden Brackets">
        {tournaments.length === 0 ? (
          <p className="text-sm text-white/70">Noch keine Turniere angelegt.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {tournaments.map((tournament) => (
              <div key={tournament.id} className="space-y-4 rounded-xl border border-white/10 p-4">
                <div>
                  <h3 className="text-lg font-semibold">{tournament.title}</h3>
                  <p className="text-sm text-white/60">Size: {tournament.size}</p>
                  <p className="text-sm text-white/60">
                    Players: {tournament.players.length}/{tournament.size}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                    Players
                  </p>
                  {tournament.players.length === 0 ? (
                    <p className="mt-2 text-sm text-white/70">
                      Noch keine Teilnehmer hinzugefügt.
                    </p>
                  ) : (
                    <ul className="mt-2 space-y-1 text-sm text-white/70">
                      {tournament.players.map((player) => (
                        <li key={player.id}>
                          #{player.seed} · {player.displayName}{' '}
                          <span className="text-white/50">({player.slotName ?? 'Slot'})</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <form action={addPlayer} className="flex flex-wrap gap-2">
                  <input type="hidden" name="tournamentId" value={tournament.id} />
                  <input
                    type="text"
                    name="displayName"
                    placeholder="Twitch User"
                    className="w-40 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs"
                  />
                  <input
                    type="text"
                    name="slotName"
                    placeholder="Slot"
                    className="w-40 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs"
                  />
                  <button className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold">
                    Player hinzufügen
                  </button>
                </form>
                <div className="flex flex-wrap gap-2">
                  <form action={generateMatches}>
                    <input type="hidden" name="tournamentId" value={tournament.id} />
                    <button className="rounded-full bg-obs-accent px-3 py-1 text-xs font-semibold">
                      Matches generieren
                    </button>
                  </form>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                    Matches
                  </p>
                  {tournament.matches.length === 0 ? (
                    <p className="mt-2 text-sm text-white/70">Noch keine Matches.</p>
                  ) : (
                    <ul className="mt-2 space-y-2 text-sm text-white/70">
                      {tournament.matches.map((match) => (
                        <li key={match.id} className="rounded-lg border border-white/10 p-2">
                          <p className="text-xs text-white/50">Round {match.round}</p>
                          <p>
                            {match.playerA ?? 'TBD'} vs {match.playerB ?? 'TBD'}
                          </p>
                          <p className="text-xs text-white/50">
                            Winner: {match.winner ?? '-'}
                          </p>
                          <form action={reportWinner} className="mt-2 flex flex-wrap gap-2">
                            <input type="hidden" name="matchId" value={match.id} />
                            <input
                              type="text"
                              name="winner"
                              placeholder="Winner Name"
                              className="w-32 rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs"
                            />
                            <button className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold">
                              Winner setzen
                            </button>
                          </form>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
      <SectionCard title="Neues Turnier starten">
        <form action={createTournament} className="grid gap-4 text-sm">
          <input
            type="text"
            placeholder="Titel"
            name="title"
            className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2"
          />
          <select
            name="size"
            className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2"
          >
            <option value="8">8</option>
            <option value="16">16</option>
            <option value="32">32</option>
          </select>
          <button className="w-fit rounded-full bg-obs-accent px-4 py-2 text-sm font-semibold">
            Turnier erstellen
          </button>
        </form>
      </SectionCard>
      <SectionCard title="Chat Commands">
        <ul className="space-y-2 text-sm text-white/70">
          <li>!join – Link zum Join-Formular per Whisper</li>
        </ul>
      </SectionCard>
    </div>
  );
}
