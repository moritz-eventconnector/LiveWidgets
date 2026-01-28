const billingHighlights = [
  {
    title: 'Plan & Usage',
    detail: 'Abos, Nutzungslimits und Upsells transparent darstellen.'
  },
  {
    title: 'Revenue Widgets',
    detail: 'Live-KPIs für Team, Sponsoren und Creator anzeigen.'
  },
  {
    title: 'Checkout Flows',
    detail: 'Trials, Coupons und Upgrades mit Stripe steuern.'
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
          Billing & Umsatzkontrolle
        </h2>
        <p className="text-sm text-slate-300">
          Abrechnung wird in den Creator-Alltag eingebettet – klar, nachvollziehbar
          und mit Live-Kennzahlen.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {billingHighlights.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-white/10 bg-slate-900/70 p-6"
          >
            <p className="text-sm font-semibold text-white">{item.title}</p>
            <p className="mt-2 text-xs text-slate-300">{item.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
