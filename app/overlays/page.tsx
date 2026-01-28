import Link from 'next/link';
import CreatorShell from '../../components/creator-shell';

const overlaySets = [
  {
    title: 'Bonus Hunt',
    url: 'livewidgets.de/overlay/bonus-hunt',
    description: 'Progress-Bar, Freispiele, ROI und letzte Gewinne.'
  },
  {
    title: 'Slot Requests',
    url: 'livewidgets.de/overlay/slot-requests',
    description: 'Queue-Liste mit aktuellem Slot und Viewer-Namen.'
  },
  {
    title: 'Tournaments',
    url: 'livewidgets.de/overlay/tournament',
    description: 'Runde, Match-Pairing und Score-Update in Echtzeit.'
  }
];

const obsSteps = [
  'Overlay in OBS als Browser-Quelle hinzufügen.',
  'Breite 1920px, Höhe 1080px und 60fps setzen.',
  'Nur die benötigten Layer sichtbar lassen.'
];

export default function OverlaysPage() {
  return (
    <CreatorShell
      title="Overlay Bibliothek"
      subtitle="Kopiere deine Overlay-Links und bring sie direkt in OBS."
    >
      <div className="flex flex-col gap-8">
        <section className="grid gap-4 md:grid-cols-3">
          {overlaySets.map((overlay) => (
            <div
              key={overlay.title}
              className="flex h-full flex-col rounded-2xl border border-white/10 bg-slate-950/70 p-5"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">
                {overlay.title}
              </p>
              <p className="mt-3 text-sm font-semibold text-white">
                {overlay.url}
              </p>
              <p className="mt-2 text-xs text-slate-300">
                {overlay.description}
              </p>
              <button
                className="mt-auto rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs text-white"
                type="button"
              >
                Link kopieren
              </button>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-950/70 p-6">
          <h2 className="text-lg font-semibold text-white">
            OBS Setup in 3 Schritten
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-200">
            {obsSteps.map((step) => (
              <li key={step} className="flex gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-indigo-400" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-indigo-400/30 bg-indigo-500/10 p-6">
          <h3 className="text-base font-semibold text-white">
            Overlay-Check durchführen
          </h3>
          <p className="mt-2 text-sm text-slate-200">
            Teste alle Overlays vor dem Stream, um alte Fehlermeldungen zu
            vermeiden.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white"
              type="button"
            >
              Overlay-Test starten
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
