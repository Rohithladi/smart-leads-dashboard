export const leadStatuses = ["new", "contacted", "qualified", "lost"] as const;
export const leadSources = ["website", "instagram", "referral"] as const;
export const leadSortOptions = ["latest", "oldest"] as const;

export type LeadStatus = (typeof leadStatuses)[number];
export type LeadSource = (typeof leadSources)[number];
export type LeadSort = (typeof leadSortOptions)[number];

export type LeadListFilters = {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort: LeadSort;
  page: number;
};
