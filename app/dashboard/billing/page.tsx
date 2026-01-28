const billingPlans = [
  {
    title: 'Creator',
    detail: 'Grundpaket für Solo-Streamer mit Kern-Overlays.'
  },
  {
    title: 'Creator Plus',
    detail: 'Mehr Slots, Team-Zugänge und Premium-Support.'
  },
  {
    title: 'Agency',
    detail: 'Workspaces, Multi-Channel und erweiterte Reports.'
  }
];

export default function BillingPage() {
  return (
    <section className="flex flex-col gap-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-indigo-300">
          Billing
        </p>
        <h2 className="text-2xl font-semibold text-white">
          Billing & Revenue Module
        </h2>
        <p className="text-sm text-slate-300">
          Stripe-Integration, Plan-Management und klare Abrechnungs-Transparenz
          werden als eigenes Modul aufgebaut.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {billingPlans.map((plan) => (
          <div
            key={plan.title}
            className="rounded-2xl border border-white/10 bg-slate-900/70 p-6"
          >
            <p className="text-sm font-semibold text-white">{plan.title}</p>
            <p className="mt-2 text-xs text-slate-300">{plan.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
