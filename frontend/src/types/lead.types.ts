export const leadStatuses = ["new", "contacted", "qualified", "lost"] as const;
export const leadSources = ["website", "instagram", "referral"] as const;
export const leadSortOptions = ["latest", "oldest"] as const;

export type LeadStatus = (typeof leadStatuses)[number];
export type LeadSource = (typeof leadSources)[number];
export type LeadSort = (typeof leadSortOptions)[number];

export type Lead = {
  id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: string;
  updatedAt: string;
};

export type PaginationMeta = {
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type LeadFilters = {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort: LeadSort;
  page: number;
};

export type LeadListResponse = {
  leads: Lead[];
  pagination: PaginationMeta;
};

export type CreateLeadPayload = {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
};

export type UpdateLeadPayload = Partial<CreateLeadPayload>;
