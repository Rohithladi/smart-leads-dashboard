import type { LeadSort } from "../types/lead.types";
import { leadSources, leadStatuses } from "../types/lead.types";
import { toTitleCase } from "./format";

export const statusOptions = leadStatuses.map((status) => ({
  label: toTitleCase(status),
  value: status
}));

export const sourceOptions = leadSources.map((source) => ({
  label: toTitleCase(source),
  value: source
}));

export const sortOptions: Array<{ label: string; value: LeadSort }> = [
  { label: "Latest first", value: "latest" },
  { label: "Oldest first", value: "oldest" }
];
