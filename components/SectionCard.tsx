export default function SectionCard({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-obs-card p-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        {description ? (
          <p className="text-sm text-white/70">{description}</p>
        ) : null}
      </div>
      {children ? <div className="mt-4">{children}</div> : null}
    </section>
  );
}
