import FeatureCard from '@/components/FeatureCard';
import StatCard from '@/components/StatCard';

const features = [
  {
    title: 'Overlay Studio',
    description:
      'Ein komplett neues Overlay-System mit klaren Presets, Live-Vorschau und sicherer Token-Verwaltung.'
  },
  {
    title: 'Community Aktionen',
    description:
      'Schnell konfigurierbare Aktionen für Bonus Hunts, Slot Requests und Turniere.'
  },
  {
    title: 'Creator Workspaces',
    description:
      'Team-Workflows, Rollen und wiederverwendbare Szenen für alle Kanäle.'
  },
  {
    title: 'Billing & Insights',
    description:
      'Saubere Stripe-Integration, Usage-Dashboards und klare Upgrade-Pfade.'
  }
];

const roadmap = [
  {
    label: 'Sprint 01',
    value: 'Foundation',
    detail: 'Neue Architektur, Datenmodell und zentrale Design-Patterns.'
  },
  {
    label: 'Sprint 02',
    value: 'Realtime',
    detail: 'Socket Gateway + Event Bus für Overlays und Chat-Interaktionen.'
  },
  {
    label: 'Sprint 03',
    value: 'Creator Suite',
    detail: 'Workspace, Billing, Admin-Bereich und Onboarding.'
  }
];

export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden px-6 pb-20 pt-16">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
          <header className="space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-indigo-300">
              LiveWidgets 2.0
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
              Wir bauen LiveWidgets neu auf – klarer, schneller und stabiler als
              zuvor.
            </h1>
            <p className="max-w-2xl text-base text-slate-200 md:text-lg">
              Das Projekt startet mit einer komplett neuen Codebasis. Ziel ist
              ein verlässlicher Kern, modulare Features und ein UI, das sich auf
              Creator und Moderatoren konzentriert.
            </p>
          </header>
          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400"
              href="/dashboard"
            >
              Dashboard Preview
            </a>
            <a
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/90 transition hover:border-white/40 hover:text-white"
              href="#roadmap"
            >
              Roadmap ansehen
            </a>
          </div>
        </div>
        <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-indigo-500/20 blur-[120px]" />
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      <section className="px-6 pb-24" id="roadmap">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-10 flex flex-col gap-4">
            <h2 className="text-2xl font-semibold text-white md:text-3xl">
              Roadmap für den Neustart
            </h2>
            <p className="max-w-2xl text-sm text-slate-300 md:text-base">
              Der Neuaufbau passiert in klaren Etappen. Jede Phase liefert eine
              testbare Basis, bevor wir die nächste Feature-Schicht starten.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {roadmap.map((item) => (
              <StatCard key={item.label} {...item} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
