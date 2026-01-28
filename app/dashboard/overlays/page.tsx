const overlaySteps = [
  'Overlay Presets definieren',
  'Token-Management & Zugriffsschutz',
  'Live Preview + Szenenverwaltung'
];

export default function OverlaysPage() {
  return (
    <section className="flex flex-col gap-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-indigo-300">
          Overlays
        </p>
        <h2 className="text-2xl font-semibold text-white">
          Overlay Studio – nächste Meilensteine
        </h2>
        <p className="text-sm text-slate-300">
          Das Overlay-Modul wird als erstes Live-Feature wieder aufgebaut. Diese
          Liste beschreibt die nächsten Lieferpakete.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {overlaySteps.map((step) => (
          <div
            key={step}
            className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 text-sm text-slate-200"
          >
            {step}
          </div>
        ))}
      </div>
    </section>
  );
}
