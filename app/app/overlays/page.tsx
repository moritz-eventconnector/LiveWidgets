import ModuleCard from '@/components/ModuleCard';

const overlayModules = [
  {
    title: 'Preset Library',
    detail: 'Layouts speichern, versionieren und teamweit teilen.'
  },
  {
    title: 'Scene Builder',
    detail: 'Drag & Drop für Widgets, Alerts und dynamische Komponenten.'
  },
  {
    title: 'OBS Tokens',
    detail: 'Sichere Token-URLs für jede Szene & jede Produktion.'
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
          Overlay Studio – Kernmodule
        </h2>
        <p className="text-sm text-slate-300">
          Fokus auf robuste Presets, sichere Tokens und einen Editor, der in der
          Produktion nicht ausfällt.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {overlayModules.map((item) => (
          <ModuleCard key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
}
