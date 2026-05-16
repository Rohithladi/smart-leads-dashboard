import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#eef6ff_0,#f8fafc_36%,#f8fafc_100%)]">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-sm font-semibold text-white">
              SL
            </div>
            <span className="text-sm font-semibold text-slate-950">Smart Leads</span>
          </div>
          <span className="hidden text-sm text-slate-500 sm:inline">Sales CRM workspace</span>
        </div>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1fr_440px]">
          <div className="hidden lg:block">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-brand-700">Lead operations</p>
            <h1 className="mt-4 max-w-2xl text-5xl font-semibold tracking-tight text-slate-950">
              Manage sales leads with clarity and control.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
              A focused dashboard for filtering prospects, tracking pipeline status, and keeping admin actions secure.
            </p>
          </div>
          <Outlet />
        </div>
      </section>
    </main>
  );
};
