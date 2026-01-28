import Link from 'next/link';

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/overlays', label: 'Overlays' },
  { href: '/community', label: 'Community' },
  { href: '/billing', label: 'Billing' },
  { href: '/settings', label: 'Settings' }
];

export default function AppLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pb-16 pt-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-indigo-300">
              Creator Workspace
            </p>
            <h1 className="text-2xl font-semibold text-white">LiveWidgets</h1>
            <p className="text-sm text-slate-300">
              Ein Raum für deine Live-Show: Overlays, Community-Flow und
              Monetarisierung greifen hier ineinander.
            </p>
          </div>
          <div className="rounded-full border border-white/10 bg-slate-900/60 px-4 py-2 text-xs text-slate-200">
            Workspace: Neon Lotus · Creator Plan
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

        <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
