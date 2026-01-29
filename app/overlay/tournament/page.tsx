const tournament = {
  title: 'Slot Battle Invitational',
  round: 'Halbfinale',
  match: {
    left: { name: 'Team Aurora', score: 2 },
    right: { name: 'Team Nova', score: 1 },
    status: 'Best of 5'
  },
  upcoming: [
    { left: 'Team Pulse', right: 'Team Orbit', time: 'In 20 Min' },
    { left: 'Team Echo', right: 'Team Blaze', time: 'In 45 Min' }
  ],
  highlight: [
    { label: 'Highroll', value: '12.400x' },
    { label: 'Top Slot', value: 'Wanted Dead or a Wild' },
    { label: 'MVP', value: 'Sina' }
  ]
};

export default function TournamentOverlay() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-10 py-10">
      <header className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-indigo-300">
            Tournament Overlay
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white">
            {tournament.title}
          </h1>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white">
          Runde: {tournament.round}
        </div>
      </header>

      <section className="rounded-3xl border border-white/10 bg-indigo-500/10 p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">
          Live Match
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 px-6 py-4 text-center">
            <p className="text-sm text-slate-300">Links</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {tournament.match.left.name}
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="text-4xl font-semibold text-white">
              {tournament.match.left.score} : {tournament.match.right.score}
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-300">
              {tournament.match.status}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 px-6 py-4 text-center">
            <p className="text-sm text-slate-300">Rechts</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {tournament.match.right.name}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
          <h2 className="text-lg font-semibold text-white">
            Kommende Matches
          </h2>
          <div className="mt-4 space-y-3">
            {tournament.upcoming.map((match) => (
              <div
                key={`${match.left}-${match.right}`}
                className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-white">
                    {match.left} vs {match.right}
                  </p>
                  <p className="text-xs text-slate-300">
                    Start: {match.time}
                  </p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white">
                  Upcoming
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
          <h2 className="text-lg font-semibold text-white">Highlights</h2>
          <div className="mt-4 space-y-3">
            {tournament.highlight.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3"
              >
                <span className="text-xs uppercase tracking-[0.3em] text-indigo-300">
                  {item.label}
                </span>
                <span className="text-sm font-semibold text-white">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
