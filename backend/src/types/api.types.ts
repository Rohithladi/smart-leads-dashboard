export type FieldError = {
  field: string;
  message: string;
};

export type PaginationMeta = {
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};
