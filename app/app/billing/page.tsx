import SectionCard from '@/components/SectionCard';

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Billing</h1>
        <p className="mt-2 text-sm text-white/70">
          Stripe Checkout, Customer Portal und Subscription Status.
        </p>
      </div>
      <SectionCard title="Aktueller Plan" description="Creator – 60 € / Monat">
        <div className="flex flex-wrap gap-3">
          <button className="rounded-full bg-obs-accent px-4 py-2 text-sm font-semibold">
            Upgrade im Stripe Portal
          </button>
          <button className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold">
            Zahlungsmethode aktualisieren
          </button>
        </div>
      </SectionCard>
      <SectionCard title="Status" description="Subscription ist aktiv">
        <div className="text-sm text-white/60">
          Widgets & Overlays sind freigeschaltet.
        </div>
      </SectionCard>
    </div>
  );
}
