import Link from 'next/link';
import CreatorShell from '../../components/creator-shell';

const stages = [
  {
    title: 'Slots erfassen',
    detail:
      'Liste alle Slots mit Einsatz, Anbieter und Ziel-Freispielen, damit der Hunt strukturiert bleibt.'
  },
  {
    title: 'Freispiele sammeln',
    detail:
      'Markiere Freispiele pro Slot und tracke, welche Spins noch offen sind.'
  },
  {
    title: 'Ergebnisse auswerten',
    detail:
      'Dokumentiere Gewinne, Highlights und ROI direkt nach der Session.'
  }
];

const overlays = [
  {
    label: 'OBS Overlay',
    value: 'livewidgets.de/overlay/bonus-hunt',
    note: 'Zeigt Progress, ROI & aktuelle Freispiele'
  },
  {
    label: 'Community Tipps',
    value: 'livewidgets.de/bonus-hunt/tipps',
    note: 'Chat tippt Bonus-Auszahlungen'
  }
];

export default function BonusHuntPage() {
  return (
    <CreatorShell
      title="Bonus Hunt"
      subtitle="Freispiele sauber tracken, Ergebnisse teilen und deinen Chat aktiv einbinden."
    >
      <div className="flex flex-col gap-8">
        <section className="grid gap-4 md:grid-cols-2">
          {overlays.map((overlay) => (
            <div
              key={overlay.label}
              className="rounded-2xl border border-white/10 bg-slate-950/70 p-5"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">
                {overlay.label}
              </p>
              <p className="mt-3 text-base font-semibold text-white">
                {overlay.value}
              </p>
              <p className="mt-1 text-xs text-slate-300">{overlay.note}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-950/70 p-6">
          <h2 className="text-lg font-semibold text-white">
            Workflow für deine Hunts
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {stages.map((stage) => (
              <div
                key={stage.title}
                className="rounded-xl border border-white/10 bg-slate-900/70 p-4"
              >
                <p className="text-sm font-semibold text-white">{stage.title}</p>
                <p className="mt-2 text-xs text-slate-300">{stage.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-indigo-400/30 bg-indigo-500/10 p-6">
          <h3 className="text-base font-semibold text-white">
            Nächster Schritt
          </h3>
          <p className="mt-2 text-sm text-slate-200">
            Starte einen neuen Hunt, lege Slots an und teile den Tipp-Link mit
            deinem Chat.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white"
              type="button"
            >
              Hunt erstellen
            </button>
            <Link
              className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white"
              href="/"
            >
              Zurück zum Dashboard
            </Link>
          </div>
        </section>
      </div>
    </CreatorShell>
  );
}
