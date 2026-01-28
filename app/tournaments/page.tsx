import Link from 'next/link';
import CreatorShell from '../../components/creator-shell';

const tournamentFlow = [
  {
    title: 'Teilnehmer sammeln',
    detail: 'Chat meldet sich via !join an, du kontrollierst Slots & Seeds.'
  },
  {
    title: 'Bracket veröffentlichen',
    detail: 'Teile den Turnierbaum als Link für Zuschauer & Mitspieler.'
  },
  {
    title: 'Match-Status posten',
    detail: 'Ergebnisse pro Runde festhalten und Highlights markieren.'
  }
];

const tournamentLinks = [
  {
    label: 'Bracket Link',
    value: 'livewidgets.de/tournaments/bracket',
    note: 'Öffentlicher Turnierbaum'
  },
  {
    label: 'OBS Overlay',
    value: 'livewidgets.de/overlay/tournament',
    note: 'Zeigt Runde, Match & Score'
  }
];

export default function TournamentsPage() {
  return (
    <CreatorShell
      title="Tournaments"
      subtitle="Slot-Battles strukturieren, Brackets teilen und live updaten."
    >
      <div className="flex flex-col gap-8">
        <section className="grid gap-4 md:grid-cols-2">
          {tournamentLinks.map((link) => (
            <div
              key={link.label}
              className="rounded-2xl border border-white/10 bg-slate-950/70 p-5"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">
                {link.label}
              </p>
              <p className="mt-3 text-base font-semibold text-white">
                {link.value}
              </p>
              <p className="mt-1 text-xs text-slate-300">{link.note}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-950/70 p-6">
          <h2 className="text-lg font-semibold text-white">
            Turnier-Workflow
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {tournamentFlow.map((step) => (
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

        <section className="rounded-2xl border border-indigo-400/30 bg-indigo-500/10 p-6">
          <h3 className="text-base font-semibold text-white">
            Turnier starten
          </h3>
          <p className="mt-2 text-sm text-slate-200">
            Erstelle das Turnier, veröffentliche den Bracket-Link und bring den
            Overlay-Status live in deinen Stream.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white"
              type="button"
            >
              Neues Turnier anlegen
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
