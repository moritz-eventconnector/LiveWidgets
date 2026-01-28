const quickLinks = [
  {
    title: 'Overlay Editor',
    description: 'Verwalte Layouts, Farben und Szenen mit Live Preview.',
    href: '/dashboard/overlays'
  },
  {
    title: 'Community Aktionen',
    description: 'Steuere Slot Requests, Bonus Hunts und Turnier-Queues.',
    href: '/dashboard/community'
  },
  {
    title: 'Abos & Billing',
    description: 'Neue Preisstufen, Upsells und klare Rechnungs-Logs.',
    href: '/dashboard/billing'
  }
];

const milestones = [
  {
    title: 'Datenmodell',
    detail: 'Basis-Schema für Creator, Workspaces und Overlay-Konfiguration.'
  },
  {
    title: 'Auth & Rollen',
    detail: 'SSO, Team-Invites und Rollenrechte klar definieren.'
  },
  {
    title: 'Realtime Layer',
    detail: 'Socket Gateway + Event-Bus für Overlays und Chat-Events.'
  }
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-10">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-indigo-300">
          Übersicht
        </p>
        <h2 className="text-3xl font-semibold text-white md:text-4xl">
          Das neue Dashboard ist im Aufbau
        </h2>
        <p className="max-w-2xl text-sm text-slate-300 md:text-base">
          Diese Übersicht bündelt die nächsten Ausbaustufen. Navigiere zu den
          Modulen, um den aktuellen Fortschritt und anstehende Deliverables zu
          sehen.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        {quickLinks.map((link) => (
          <a
            key={link.title}
            className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 transition hover:border-indigo-400/60"
            href={link.href}
          >
            <h3 className="text-lg font-semibold text-white">{link.title}</h3>
            <p className="mt-3 text-sm text-slate-300">{link.description}</p>
          </a>
        ))}
      </section>

      <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
        <h3 className="text-lg font-semibold text-white">Milestones</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {milestones.map((item) => (
            <div key={item.title} className="rounded-xl bg-slate-950/70 p-4">
              <p className="text-sm font-semibold text-white">{item.title}</p>
              <p className="mt-2 text-xs text-slate-300">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
