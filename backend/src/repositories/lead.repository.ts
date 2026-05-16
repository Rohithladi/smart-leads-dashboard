import type { FilterQuery, UpdateQuery } from "mongoose";
import { LeadModel, type Lead, type LeadDocument } from "../models/lead.model.js";
import type { PaginationMeta } from "../types/api.types.js";
import type { LeadListFilters } from "../types/lead.types.js";
import { escapeRegex } from "../utils/escape-regex.js";
import { getPaginationMeta, LEADS_PER_PAGE } from "../utils/pagination.js";

type CreateLeadData = Pick<Lead, "name" | "email" | "status" | "source">;
type UpdateLeadData = Partial<CreateLeadData>;

type PaginatedLeads = {
  leads: LeadDocument[];
  pagination: PaginationMeta;
};

const buildLeadFilter = (
  filters: Omit<LeadListFilters, "page" | "sort">
): FilterQuery<Lead> => {
  const query: FilterQuery<Lead> = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.source) {
    query.source = filters.source;
  }

  if (filters.search) {
    const regex = new RegExp(escapeRegex(filters.search), "i");
    query.$or = [{ name: regex }, { email: regex }];
  }

  return query;
};

export const leadRepository = {
  async create(data: CreateLeadData): Promise<LeadDocument> {
    return LeadModel.create(data);
  },

  async findById(id: string): Promise<LeadDocument | null> {
    return LeadModel.findById(id);
  },

  async updateById(id: string, data: UpdateLeadData): Promise<LeadDocument | null> {
    const update: UpdateQuery<Lead> = { $set: data };

    return LeadModel.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true
    });
  },

  async deleteById(id: string): Promise<LeadDocument | null> {
    return LeadModel.findByIdAndDelete(id);
  },

  async list(filters: LeadListFilters): Promise<PaginatedLeads> {
    const query = buildLeadFilter(filters);
    const sortDirection = filters.sort === "latest" ? -1 : 1;
    const skip = (filters.page - 1) * LEADS_PER_PAGE;

    const [leads, total] = await Promise.all([
      LeadModel.find(query)
        .sort({ createdAt: sortDirection })
        .skip(skip)
        .limit(LEADS_PER_PAGE),
      LeadModel.countDocuments(query)
    ]);

    return {
      leads,
      pagination: getPaginationMeta(total, filters.page, LEADS_PER_PAGE)
    };
  },

  async listForExport(filters: Omit<LeadListFilters, "page">): Promise<LeadDocument[]> {
    const query = buildLeadFilter(filters);
    const sortDirection = filters.sort === "latest" ? -1 : 1;

    return LeadModel.find(query).sort({ createdAt: sortDirection });
  }
};
