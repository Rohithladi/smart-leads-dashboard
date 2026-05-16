import { useQuery } from "@tanstack/react-query";
import { Mail, Tag } from "lucide-react";
import { leadApi } from "../../api/lead.api";
import { getApiErrorMessage } from "../../api/http";
import type { Lead } from "../../types/lead.types";
import { formatDate, toTitleCase } from "../../utils/format";
import { ErrorState } from "../ui/ErrorState";
import { LoadingState } from "../ui/LoadingState";
import { StatusBadge } from "../ui/StatusBadge";

type LeadDetailsProps = {
  lead: Lead;
};

export const LeadDetails = ({ lead }: LeadDetailsProps) => {
  const leadQuery = useQuery({
    queryKey: ["lead", lead.id],
    queryFn: () => leadApi.getById(lead.id),
    initialData: lead
  });

  if (leadQuery.isLoading) {
    return <LoadingState label="Loading lead" />;
  }

  if (leadQuery.isError) {
    return <ErrorState message={getApiErrorMessage(leadQuery.error)} />;
  }

  const selectedLead = leadQuery.data;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-slate-500">Lead</p>
        <h3 className="mt-1 text-xl font-semibold text-slate-950">{selectedLead.name}</h3>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <Mail className="h-4 w-4" aria-hidden="true" />
            Email
          </div>
          <p className="mt-2 text-sm text-slate-950">{selectedLead.email}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <Tag className="h-4 w-4" aria-hidden="true" />
            Source
          </div>
          <p className="mt-2 text-sm text-slate-950">{toTitleCase(selectedLead.source)}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 p-4">
        <StatusBadge status={selectedLead.status} />
        <span className="text-sm text-slate-500">Created {formatDate(selectedLead.createdAt)}</span>
      </div>
    </div>
  );
};
