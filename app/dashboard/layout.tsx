const navItems = [
  { label: 'Übersicht', href: '/dashboard' },
  { label: 'Overlays', href: '/dashboard/overlays' },
  { label: 'Community', href: '/dashboard/community' },
  { label: 'Billing', href: '/dashboard/billing' },
  { label: 'Settings', href: '/dashboard/settings' }
];

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">
              LiveWidgets
            </p>
            <h1 className="text-xl font-semibold text-white">
              Creator Dashboard
            </h1>
          </div>
          <nav className="flex flex-wrap gap-2 text-sm">
            {navItems.map((item) => (
              <a
                key={item.href}
                className="rounded-full border border-white/10 px-4 py-2 text-white/80 transition hover:border-indigo-400/60 hover:text-white"
                href={item.href}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>
      <main className="px-6 py-12">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
