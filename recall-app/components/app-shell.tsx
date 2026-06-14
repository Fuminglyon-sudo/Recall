import { Sidebar } from "./sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar />
      {/* Offset for desktop sidebar width; offset for mobile top bar height */}
      <main className="pt-14 lg:pl-60 lg:pt-0">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
