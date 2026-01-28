import SectionCard from '@/components/SectionCard';

const overlayLinks = [
  {
    title: 'Bonus Hunt Overlay',
    url: '/overlay/bonushunt/{channel}?token=XYZ',
    description: 'Große Schrift, transparentes Layout.'
  },
  {
    title: 'Slot Requests Overlay',
    url: '/overlay/slot-requests/{channel}?token=XYZ',
    description: 'Queue + aktueller Pick.'
  },
  {
    title: 'Tournament Overlay',
    url: '/overlay/tournament/{tournamentId}?token=XYZ',
    description: 'Runde, Matchups, Gewinner.'
  }
];

export default function OverlaysPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Overlays</h1>
        <p className="mt-2 text-sm text-white/70">
          Sichere Overlay-URLs mit Token-Schutz für OBS.
        </p>
      </div>
      <SectionCard title="Overlay Token" description="Token-Schutz aktiv">
        <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
          <span>Aktueller Token: ••••••••</span>
          <button className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold">
            Token regenerieren
          </button>
        </div>
      </SectionCard>
      <div className="grid gap-4 md:grid-cols-2">
        {overlayLinks.map((overlay) => (
          <SectionCard key={overlay.title} title={overlay.title} description={overlay.description}>
            <div className="text-sm text-white/70">{overlay.url}</div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
