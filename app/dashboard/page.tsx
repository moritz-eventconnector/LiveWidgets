const quickLinks = [
  {
    title: 'Overlay Editor',
    description: 'Verwalte Layouts, Farben und Szenen mit Live Preview.'
  },
  {
    title: 'Community Aktionen',
    description: 'Steuere Slot Requests, Bonus Hunts und Turnier-Queues.'
  },
  {
    title: 'Abos & Billing',
    description: 'Neue Preisstufen, Upsells und klare Rechnungs-Logs.'
  }
];

export default function DashboardPage() {
  return (
    <main className="px-6 py-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-indigo-300">
            Creator Dashboard
          </p>
          <h1 className="text-3xl font-semibold text-white md:text-4xl">
            Das neue Dashboard ist im Aufbau
          </h1>
          <p className="max-w-2xl text-sm text-slate-300 md:text-base">
            Diese Ansicht dient als Platzhalter für die neue App-Struktur. Von
            hier aus werden wir Module wie Billing, Overlay Studio und
            Community-Tools zusammenführen.
          </p>
        </header>
        <section className="grid gap-6 md:grid-cols-3">
          {quickLinks.map((link) => (
            <div
              key={link.title}
              className="rounded-2xl border border-white/10 bg-slate-900/70 p-6"
            >
              <h2 className="text-lg font-semibold text-white">{link.title}</h2>
              <p className="mt-3 text-sm text-slate-300">{link.description}</p>
            </div>
          ))}
        </section>
        <div className="rounded-2xl border border-indigo-500/40 bg-indigo-500/10 p-6 text-sm text-indigo-100">
          <p className="font-semibold">Nächster Schritt</p>
          <p className="mt-2 text-indigo-100/80">
            Datenmodell, Auth und Realtime Gateway als Grundpfeiler der neuen
            Plattform aufsetzen.
          </p>
        </div>
      </div>
    </main>
  );
}
