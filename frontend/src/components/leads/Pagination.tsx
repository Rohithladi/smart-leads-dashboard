import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/Button";
import type { PaginationMeta } from "../../types/lead.types";

type PaginationProps = {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
};

export const Pagination = ({ onPageChange, pagination }: PaginationProps) => {
  const firstItem = pagination.total === 0 ? 0 : (pagination.page - 1) * 10 + 1;
  const lastItem = Math.min(pagination.page * 10, pagination.total);

  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-600">
        Showing {firstItem}-{lastItem} of {pagination.total}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          disabled={!pagination.hasPrev}
          icon={<ChevronLeft className="h-4 w-4" aria-hidden="true" />}
          onClick={() => onPageChange(pagination.page - 1)}
        >
          Previous
        </Button>
        <span className="min-w-20 text-center text-sm font-medium text-slate-700">
          Page {pagination.page} / {Math.max(pagination.totalPages, 1)}
        </span>
        <Button
          variant="secondary"
          disabled={!pagination.hasNext}
          icon={<ChevronRight className="h-4 w-4" aria-hidden="true" />}
          onClick={() => onPageChange(pagination.page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
