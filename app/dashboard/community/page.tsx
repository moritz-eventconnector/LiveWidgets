const communityTracks = [
  {
    title: 'Slot Requests',
    detail: 'Neue Queue-Logik, Moderationsaktionen und Rate-Limits.'
  },
  {
    title: 'Bonus Hunts',
    detail: 'Einheitliches State-Handling + Overlay-Events.'
  },
  {
    title: 'Turniere',
    detail: 'Join-Flows, Brackets und Match-Updates.'
  }
];

export default function CommunityPage() {
  return (
    <section className="flex flex-col gap-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-indigo-300">
          Community
        </p>
        <h2 className="text-2xl font-semibold text-white">
          Aktionen für die Community
        </h2>
        <p className="text-sm text-slate-300">
          Hier bündeln wir alle Features, die Chat, Zuschauer und Moderatoren
          verbinden. Der Fokus liegt auf klaren Flows und stabiler Realtime-Logik.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {communityTracks.map((track) => (
          <div
            key={track.title}
            className="rounded-2xl border border-white/10 bg-slate-900/70 p-6"
          >
            <p className="text-sm font-semibold text-white">{track.title}</p>
            <p className="mt-2 text-xs text-slate-300">{track.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
