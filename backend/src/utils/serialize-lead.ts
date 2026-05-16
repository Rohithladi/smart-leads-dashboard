import type { LeadDocument } from "../models/lead.model.js";
import type { LeadSource, LeadStatus } from "../types/lead.types.js";

export type LeadResponse = {
  id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: Date;
  updatedAt: Date;
};

export const serializeLead = (lead: LeadDocument): LeadResponse => {
  return {
    id: lead._id.toString(),
    name: lead.name,
    email: lead.email,
    status: lead.status,
    source: lead.source,
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt
  };
};
