import { z } from "zod";
import { leadSortOptions, leadSources, leadStatuses } from "../types/lead.types.js";

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid lead id");

const leadNameSchema = z.string().trim().min(2).max(100);
const leadEmailSchema = z
  .string()
  .trim()
  .email("Enter a valid email address")
  .max(120)
  .toLowerCase();

export const createLeadSchema = z.object({
  body: z.object({
    name: leadNameSchema,
    email: leadEmailSchema,
    status: z.enum(leadStatuses).default("new"),
    source: z.enum(leadSources)
  })
});

export const updateLeadSchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),
  body: z
    .object({
      name: leadNameSchema.optional(),
      email: leadEmailSchema.optional(),
      status: z.enum(leadStatuses).optional(),
      source: z.enum(leadSources).optional()
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one lead field is required"
    })
});

export const leadIdSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
});

export const listLeadsSchema = z.object({
  query: z.object({
    status: z.enum(leadStatuses).optional(),
    source: z.enum(leadSources).optional(),
    search: z.string().trim().min(1).max(100).optional(),
    sort: z.enum(leadSortOptions).default("latest"),
    page: z.coerce.number().int().positive().default(1)
  })
});

export const exportLeadsSchema = z.object({
  query: listLeadsSchema.shape.query.omit({ page: true })
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>["body"];
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>["body"];
export type LeadIdParams = z.infer<typeof leadIdSchema>["params"];
export type ListLeadsQuery = z.infer<typeof listLeadsSchema>["query"];
export type ExportLeadsQuery = z.infer<typeof exportLeadsSchema>["query"];
