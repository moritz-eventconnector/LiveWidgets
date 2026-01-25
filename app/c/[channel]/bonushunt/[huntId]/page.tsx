import Link from 'next/link';
import BonusHuntGuessForm from '@/components/BonusHuntGuessForm';

export default function BonusHuntPublic({
  params
}: {
  params: { channel: string; huntId: string };
}) {
  return (
    <div className="min-h-screen bg-obs-black px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl space-y-6">
        <header>
          <p className="text-sm uppercase tracking-[0.3em] text-obs-accent">
            Live Bonus Hunt
          </p>
          <h1 className="text-3xl font-semibold">
            {params.channel} · Hunt {params.huntId}
          </h1>
          <p className="mt-2 text-sm text-white/70">
            Tipp deinen Gesamtgewinn. Ein Tipp pro Twitch User.
          </p>
        </header>
        <section className="rounded-2xl bg-obs-card p-6">
          <BonusHuntGuessForm huntId={params.huntId} />
        </section>
        <section className="rounded-2xl bg-obs-card p-6 text-sm text-white/70">
          Live-Updates erscheinen hier sobald der Hunt geöffnet wird.
        </section>
        <Link href="/" className="text-sm text-white/60">
          Zurück zur Landingpage
        </Link>
      </div>
    </div>
  );
}
