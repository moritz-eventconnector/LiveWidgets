import Link from 'next/link';
import CreatorShell from '../components/creator-shell';

const modules = [
  {
    title: 'Bonus Hunt',
    description:
      'Slots anlegen, Freispiele sammeln und Ergebnisse live sichtbar machen.',
    href: '/bonus-hunt',
    points: [
      'Slot-Liste pflegen + Freispiele tracken',
      'OBS Overlay-URL für Zwischenstände',
      'Tipps & Auswertung für den Chat'
    ]
  },
  {
    title: 'Slot Requests',
    description:
      'Twitch-Chat requests sammeln, sortieren und transparent abarbeiten.',
    href: '/slot-requests',
    points: [
      '!sr Integration und Limits pro Viewer',
      'Queue live im Stream einblendbar',
      'Raffle-Pick, Reorder & Clear'
    ]
  },
  {
    title: 'Tournaments',
    description:
      'Slot-Battles planen, Teilnehmer organisieren und den Bracket teilen.',
    href: '/tournaments',
    points: [
      'Chat-Registrierung für Teilnehmer',
      'Öffentlicher Turnierbaum-Link',
      'Live Match-Status als Overlay'
    ]
  }
];

const highlights = [
  {
    label: 'Overlay URLs',
    value: '3 Live-Scenes',
    note: 'Bereit für OBS'
  },
  {
    label: 'Chat Commands',
    value: '!sr, !hunt, !join',
    note: 'Limiter & Mods'
  },
  {
    label: 'Exports',
    value: 'CSV + Highlight Cards',
    note: 'Für Social Posts'
  }
];

const quickActions = [
  {
    title: 'Twitch verbinden',
    detail: 'Verbinde Chat-Befehle & Mod-Rollen in weniger als 2 Minuten.'
  },
  {
    title: 'Overlay speichern',
    detail: 'Kopiere die OBS-Links und speichere sie als Szene.'
  },
  {
    title: 'Community auswerten',
    detail: 'Ergebnisse und Tipps direkt nach dem Stream exportieren.'
  }
];

export default function HomePage() {
  return (
    <CreatorShell
      title="Creator Dashboard"
      subtitle="Baue deine komplette Live-Show neu auf: Bonus Hunts, Slot Requests und Tournaments sind startklar."
    >
      <div className="flex flex-col gap-10">
        <section className="grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-slate-950/70 p-4"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">
                {item.label}
              </p>
              <p className="mt-3 text-lg font-semibold text-white">
                {item.value}
              </p>
              <p className="mt-1 text-xs text-slate-300">{item.note}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {modules.map((module) => (
            <article
              key={module.title}
              className="flex h-full flex-col rounded-2xl border border-white/10 bg-slate-950/70 p-6"
            >
              <h2 className="text-xl font-semibold text-white">
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
                <Link
                  href={module.href}
                  className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
                >
                  Modul öffnen
                </Link>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-950/70 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Quick-Setup für deinen Stream
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                In drei Schritten startklar – ohne alte Fehler oder Abhängigkeiten.
              </p>
            </div>
            <Link
              href="/overlays"
              className="rounded-xl border border-indigo-400/30 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-100 transition hover:bg-indigo-500/20"
            >
              Overlay-Bibliothek öffnen
            </Link>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {quickActions.map((action) => (
              <div
                key={action.title}
                className="rounded-xl border border-white/10 bg-slate-900/70 p-4"
              >
                <p className="text-sm font-semibold text-white">
                  {action.title}
                </p>
                <p className="mt-2 text-xs text-slate-300">{action.detail}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </CreatorShell>
  );
}
