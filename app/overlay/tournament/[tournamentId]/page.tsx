import { prisma } from '@/lib/prisma';
import TournamentOverlayClient from '@/components/TournamentOverlayClient';

export default async function TournamentOverlay({
  params,
  searchParams
}: {
  params: { tournamentId: string };
  searchParams?: { token?: string };
}) {
  const tournament = await prisma.tournament.findUnique({
    where: { id: params.tournamentId },
    include: { channel: true }
  });

  if (!searchParams?.token || tournament?.channel.overlayToken !== searchParams.token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-transparent text-white">
        Token required.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent p-6 text-white">
      <h1 className="text-3xl font-semibold">Tournament Overlay</h1>
      <p className="mt-2 text-lg">Tournament: {params.tournamentId}</p>
      <TournamentOverlayClient room={`tournament:${params.tournamentId}`} />
    </div>
  );
}
