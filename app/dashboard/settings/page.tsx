import WorkspaceSettingsForm from '@/components/WorkspaceSettingsForm';

const settingsChecklist = [
  {
    title: 'Workspace-Profil & Branding',
    detail: 'Logo, Farben und Overlay-Defaults für dein gesamtes Team.'
  },
  {
    title: 'Team-Mitglieder & Rollen',
    detail: 'Lade Operatoren ein, definiere Berechtigungen und Onboarding-Flows.'
  },
  {
    title: 'API Tokens & Integrationen',
    detail: 'Verbinde Tools wie OBS, Discord, Spotify oder Stripe.'
  }
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
          Die Settings bekommen als nächstes echte Konfigurationen. Der erste
          Schritt ist ein Workspace-Setup, das Branding, Lokalisierung und
          Standard-Automationen bündelt.
        </p>
      </header>

      <WorkspaceSettingsForm />

      <div className="grid gap-4 md:grid-cols-3">
        {settingsChecklist.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"
          >
            <p className="text-sm font-semibold text-white">{item.title}</p>
            <p className="mt-2 text-xs text-slate-300">{item.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
