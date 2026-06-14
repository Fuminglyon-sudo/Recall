export function CalmCard({ title, body, children }: { title: string; body: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-slate-300">{body}</p>
      {children ? <div className="mt-5">{children}</div> : null}
    </div>
  );
}
