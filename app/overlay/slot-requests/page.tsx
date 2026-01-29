const queue = {
  title: 'Slot Request Queue',
  activeSlot: {
    name: 'Starlight Princess',
    requestedBy: 'Aylin',
    stake: '1.00',
    provider: 'Pragmatic Play'
  },
  nextUp: [
    { name: 'Sugar Rush', requestedBy: 'Jonas' },
    { name: 'Gates of Olympus', requestedBy: 'Tobi' },
    { name: 'Book of Dead', requestedBy: 'Mara' },
    { name: 'Le Bandit', requestedBy: 'Kai' }
  ],
  waiting: [
    { name: 'Sweet Bonanza', requestedBy: 'Nina' },
    { name: 'Big Bass Bonanza', requestedBy: 'Phil' },
    { name: 'Hand of Anubis', requestedBy: 'Leo' },
    { name: 'Dead or Alive 2', requestedBy: 'Sina' },
    { name: 'Mental', requestedBy: 'Robin' }
  ]
};

export default function SlotRequestsOverlay() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-10 py-10">
      <header className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-indigo-300">
            Slot Requests Overlay
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white">
            {queue.title}
          </h1>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white">
          {queue.nextUp.length + queue.waiting.length + 1} Requests aktiv
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-3xl border border-white/10 bg-indigo-500/10 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">
            Aktueller Slot
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white">
            {queue.activeSlot.name}
          </h2>
          <p className="mt-2 text-sm text-slate-200">
            Request von <span className="font-semibold">{
              queue.activeSlot.requestedBy
            }</span>{' '}
            · {queue.activeSlot.provider}
          </p>
          <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-200">
            Einsatz: {queue.activeSlot.stake} €
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
          <h3 className="text-base font-semibold text-white">Als Nächstes</h3>
          <div className="mt-4 space-y-3">
            {queue.nextUp.map((slot) => (
              <div
                key={slot.name}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-white">
                    {slot.name}
                  </p>
                  <p className="text-xs text-slate-300">
                    {slot.requestedBy}
                  </p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white">
                  Next
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-base font-semibold text-white">Warteliste</h3>
          <p className="text-sm text-slate-300">
            {queue.waiting.length} Slots in der Queue
          </p>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {queue.waiting.map((slot) => (
            <div
              key={`${slot.name}-${slot.requestedBy}`}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-white">{slot.name}</p>
                <p className="text-xs text-slate-300">{slot.requestedBy}</p>
              </div>
              <span className="text-xs text-slate-300">Wartend</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
