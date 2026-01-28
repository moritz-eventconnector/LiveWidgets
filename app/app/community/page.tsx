import ModuleCard from '@/components/ModuleCard';

const communityModules = [
  {
    title: 'Slot Requests',
    detail: 'Requests sammeln, priorisieren und im Stream ausspielen.'
  },
  {
    title: 'Bonus Hunts',
    detail: 'Hunt-Listen, Einsätze und Gewinner automatisch verwalten.'
  },
  {
    title: 'Turniere',
    detail: 'Turnier-Brackets, Teilnehmer und Preise zentral steuern.'
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
          Community Aktionen in Echtzeit
        </h2>
        <p className="text-sm text-slate-300">
          Moderation und Community-Spiele erhalten ein eigenes Kontrollzentrum
          für Stream-Operatoren und Mods.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {communityModules.map((item) => (
          <ModuleCard key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
}
