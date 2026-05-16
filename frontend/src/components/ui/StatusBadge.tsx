import { clsx } from "clsx";
import type { LeadStatus } from "../../types/lead.types";
import { toTitleCase } from "../../utils/format";

const statusClasses: Record<LeadStatus, string> = {
  new: "bg-sky-50 text-sky-700 ring-sky-200",
  contacted: "bg-amber-50 text-amber-700 ring-amber-200",
  qualified: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  lost: "bg-rose-50 text-rose-700 ring-rose-200"
};

export const StatusBadge = ({ status }: { status: LeadStatus }) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1",
        statusClasses[status]
      )}
    >
      {toTitleCase(status)}
    </span>
  );
};
