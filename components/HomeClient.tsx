'use client';

const features = [
  {
    title: 'Bonus Hunts',
    description: 'Plan, track und präsentiere Bonus-Hunts mit Live-Updates.'
  },
  {
    title: 'Slot Requests',
    description: 'Viewer Requests sauber in einer Queue, steuerbar via Twitch Chat.'
  },
  {
    title: 'Tournaments',
    description: 'Brackets, Join Commands und Ergebnisse in Echtzeit.'
  },
  {
    title: 'OBS Overlays',
    description: 'Transparente Overlays, perfekt für OBS und StreamLayouts.'
  }
];

const steps = [
  {
    title: 'Login mit Twitch',
    description: 'Verbinde deinen Channel und erstelle automatisch deinen Workspace.'
  },
  {
    title: 'Widgets konfigurieren',
    description: 'Bonus Hunts, Slot Requests und Tournaments in Minuten einrichten.'
  },
  {
    title: 'Overlay in OBS einfügen',
    description: 'Kopiere deine Overlay-URL und starte den Stream.'
  }
];

const faqs = [
  {
    question: 'Unterstützt ihr echtes Glücksspiel?',
    answer:
      'Nein. LiveWidgets ist ein Streaming Companion ohne Echtgeld-Gambling oder Betting.'
  },
  {
    question: 'Wie schnell ist das Setup?',
    answer: 'In weniger als 5 Minuten ist dein Channel live.'
  },
  {
    question: 'Gibt es Team-Zugriff?',
    answer: 'Ja, Moderatoren können via Invite Zugriff erhalten.'
  }
];

export default function HomeClient() {
  const currentYear = 2024;
  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.livewidgets.de';

  return (
    <div className="min-h-screen bg-obs-black text-white">
      <header className="flex items-center justify-between px-6 py-6 md:px-16">
        <div className="text-xl font-semibold">LiveWidgets</div>
        <nav className="flex items-center gap-6 text-sm text-white/80">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a
            href={appBaseUrl}
            className="rounded-full bg-obs-accent px-4 py-2 text-white"
          >
            Login
          </a>
        </nav>
      </header>

      <main>
        <section className="px-6 pb-20 pt-12 md:px-16">
          <div className="max-w-3xl space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-obs-accent">
              Twitch Companion SaaS
            </p>
            <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
              Interaktive OBS-Overlays & Twitch-Widgets für professionelle Streams.
            </h1>
            <p className="text-lg text-white/70">
              LiveWidgets ist das Streaming OS für Bonushunts, Slot Requests und
              Tournaments. Multi-Tenant, Stripe Billing, Twitch Bot – alles aus einer
              Hand.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={appBaseUrl}
                className="rounded-full bg-obs-accent px-6 py-3 text-sm font-semibold text-white"
              >
                Get Started
              </a>
              <a
                href="#pricing"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold"
              >
                Pricing ansehen
              </a>
            </div>
          </div>
        </section>

        <section id="features" className="px-6 pb-20 md:px-16">
          <div className="grid gap-6 md:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-2xl bg-obs-card p-6">
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-white/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 pb-20 md:px-16">
          <h2 className="text-3xl font-semibold">So funktioniert es</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-2xl bg-obs-card p-6">
                <p className="text-sm text-obs-accent">Schritt {index + 1}</p>
                <h3 className="mt-2 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-white/70">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="px-6 pb-20 md:px-16">
          <h2 className="text-3xl font-semibold">Pricing</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-obs-card p-6">
              <h3 className="text-xl font-semibold">Creator</h3>
              <p className="mt-2 text-3xl font-semibold">60 € / Monat</p>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li>Bonus Hunts</li>
                <li>Slot Requests</li>
                <li>Tournaments</li>
                <li>OBS Overlays</li>
              </ul>
              <a
                href={appBaseUrl}
                className="mt-6 inline-flex rounded-full bg-obs-accent px-5 py-2 text-sm font-semibold"
              >
                Starten
              </a>
            </div>
            <div className="rounded-2xl border border-white/10 bg-obs-card p-6">
              <h3 className="text-xl font-semibold">Creator+</h3>
              <p className="mt-2 text-3xl font-semibold">90 € / Monat</p>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li>Alles aus Creator</li>
                <li>Website-Baukasten (extern bereitgestellt)</li>
                <li>Feature-Flag aktivierbar</li>
              </ul>
              <a
                href={appBaseUrl}
                className="mt-6 inline-flex rounded-full border border-white/20 px-5 py-2 text-sm font-semibold"
              >
                Upgrade
              </a>
            </div>
          </div>
        </section>

        <section className="px-6 pb-20 md:px-16">
          <h2 className="text-3xl font-semibold">FAQ</h2>
          <div className="mt-8 space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl bg-obs-card p-6">
                <h3 className="text-lg font-semibold">{faq.question}</h3>
                <p className="mt-2 text-sm text-white/70">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-10 text-sm text-white/60 md:px-16">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p>© {currentYear} LiveWidgets</p>
          <p>
            LiveWidgets is a streaming companion. No gambling, no betting, no
            real-money games.
          </p>
        </div>
      </footer>
    </div>
  );
}
