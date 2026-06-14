export function CalmCard({ title, body, children }: { title: string; body: string; children?: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur">
      <div className="h-px bg-gradient-to-r from-emerald-400/40 via-emerald-400/10 to-transparent" />
      <div className="p-6">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="mt-2 text-sm leading-7 text-slate-400">{body}</p>
        {children ? <div className="mt-5">{children}</div> : null}
      </div>
    </div>
  );
}
