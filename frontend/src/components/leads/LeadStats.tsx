import { Award, CircleDot, PhoneCall, XCircle } from "lucide-react";
import type { Lead } from "../../types/lead.types";

type LeadStatsProps = {
  leads: Lead[];
  total: number;
};

export const LeadStats = ({ leads, total }: LeadStatsProps) => {
  const contacted = leads.filter((lead) => lead.status === "contacted").length;
  const qualified = leads.filter((lead) => lead.status === "qualified").length;
  const lost = leads.filter((lead) => lead.status === "lost").length;

  const stats = [
    { label: "Total leads", value: total, icon: CircleDot },
    { label: "Contacted", value: contacted, icon: PhoneCall },
    { label: "Qualified", value: qualified, icon: Award },
    { label: "Lost", value: lost, icon: XCircle }
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-xl border border-slate-200/80 bg-white px-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <stat.icon className="h-4 w-4 text-slate-400" aria-hidden="true" />
          </div>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};
