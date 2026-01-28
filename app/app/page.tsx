const moduleCards = [
  {
    title: 'Bonus Hunt',
    eyebrow: 'Freispiele sammeln',
    description:
      'Lege deine Slot-Liste an, sammle Freispiele, dokumentiere Ergebnisse und gib deinem Chat eine klare Übersicht.',
    points: [
      'Slots & Freispiele mit Status erfassen',
      'Overlay-URL für OBS mit Live-Zwischenständen',
      'Tipp-Feature für Zuschauer mit Auswertung'
    ],
    cta: 'Bonus Hunt öffnen'
  },
  {
    title: 'Slot Requests',
    eyebrow: 'Chat-Queue steuern',
    description:
      'Nimm Twitch-Requests über !sr an und verwalte die Reihenfolge transparent im Stream.',
    points: [
      'Twitch-Command !sr integriert',
      'Queue live im Overlay sichtbar',
      'Raffle-Pick, Sortieren & Löschen'
    ],
    cta: 'Slot Queue öffnen'
  },
  {
    title: 'Tournaments',
    eyebrow: 'Live Turniere',
    description:
      'Organisiere Slot-Battles, poste den Turnierbaum und zeige den aktuellen Stand im Overlay.',
    points: [
      'Teilnahme via Twitch Chat',
      'Öffentlicher Turnierbaum-Link',
      'Overlay-Status für Runde & Match'
    ],
    cta: 'Tournament Hub öffnen'
  }
];

const setupSteps = [
  {
    title: 'Twitch verbinden',
    detail: 'Chat-Befehle aktivieren, Mods festlegen und Limits setzen.'
  },
  {
    title: 'Overlay Links sichern',
    detail: 'OBS-URLs kopieren und als Szenen speichern.'
  },
  {
    title: 'Auswertung bereitstellen',
    detail: 'Exports und Highlights für Community-Posts vorbereiten.'
  }
];

const livePulse = [
  {
    label: 'Live Queues',
    value: '3 aktive Streams',
    note: 'Slot Requests warten'
  },
  {
    label: 'Bonus Hunts',
    value: '12 Freispiele offen',
    note: '6 Slots bereit'
  },
  {
    label: 'Tournaments',
    value: '2 Turniere geplant',
    note: 'Bracket Links bereit'
  }
];

export default function AppHome() {
  return (
    <div className="flex flex-col gap-10">
      <header className="space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">
          Creator Dashboard
        </p>
        <h1 className="text-3xl font-semibold text-white">
          Alle Hauptmodule im Blick – Bonus Hunts, Slot Requests & Turniere
        </h1>
        <p className="max-w-3xl text-sm text-slate-300">
          Dieses Dashboard ist dein zentraler Startpunkt: Plane Hunts, steuere
          den Chat und halte dein Publikum mit Live-Overlays auf dem Laufenden.
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          {livePulse.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-slate-950/70 p-4"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">
                {item.label}
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {item.value}
              </p>
              <p className="mt-1 text-xs text-slate-300">{item.note}</p>
            </div>
          ))}
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        {moduleCards.map((module) => (
          <article
            key={module.title}
            className="flex h-full flex-col rounded-2xl border border-white/10 bg-slate-950/70 p-6"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">
              {module.eyebrow}
            </p>
            <h2 className="mt-3 text-xl font-semibold text-white">
              {module.title}
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              {module.description}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-200">
              {module.points.map((point) => (
                <li key={point} className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-indigo-400" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-6">
              <button className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10">
                {module.cta}
              </button>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-white/10 bg-slate-950/70 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Setup in klaren Schritten
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              Einmal verbinden, dann jedes Modul in Minuten starten.
            </p>
          </div>
          <button className="rounded-xl border border-indigo-400/30 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-100 transition hover:bg-indigo-500/20">
            Setup-Check starten
          </button>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {setupSteps.map((step) => (
            <div
              key={step.title}
              className="rounded-xl border border-white/10 bg-slate-900/70 p-4"
            >
              <p className="text-sm font-semibold text-white">{step.title}</p>
              <p className="mt-2 text-xs text-slate-300">{step.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
