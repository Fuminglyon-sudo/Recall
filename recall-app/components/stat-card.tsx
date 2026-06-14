export function StatCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-3 text-4xl font-semibold tracking-tight text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-300">{helper}</p>
    </div>
  );
}
