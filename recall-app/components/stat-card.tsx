import Link from "next/link";

export function StatCard({ label, value, helper, href }: { label: string; value: string; helper: string; href?: string }) {
  const content = (
    <>
      <div className="absolute inset-y-0 left-0 w-0.5 rounded-full bg-emerald-400/50" />
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-3 text-5xl font-semibold tracking-tight text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{helper}</p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="relative block overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:border-white/20 hover:bg-white/8">
        {content}
      </Link>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      {content}
    </div>
  );
}
