import Link from 'next/link';
import type { ReactNode } from 'react';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import AuthUserMenu from '@/components/auth-user-menu';

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/bonus-hunt', label: 'Bonus Hunt' },
  { href: '/slot-requests', label: 'Slot Requests' },
  { href: '/tournaments', label: 'Tournaments' },
  { href: '/overlays', label: 'Overlays' },
  { href: '/app/settings', label: 'Settings' }
];

type CreatorShellProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
};

export default async function CreatorShell({
  children,
  title = 'Creator Dashboard',
  subtitle = 'Plane, steuere und präsentiere deine Module – alles an einem Ort.'
}: CreatorShellProps) {
  const session = process.env.NEXTAUTH_SECRET
    ? await getServerSession(authOptions)
    : null;
  const user = session?.user ?? null;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-20 pt-12">
        <header className="flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.35em] text-indigo-300">
              LiveWidgets Creator Suite
            </p>
            <h1 className="text-3xl font-semibold text-white">{title}</h1>
            <p className="max-w-2xl text-sm text-slate-300">{subtitle}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-xs text-slate-200">
            {user ? (
              <AuthUserMenu
                name={user.name}
                email={user.email}
                image={user.image}
              />
            ) : (
              <div className="flex flex-col gap-3 text-xs text-slate-200">
                <p className="text-xs uppercase tracking-[0.2em] text-indigo-300">
                  Nicht angemeldet
                </p>
                <p className="text-sm text-slate-300">
                  Melde dich an, um deine Workspace-Daten zu speichern.
                </p>
                <Link
                  href="/login"
                  className="inline-flex w-fit items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition hover:border-indigo-400/60 hover:bg-white/10"
                >
                  Zum Login
                </Link>
              </div>
            )}
          </div>
        </header>

        <nav className="flex flex-wrap gap-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-indigo-400/60 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <main className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
