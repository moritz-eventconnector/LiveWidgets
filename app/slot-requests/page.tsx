import Link from 'next/link';
import CreatorShell from '../../components/creator-shell';

const queueSteps = [
  {
    title: 'Chat Command aktivieren',
    detail: '!sr akzeptiert Slot-Namen, max. 1 Request pro Viewer.'
  },
  {
    title: 'Queue moderieren',
    detail: 'Reihenfolge anpassen, doppelte Slots sperren oder löschen.'
  },
  {
    title: 'Raffle Pick',
    detail: 'Zufallswahl für spannende Slot-Finale im Stream.'
  }
];

const overlayInfo = [
  {
    label: 'OBS Overlay',
    value: 'livewidgets.de/overlay/slot-requests',
    note: 'Zeigt Queue, aktueller Slot & Warteliste'
  },
  {
    label: 'Viewer Status',
    value: 'livewidgets.de/slot-requests/queue',
    note: 'Öffentlicher Link für deinen Chat'
  }
];

export default function SlotRequestsPage() {
  return (
    <CreatorShell
      title="Slot Requests"
      subtitle="Baue eine transparente Queue, die dein Chat live verfolgen kann."
    >
      <div className="flex flex-col gap-8">
        <section className="grid gap-4 md:grid-cols-2">
          {overlayInfo.map((info) => (
            <div
              key={info.label}
              className="rounded-2xl border border-white/10 bg-slate-950/70 p-5"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">
                {info.label}
              </p>
              <p className="mt-3 text-base font-semibold text-white">
                {info.value}
              </p>
              <p className="mt-1 text-xs text-slate-300">{info.note}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-950/70 p-6">
          <h2 className="text-lg font-semibold text-white">Queue-Workflow</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {queueSteps.map((step) => (
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
            Moderation starten
          </h3>
          <p className="mt-2 text-sm text-slate-200">
            Öffne die Queue, prüfe neue Requests und picke den nächsten Slot
            live on stream.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white"
              type="button"
            >
              Queue öffnen
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
