import { prisma } from '@/lib/prisma';
import SlotRequestsOverlayClient from '@/components/SlotRequestsOverlayClient';

export default async function SlotRequestsOverlay({
  params,
  searchParams
}: {
  params: { channel: string };
  searchParams?: { token?: string };
}) {
  const channel = await prisma.channel.findUnique({
    where: { slug: params.channel }
  });

  if (!searchParams?.token || channel?.overlayToken !== searchParams.token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-transparent text-white">
        Token required.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent p-6 text-white">
      <h1 className="text-3xl font-semibold">Slot Requests Overlay</h1>
      <p className="mt-2 text-lg">Channel: {params.channel}</p>
      <SlotRequestsOverlayClient room={`channel:${channel.id}`} />
    </div>
  );
}
