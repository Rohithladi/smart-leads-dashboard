import { BarChart3, LogOut, UsersRound } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { toTitleCase } from "../utils/format";

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const { clearSession, user } = useAuth();

  const handleLogout = (): void => {
    clearSession();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white/95 px-4 py-5 lg:block">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
            <UsersRound className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold">Smart Leads</p>
            <p className="text-xs text-slate-500">Mini CRM</p>
          </div>
        </div>

        <nav className="mt-8 space-y-1">
          <div className="flex items-center gap-3 rounded-lg bg-slate-950 px-3 py-2 text-sm font-medium text-white">
            <BarChart3 className="h-4 w-4" aria-hidden="true" />
            Leads
          </div>
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-950">Dashboard</p>
              <p className="truncate text-xs text-slate-500">
                {user ? `${user.name} · ${toTitleCase(user.role)}` : "Lead workspace"}
              </p>
            </div>
            <Button variant="ghost" icon={<LogOut className="h-4 w-4" aria-hidden="true" />} onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </header>

        <Outlet />
      </div>
    </div>
  );
};
