import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import WorkspaceSettingsForm from '@/components/WorkspaceSettingsForm';
import { authOptions } from '@/lib/auth';

const securityChecklist = [
  {
    title: 'Auth & Rollen',
    detail: 'SAML/SSO, Rollenprofile und sichere Tokenverwaltung.'
  },
  {
    title: 'Audit-Logs',
    detail: 'Änderungen und Aktionen aller Teammitglieder nachhalten.'
  },
  {
    title: 'Integrationen',
    detail: 'OBS, Discord, Twitch, Stripe und weitere Schnittstellen.'
  }
];

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/login');
  }

  return (
    <section className="flex flex-col gap-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-indigo-300">
          Settings
        </p>
        <h2 className="text-2xl font-semibold text-white">
          Workspace & Sicherheit
        </h2>
        <p className="text-sm text-slate-300">
          Pflege hier die Workspace-Details, die wir in deinen Modulen und
          Overlays automatisch verwenden.
        </p>
      </header>

      <WorkspaceSettingsForm />

      <div className="grid gap-4 md:grid-cols-3">
        {securityChecklist.map((item) => (
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
