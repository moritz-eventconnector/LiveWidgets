import ModuleCard from '@/components/ModuleCard';

const pulseStats = [
  {
    title: 'Overlay Studio',
    detail: 'Startklar für neue Szenen · 5 Presets im Entwurf'
  },
  {
    title: 'Community Flow',
    detail: 'Queue-Logik wartet auf Go-Live · 8 aktive Slots'
  },
  {
    title: 'Revenue Pulse',
    detail: 'Creator-Plan in Prüfung · Trial-Flow vorbereitet'
  }
];

const focusBlocks = [
  {
    title: 'Heute fokussieren',
    detail:
      'Neue Stream-Season? Baue ein Start-Overlay und plane den ersten Community-Moment.'
  },
  {
    title: 'Demo-Check',
    detail:
      'Teste die Echtzeit-Ansicht im Overlay-Panel und sichere die Szene als Preset.'
  },
  {
    title: 'Nächster Launch',
    detail:
      'Aktiviere den Creator-Plan und bereite die ersten Subscriber-Benefits vor.'
  }
];

const signalStack = [
  {
    title: 'Widgets',
    detail: 'Overlay Tokens, Live Alerts und Szenen-Stacks.'
  },
  {
    title: 'Community',
    detail: 'Queue-Management, Turniere und Mod-Automationen.'
  },
  {
    title: 'Monetarisierung',
    detail: 'Creator-Pläne, Subscriptions und Upsells.'
  }
];

export default function AppHome() {
  return (
    <div className="flex flex-col gap-8">
      <header className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          Willkommen im Creator Dashboard
        </h2>
        <p className="text-sm text-slate-300">
          Hier entsteht die zentrale Steuerung für LiveWidgets. Der Fokus liegt
          auf klaren Signalen: Was steht live, was kommt als Nächstes, was
          braucht noch Freigabe.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {pulseStats.map((item) => (
          <ModuleCard key={item.title} {...item} />
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {focusBlocks.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-white/10 bg-slate-950/70 p-6"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">
              Fokus
            </p>
            <h3 className="mt-3 text-lg font-semibold text-white">
              {item.title}
            </h3>
            <p className="mt-3 text-sm text-slate-300">{item.detail}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-white/10 bg-slate-950/70 p-6">
        <h3 className="text-lg font-semibold text-white">Signal Stack</h3>
        <p className="mt-2 text-sm text-slate-300">
          Alle Kernmodule laufen unter einer Domain – dadurch werden Auth,
          Integrationen und Realtime-Events konsistent ausgeliefert.
        </p>
        <div className="mt-4 grid gap-3 text-sm text-slate-200 md:grid-cols-3">
          {signalStack.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-white/10 bg-slate-900/70 p-4"
            >
              <p className="text-sm font-semibold text-white">{item.title}</p>
              <p className="mt-2 text-xs text-slate-300">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
