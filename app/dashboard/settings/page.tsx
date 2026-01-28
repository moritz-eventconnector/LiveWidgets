const settingsChecklist = [
  'Workspace-Profil & Branding',
  'Team-Mitglieder & Rollen',
  'API Tokens & Integrationen'
];

export default function SettingsPage() {
  return (
    <section className="flex flex-col gap-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-indigo-300">
          Settings
        </p>
        <h2 className="text-2xl font-semibold text-white">
          Einstellungen & Administration
        </h2>
        <p className="text-sm text-slate-300">
          Hier entsteht der zentrale Ort für Workspace-Setup, Rollenverwaltung
          und Integrationen.
        </p>
      </header>

      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
        <ul className="space-y-3 text-sm text-slate-200">
          {settingsChecklist.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-indigo-400" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
