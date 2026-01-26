export default function SubscriptionGate({
  status,
  allowInactive = false,
  children
}: {
  status: string;
  allowInactive?: boolean;
  children: React.ReactNode;
}) {
  if (status !== 'ACTIVE' && !allowInactive) {
    return (
      <div className="rounded-2xl border border-white/10 bg-obs-card p-6 text-sm text-white/70">
        Deine Subscription ist inaktiv. Bitte öffne die Billing-Seite, um Zugriff
        wiederherzustellen.
      </div>
    );
  }

  return <>{children}</>;
}
