import SectionCard from '@/components/SectionCard';

export default function AppOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Overview</h1>
        <p className="mt-2 text-sm text-white/70">
          Dein Channel Workspace, Subscription-Status und Live-Links auf einen Blick.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="Subscription" description="Aktiv · Creator">
          <div className="text-sm text-white/60">
            Nächste Abrechnung: 12.09.2024
          </div>
        </SectionCard>
        <SectionCard title="Overlay Links" description="Sichere Token-URLs">
          <ul className="text-sm text-white/70">
            <li>/overlay/bonushunt/{'{channel}'}?token=••••</li>
            <li>/overlay/slot-requests/{'{channel}'}?token=••••</li>
            <li>/overlay/tournament/{'{tournamentId}'}?token=••••</li>
          </ul>
        </SectionCard>
        <SectionCard title="Twitch Bot" description="Verbunden als LiveWidgetsBot">
          <div className="text-sm text-white/60">Status: online</div>
        </SectionCard>
      </div>

      <SectionCard title="Feature Flags" description="Creator+ Optionen">
        <div className="text-sm text-white/70">
          Website-Baukasten: deaktiviert (Creator+).
        </div>
      </SectionCard>
    </div>
  );
}
