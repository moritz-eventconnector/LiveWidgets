'use client';

import { usePathname } from 'next/navigation';

export default function SubscriptionGate({
  status,
  children
}: {
  status: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isBilling = pathname === '/app/billing';

  if (status !== 'ACTIVE' && !isBilling) {
    return (
      <div className="rounded-2xl border border-white/10 bg-obs-card p-6 text-sm text-white/70">
        Deine Subscription ist inaktiv. Bitte öffne die Billing-Seite, um Zugriff
        wiederherzustellen.
      </div>
    );
  }

  return <>{children}</>;
}
