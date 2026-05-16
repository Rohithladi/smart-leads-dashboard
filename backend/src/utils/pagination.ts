import type { PaginationMeta } from "../types/api.types.js";

export const LEADS_PER_PAGE = 10;

export const getPaginationMeta = (
  total: number,
  page: number,
  limit: number
): PaginationMeta => {
  const totalPages = Math.ceil(total / limit);

  return {
    total,
    page,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1
  };
};
