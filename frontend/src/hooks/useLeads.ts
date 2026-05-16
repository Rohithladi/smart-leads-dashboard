import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { leadApi } from "../api/lead.api";
import type { CreateLeadPayload, LeadFilters, UpdateLeadPayload } from "../types/lead.types";
import { downloadBlob } from "../utils/download";
import { useDebounce } from "./useDebounce";

const initialFilters: LeadFilters = {
  sort: "latest",
  page: 1
};

export const useLeads = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<LeadFilters>(initialFilters);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 400);

  useEffect(() => {
    setFilters((current) => ({
      ...current,
      search: debouncedSearch.trim() || undefined,
      page: 1
    }));
  }, [debouncedSearch]);

  const leadsQueryKey = useMemo(() => ["leads", filters], [filters]);

  const leadsQuery = useQuery({
    queryKey: leadsQueryKey,
    queryFn: () => leadApi.list(filters)
  });

  const invalidateLeads = async (): Promise<void> => {
    await queryClient.invalidateQueries({ queryKey: ["leads"] });
  };

  const createLeadMutation = useMutation({
    mutationFn: (payload: CreateLeadPayload) => leadApi.create(payload),
    onSuccess: invalidateLeads
  });

  const updateLeadMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateLeadPayload }) => leadApi.update(id, payload),
    onSuccess: invalidateLeads
  });

  const deleteLeadMutation = useMutation({
    mutationFn: (id: string) => leadApi.remove(id),
    onSuccess: invalidateLeads
  });

  const exportMutation = useMutation({
    mutationFn: () =>
      leadApi.exportCsv({
        status: filters.status,
        source: filters.source,
        search: filters.search,
        sort: filters.sort
      }),
    onSuccess: (blob) => downloadBlob(blob, "leads.csv")
  });

  const updateFilters = (nextFilters: Partial<LeadFilters>): void => {
    setFilters((current) => ({
      ...current,
      ...nextFilters,
      page: nextFilters.page ?? 1
    }));
  };

  const resetFilters = (): void => {
    setSearchValue("");
    setFilters(initialFilters);
  };

  return {
    filters,
    searchValue,
    setSearchValue,
    updateFilters,
    resetFilters,
    leadsQuery,
    createLeadMutation,
    updateLeadMutation,
    deleteLeadMutation,
    exportMutation
  };
};
