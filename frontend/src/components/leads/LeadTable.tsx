import { Edit, Eye, Trash2 } from "lucide-react";
import type { Lead } from "../../types/lead.types";
import type { UserRole } from "../../types/auth.types";
import { formatDate, toTitleCase } from "../../utils/format";
import { Button } from "../ui/Button";
import { StatusBadge } from "../ui/StatusBadge";

type LeadTableProps = {
  leads: Lead[];
  role: UserRole;
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
};

export const LeadTable = ({ leads, onDelete, onEdit, onView, role }: LeadTableProps) => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50/80">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Lead</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Source</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Created</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {leads.map((lead) => (
              <tr key={lead.id} className="transition hover:bg-slate-50/80">
                <td className="px-4 py-4">
                  <p className="font-medium text-slate-950">{lead.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{lead.email}</p>
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="px-4 py-4">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                    {toTitleCase(lead.source)}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">{formatDate(lead.createdAt)}</td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" icon={<Eye className="h-4 w-4" aria-hidden="true" />} onClick={() => onView(lead)}>
                      View
                    </Button>
                    <Button variant="secondary" icon={<Edit className="h-4 w-4" aria-hidden="true" />} onClick={() => onEdit(lead)}>
                      Edit
                    </Button>
                    {role === "admin" ? (
                      <Button variant="danger" icon={<Trash2 className="h-4 w-4" aria-hidden="true" />} onClick={() => onDelete(lead)}>
                        Delete
                      </Button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
