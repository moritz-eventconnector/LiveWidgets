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

const launchHighlights = [
  {
    title: 'OBS-ready in Minuten',
    detail: 'Fertige Overlay-Szenen und sichere URLs, die sofort im Stream laufen.'
  },
  {
    title: 'Teamfähig & skalierbar',
    detail: 'Rollen, Workspaces und gemeinsame Presets für jede Community-Größe.'
  },
  {
    title: 'Realtime Kontrolle',
    detail: 'Live-Aktionen, Chat-Events und Alerts ohne Verzögerung.'
  }
];

const useCases = [
  {
    title: 'Stream Mastery',
    detail: 'Koordiniere Overlays, Alerts und Szenenwechsel in einer klaren Oberfläche.'
  },
  {
    title: 'Community Engagement',
    detail: 'Slot Requests, Bonus Hunts und Turnierflows werden mit wenigen Klicks gestartet.'
  },
  {
    title: 'Revenue Flow',
    detail: 'Neue Upsells, Abos und Sponsor-Integrationen mit Echtzeit-Tracking.'
  }
];

const testimonials = [
  {
    name: 'Nora „Lumi“ Heiss',
    role: 'Creator & Stream Lead',
    quote:
      'Endlich ein Dashboard, das die ganze Crew abholt. Unsere Overlays sind schneller live als je zuvor.'
  },
  {
    name: 'Murat Kaya',
    role: 'Community Manager',
    quote:
      'Bonus Hunts und Requests laufen wieder stabil. Wir sparen uns Chaos im Chat und in Discord.'
  },
  {
    name: 'Lena Fuchs',
    role: 'Agency Producer',
    quote:
      'Die neue Struktur zeigt klar, was als nächstes kommt. Planung und Produktion sind planbar.'
  }
];

const pricing = [
  {
    title: 'Starter',
    price: 'Kostenlos',
    description: 'Für neue Creator, die Overlays und Aktionen testen möchten.',
    items: ['1 Workspace', '2 Overlays', 'Basis-Alerts', 'Community Lite']
  },
  {
    title: 'Creator Pro',
    price: '29€ / Monat',
    description: 'Für aktive Streamer mit Community und Team-Support.',
    items: ['Unbegrenzte Overlays', 'Realtime Aktionen', 'Team-Rollen', 'Priority Support']
  },
  {
    title: 'Studio',
    price: 'Individuell',
    description: 'Für Agenturen & große Teams mit individuellen Workflows.',
    items: ['Multi-Workspace', 'Custom Integrationen', 'SLA & Support', 'Dedicated Success']
  }
];

const faq = [
  {
    question: 'Wann geht die neue Plattform live?',
    answer:
      'Wir liefern modulweise aus. Der Overlay-Editor ist zuerst dran, danach folgen Community-Aktionen und Billing.'
  },
  {
    question: 'Kann ich mein bestehendes Setup migrieren?',
    answer:
      'Ja. Wir planen Importer für die wichtigsten Overlay- und Preset-Strukturen. Details folgen im Creator-Portal.'
  },
  {
    question: 'Wie sieht der Support aus?',
    answer:
      'Creator Pro erhält priorisierten Support. Studio-Kunden bekommen einen dedizierten Ansprechpartner.'
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
              Wir bauen LiveWidgets neu auf – produktionsbereit, modular und für
              echte Creator-Teams.
            </h1>
            <p className="max-w-2xl text-base text-slate-200 md:text-lg">
              Der Relaunch liefert eine stabile Basis, klare Workflows und ein
              Setup, das sich in Minuten in OBS integrieren lässt. Transparente
              Roadmaps und feste Releases ersetzen Wildwuchs und Trial & Error.
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
              href="#pricing"
            >
              Preise ansehen
            </a>
          </div>
        </div>
        <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-indigo-500/20 blur-[120px]" />
      </section>

      <section className="px-6 pb-16">
        <div className="mx-auto grid w-full max-w-6xl gap-6 rounded-3xl border border-white/10 bg-slate-900/60 p-8 md:grid-cols-3">
          {launchHighlights.map((highlight) => (
            <div key={highlight.title} className="space-y-2">
              <h3 className="text-lg font-semibold text-white">
                {highlight.title}
              </h3>
              <p className="text-sm text-slate-300">{highlight.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-8 flex flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.35em] text-indigo-300">
              Productive
            </p>
            <h2 className="text-2xl font-semibold text-white md:text-3xl">
              So hilft LiveWidgets im Alltag
            </h2>
            <p className="max-w-2xl text-sm text-slate-300 md:text-base">
              Fokus auf reale Aufgaben: Szenen schnell live bringen, Communitys
              moderieren und Einnahmen sichtbar machen.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {useCases.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-slate-900/70 p-5"
              >
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-2 text-xs text-slate-300">{item.detail}</p>
              </div>
            ))}
          </div>
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

      <section className="px-6 pb-20">
        <div className="mx-auto w-full max-w-6xl rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-950/80 to-indigo-900/30 p-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white md:text-3xl">
                Stimmen aus der Creator-Welt
              </h2>
              <p className="text-sm text-slate-300">
                Erste Partner geben Feedback zum Neuaufbau. Wir bauen LiveWidgets
                gemeinsam mit Creator-Teams, Agenturen und Community-Managern.
              </p>
              <a
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white/90 transition hover:border-white/40 hover:text-white"
                href="/dashboard/settings"
              >
                Workspace anlegen
              </a>
            </div>
            <div className="grid gap-4">
              {testimonials.map((item) => (
                <div
                  key={item.name}
                  className="rounded-2xl border border-white/10 bg-slate-950/70 p-4"
                >
                  <p className="text-sm text-slate-200">“{item.quote}”</p>
                  <p className="mt-3 text-xs font-semibold text-white">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-400">{item.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24" id="pricing">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-8 flex flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.35em] text-indigo-300">
              Pricing
            </p>
            <h2 className="text-2xl font-semibold text-white md:text-3xl">
              Ein Plan für jedes Team
            </h2>
            <p className="max-w-2xl text-sm text-slate-300 md:text-base">
              Starte kostenfrei oder geh direkt in den Creator Pro-Plan. Studio
              liefert individuelle Workflows für größere Produktionen.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {pricing.map((tier) => (
              <div
                key={tier.title}
                className="flex h-full flex-col rounded-2xl border border-white/10 bg-slate-900/70 p-6"
              >
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-white">{tier.title}</p>
                  <p className="text-2xl font-semibold text-white">
                    {tier.price}
                  </p>
                  <p className="text-sm text-slate-300">{tier.description}</p>
                </div>
                <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-200">
                  {tier.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-indigo-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <button className="mt-6 rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white/90 transition hover:border-white/40 hover:text-white">
                  Demo anfragen
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white md:text-3xl">
                Häufige Fragen
              </h2>
              <p className="text-sm text-slate-300">
                Wir liefern Transparenz zu Launch, Migration und Support, damit
                der Relaunch planbar wird.
              </p>
            </div>
            <div className="grid gap-4">
              {faq.map((item) => (
                <div
                  key={item.question}
                  className="rounded-2xl border border-white/10 bg-slate-900/70 p-5"
                >
                  <p className="text-sm font-semibold text-white">
                    {item.question}
                  </p>
                  <p className="mt-2 text-xs text-slate-300">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 rounded-3xl border border-white/10 bg-indigo-500/10 p-8 md:flex-row md:items-center">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-indigo-300">
              Ready to ship
            </p>
            <h2 className="text-2xl font-semibold text-white md:text-3xl">
              Bereit für den nächsten Launch-Schritt?
            </h2>
            <p className="text-sm text-slate-200">
              Starte mit der Dashboard Preview oder sprich mit uns über deinen
              Studio-Setup.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400"
              href="/dashboard"
            >
              Zum Dashboard
            </a>
            <a
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/90 transition hover:border-white/40 hover:text-white"
              href="/dashboard/settings"
            >
              Demo starten
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
