import { leadRepository } from "../repositories/lead.repository.js";
import type { AuthUser } from "../types/auth.types.js";
import type { LeadListFilters } from "../types/lead.types.js";
import { ApiError } from "../utils/api-error.js";
import { serializeLead, type LeadResponse } from "../utils/serialize-lead.js";
import type { CreateLeadInput, UpdateLeadInput } from "../validators/lead.validator.js";

type LeadListResult = {
  leads: LeadResponse[];
  pagination: Awaited<ReturnType<typeof leadRepository.list>>["pagination"];
};

const assertCanUpdateLead = (user: AuthUser, input: UpdateLeadInput): void => {
  if (user.role === "admin") {
    return;
  }

  const requestedFields = Object.keys(input);
  const updatesOnlyStatus = requestedFields.length === 1 && requestedFields[0] === "status";

  if (!updatesOnlyStatus) {
    throw ApiError.forbidden("Sales users can update lead status only");
  }
};

export const leadService = {
  async create(input: CreateLeadInput): Promise<LeadResponse> {
    const lead = await leadRepository.create(input);

    return serializeLead(lead);
  },

  async list(filters: LeadListFilters): Promise<LeadListResult> {
    const result = await leadRepository.list(filters);

    return {
      leads: result.leads.map(serializeLead),
      pagination: result.pagination
    };
  },

  async getById(id: string): Promise<LeadResponse> {
    const lead = await leadRepository.findById(id);

    if (!lead) {
      throw ApiError.notFound("Lead");
    }

    return serializeLead(lead);
  },

  async update(id: string, input: UpdateLeadInput, user: AuthUser): Promise<LeadResponse> {
    assertCanUpdateLead(user, input);

    const lead = await leadRepository.updateById(id, input);

    if (!lead) {
      throw ApiError.notFound("Lead");
    }

    return serializeLead(lead);
  },

  async delete(id: string): Promise<void> {
    const lead = await leadRepository.deleteById(id);

    if (!lead) {
      throw ApiError.notFound("Lead");
    }
  },

  async listForExport(filters: Omit<LeadListFilters, "page">): Promise<LeadResponse[]> {
    const leads = await leadRepository.listForExport(filters);

    return leads.map(serializeLead);
  }
};
