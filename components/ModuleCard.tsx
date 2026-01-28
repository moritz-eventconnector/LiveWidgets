type ModuleCardProps = {
  title: string;
  detail: string;
};

export default function ModuleCard({ title, detail }: ModuleCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-2 text-xs text-slate-300">{detail}</p>
    </div>
  );
}
