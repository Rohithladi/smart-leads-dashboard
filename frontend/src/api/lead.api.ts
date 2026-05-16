import { http } from "./http";
import type { ApiSuccess } from "../types/api.types";
import type {
  CreateLeadPayload,
  Lead,
  LeadFilters,
  LeadListResponse,
  UpdateLeadPayload
} from "../types/lead.types";

const cleanParams = (filters: LeadFilters): Record<string, string | number> => {
  const params: Record<string, string | number> = {
    sort: filters.sort,
    page: filters.page
  };

  if (filters.status) params.status = filters.status;
  if (filters.source) params.source = filters.source;
  if (filters.search?.trim()) params.search = filters.search.trim();

  return params;
};

export const leadApi = {
  async list(filters: LeadFilters): Promise<LeadListResponse> {
    const response = await http.get<ApiSuccess<LeadListResponse>>("/leads", {
      params: cleanParams(filters)
    });

    return response.data.data;
  },

  async getById(id: string): Promise<Lead> {
    const response = await http.get<ApiSuccess<{ lead: Lead }>>(`/leads/${id}`);
    return response.data.data.lead;
  },

  async create(payload: CreateLeadPayload): Promise<Lead> {
    const response = await http.post<ApiSuccess<{ lead: Lead }>>("/leads", payload);
    return response.data.data.lead;
  },

  async update(id: string, payload: UpdateLeadPayload): Promise<Lead> {
    const response = await http.patch<ApiSuccess<{ lead: Lead }>>(`/leads/${id}`, payload);
    return response.data.data.lead;
  },

  async remove(id: string): Promise<void> {
    await http.delete(`/leads/${id}`);
  },

  async exportCsv(filters: Omit<LeadFilters, "page">): Promise<Blob> {
    const response = await http.get<Blob>("/leads/export.csv", {
      params: cleanParams({ ...filters, page: 1 }),
      responseType: "blob"
    });

    return response.data;
  }
};
