import ModuleCard from '@/components/ModuleCard';

const overlaySteps = [
  {
    title: 'Overlay Presets',
    detail: 'Kern-Layouts definieren und als Preset-Bausteine speichern.'
  },
  {
    title: 'Token & Zugriff',
    detail: 'Sichere Overlay-Tokens und Zugriffsschutz für OBS-URLs.'
  },
  {
    title: 'Live Preview',
    detail: 'Szenenverwaltung mit Live-Vorschau und Test-Events.'
  }
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
          <ModuleCard key={step.title} {...step} />
        ))}
      </div>
    </section>
  );
}
