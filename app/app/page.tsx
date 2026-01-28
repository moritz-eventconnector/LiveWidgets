import ModuleCard from '@/components/ModuleCard';

const pulseStats = [
  {
    title: 'Live Overlays',
    detail: '3 Szenen aktiv · letzte Aktualisierung vor 4 Minuten'
  },
  {
    title: 'Community Queue',
    detail: '12 Requests offen · 2 Bonus Hunts geplant'
  },
  {
    title: 'Revenue Snapshot',
    detail: '1.240€ Umsatz · 6 aktive Subscriber'
  }
];

const nextActions = [
  {
    title: 'Overlay-Editor vorbereiten',
    detail: 'Preset-Struktur und Token-Strategie finalisieren.'
  },
  {
    title: 'Community Automationen',
    detail: 'Slot-Request Regeln und Turnier-Queue definieren.'
  },
  {
    title: 'Billing-Setup',
    detail: 'Stripe-Planlogik und Trial-Flow abstimmen.'
  }
];

export default function AppHome() {
  return (
    <div className="flex flex-col gap-8">
      <header className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          Willkommen zurück, Team Neon Lotus
        </h2>
        <p className="text-sm text-slate-300">
          Diese Übersicht bündelt den Status der wichtigsten Module. Sobald die
          Auth aktiviert ist, landen Creator hier als Startpunkt.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {pulseStats.map((item) => (
          <ModuleCard key={item.title} {...item} />
        ))}
      </section>

      <section className="rounded-2xl border border-white/10 bg-slate-950/70 p-6">
        <h3 className="text-lg font-semibold text-white">
          Nächste Schritte für die Produktiv-Schaltung
        </h3>
        <ul className="mt-4 grid gap-3 text-sm text-slate-200 md:grid-cols-3">
          {nextActions.map((item) => (
            <li
              key={item.title}
              className="rounded-xl border border-white/10 bg-slate-900/70 p-4"
            >
              <p className="text-sm font-semibold text-white">{item.title}</p>
              <p className="mt-2 text-xs text-slate-300">{item.detail}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
