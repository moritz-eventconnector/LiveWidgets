import Link from 'next/link';

const navItems = [
  { href: '/app', label: 'Overview' },
  { href: '/app/bonus-hunts', label: 'Bonus Hunts' },
  { href: '/app/slot-requests', label: 'Slot Requests' },
  { href: '/app/tournaments', label: 'Tournaments' },
  { href: '/app/overlays', label: 'Overlays' },
  { href: '/app/twitch', label: 'Twitch' },
  { href: '/app/billing', label: 'Billing' },
  { href: '/app/settings', label: 'Settings' }
];

export default function DashboardNav() {
  return (
    <aside className="min-h-screen w-full border-r border-white/10 bg-obs-card px-4 py-6 md:w-60">
      <div className="text-lg font-semibold">LiveWidgets</div>
      <nav className="mt-6 space-y-2 text-sm">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-lg px-3 py-2 text-white/70 hover:bg-white/5 hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
