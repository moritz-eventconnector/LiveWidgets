const highlights = [
  {
    title: 'Einfacher Einstieg',
    detail: 'Single-Domain Setup, damit Auth und Overlays direkt zusammenarbeiten.'
  },
  {
    title: 'Creator Fokus',
    detail: 'Baue dein Overlay-Stacking, bevor du den Stream live schaltest.'
  },
  {
    title: 'Realtime Ready',
    detail: 'Socket-Events laufen unter der gleichen Domain wie dein Dashboard.'
  }
];

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-16">
        <header className="space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-indigo-300">
            LiveWidgets Login
          </p>
          <h1 className="text-3xl font-semibold text-white">
            Willkommen zurück, Creator.
          </h1>
          <p className="text-base text-slate-300">
            Der Login ist aktuell ein Platzhalter. Hier entsteht der Entry-Point
            für Creator, die direkt in ihr Dashboard springen.
          </p>
        </header>

        <section className="grid gap-6 rounded-3xl border border-white/10 bg-slate-900/40 p-8 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <h2 className="text-xl font-semibold text-white">Sign-In</h2>
            <div className="space-y-4 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">
                  Twitch OAuth
                </p>
                <p className="mt-2 text-sm">
                  Die OAuth-Anbindung wird im nächsten Schritt integriert.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">
                  Creator Zugang
                </p>
                <p className="mt-2 text-sm">
                  Login ist aktuell nicht aktiv, aber das Layout steht für den
                  finalen Flow bereit.
                </p>
              </div>
            </div>
            <button
              className="w-full rounded-full border border-white/10 bg-white/10 px-6 py-3 text-sm font-semibold text-white/60"
              disabled
              type="button"
            >
              Login wird aktiviert
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Was dich erwartet</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              {highlights.map((item) => (
                <li
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-slate-950/60 p-4"
                >
                  <p className="text-sm font-semibold text-white">
                    {item.title}
                  </p>
                  <p className="mt-2 text-xs text-slate-300">{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
