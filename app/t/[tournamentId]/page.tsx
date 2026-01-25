import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function TournamentPublic({
  params
}: {
  params: { tournamentId: string };
}) {
  const tournament = await prisma.tournament.findUnique({
    where: { id: params.tournamentId },
    include: { matches: { orderBy: [{ round: 'asc' }, { createdAt: 'asc' }] } }
  });

  return (
    <div className="min-h-screen bg-obs-black px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl space-y-6">
        <header>
          <p className="text-sm uppercase tracking-[0.3em] text-obs-accent">
            Live Tournament
          </p>
          <h1 className="text-3xl font-semibold">
            Tournament {tournament?.title ?? params.tournamentId}
          </h1>
          <p className="mt-2 text-sm text-white/70">
            Bracket-Updates erscheinen in Echtzeit.
          </p>
        </header>
        <section className="rounded-2xl bg-obs-card p-6 text-sm text-white/70">
          {tournament?.matches.length ? (
            <div className="space-y-4">
              {tournament.matches.map((match) => (
                <div key={match.id} className="rounded-lg border border-white/10 p-3">
                  <p className="text-xs text-white/50">Round {match.round}</p>
                  <p className="text-sm text-white/80">
                    {match.playerA ?? 'TBD'} vs {match.playerB ?? 'TBD'}
                  </p>
                  <p className="text-xs text-white/50">
                    Winner: {match.winner ?? '-'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>Aktuelle Matches werden hier angezeigt.</p>
          )}
        </section>
        <Link href="/" className="text-sm text-white/60">
          Zurück zur Landingpage
        </Link>
      </div>
    </div>
  );
}
