import { useState } from "react";
import { Download, Plus } from "lucide-react";
import { getApiErrorMessage } from "../../api/http";
import { LeadDetails } from "../../components/leads/LeadDetails";
import { LeadFilters } from "../../components/leads/LeadFilters";
import { LeadForm } from "../../components/leads/LeadForm";
import { LeadModal } from "../../components/leads/LeadModal";
import { LeadStats } from "../../components/leads/LeadStats";
import { LeadTable } from "../../components/leads/LeadTable";
import { Pagination } from "../../components/leads/Pagination";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { TableSkeleton } from "../../components/ui/Skeleton";
import { useAuth } from "../../hooks/useAuth";
import { useLeads } from "../../hooks/useLeads";
import type { CreateLeadPayload, Lead } from "../../types/lead.types";

export const LeadsPage = () => {
  const { isAdmin, user } = useAuth();
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isCreatingLead, setIsCreatingLead] = useState(false);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);

  const {
    createLeadMutation,
    deleteLeadMutation,
    exportMutation,
    filters,
    leadsQuery,
    resetFilters,
    searchValue,
    setSearchValue,
    updateFilters,
    updateLeadMutation
  } = useLeads();

  const role = user?.role ?? "sales";
  const leads = leadsQuery.data?.leads ?? [];
  const totalLeads = leadsQuery.data?.pagination.total ?? 0;
  const mutationError =
    createLeadMutation.error ?? updateLeadMutation.error ?? deleteLeadMutation.error ?? exportMutation.error;

  const closeCreateModal = (): void => setIsCreatingLead(false);
  const closeEditModal = (): void => setEditingLead(null);

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white px-5 py-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand-700">Pipeline</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Leads dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Review lead quality, filter by source, and keep every opportunity moving through the sales workflow.
            </p>
          </div>
          {isAdmin ? (
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                icon={<Download className="h-4 w-4" aria-hidden="true" />}
                isLoading={exportMutation.isPending}
                onClick={() => exportMutation.mutate()}
              >
                Export CSV
              </Button>
              <Button icon={<Plus className="h-4 w-4" aria-hidden="true" />} onClick={() => setIsCreatingLead(true)}>
                New lead
              </Button>
            </div>
          ) : null}
        </section>

        <LeadStats leads={leads} total={totalLeads} />

        <LeadFilters
          filters={filters}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onFilterChange={updateFilters}
          onReset={resetFilters}
        />

        {mutationError ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {getApiErrorMessage(mutationError)}
          </p>
        ) : null}

        {leadsQuery.isLoading ? <TableSkeleton /> : null}

        {leadsQuery.isError ? (
          <ErrorState message={getApiErrorMessage(leadsQuery.error)} onRetry={() => void leadsQuery.refetch()} />
        ) : null}

        {leadsQuery.isSuccess && leads.length === 0 ? (
          <EmptyState
            title="No matching leads"
            message="Try a different search or clear filters to return to the full pipeline."
            action={
              isAdmin ? (
                <Button icon={<Plus className="h-4 w-4" aria-hidden="true" />} onClick={() => setIsCreatingLead(true)}>
                  New lead
                </Button>
              ) : undefined
            }
          />
        ) : null}

        {leadsQuery.isSuccess && leads.length > 0 ? (
          <>
            <LeadTable
              leads={leads}
              role={role}
              onView={setViewingLead}
              onEdit={setEditingLead}
              onDelete={setDeletingLead}
            />
            <Pagination pagination={leadsQuery.data.pagination} onPageChange={(page) => updateFilters({ page })} />
          </>
        ) : null}
      </div>

      {viewingLead ? (
        <LeadModal title="Lead details" onClose={() => setViewingLead(null)}>
          <LeadDetails lead={viewingLead} />
        </LeadModal>
      ) : null}

      {isCreatingLead ? (
        <LeadModal title="Create lead" onClose={closeCreateModal}>
          <LeadForm
            role={role}
            isSubmitting={createLeadMutation.isPending}
            onCancel={closeCreateModal}
            onSubmit={(payload) => {
              createLeadMutation.mutate(payload as CreateLeadPayload, {
                onSuccess: closeCreateModal
              });
            }}
          />
        </LeadModal>
      ) : null}

      {editingLead ? (
        <LeadModal title={role === "sales" ? "Update status" : "Edit lead"} onClose={closeEditModal}>
          <LeadForm
            lead={editingLead}
            role={role}
            isSubmitting={updateLeadMutation.isPending}
            onCancel={closeEditModal}
            onSubmit={(payload) => {
              updateLeadMutation.mutate(
                { id: editingLead.id, payload },
                {
                  onSuccess: closeEditModal
                }
              );
            }}
          />
        </LeadModal>
      ) : null}

      {deletingLead ? (
        <LeadModal title="Delete lead" onClose={() => setDeletingLead(null)}>
          <p className="text-sm leading-6 text-slate-700">
            Delete <span className="font-medium text-slate-950">{deletingLead.name}</span>? This action cannot be undone.
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setDeletingLead(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              isLoading={deleteLeadMutation.isPending}
              onClick={() => {
                deleteLeadMutation.mutate(deletingLead.id, {
                  onSuccess: () => setDeletingLead(null)
                });
              }}
            >
              Delete
            </Button>
          </div>
        </LeadModal>
      ) : null}
    </main>
  );
};
