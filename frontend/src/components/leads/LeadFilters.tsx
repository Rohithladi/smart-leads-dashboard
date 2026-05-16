import { Search } from "lucide-react";
import type { LeadFilters as LeadFiltersType, LeadSort } from "../../types/lead.types";
import { sortOptions, sourceOptions, statusOptions } from "../../utils/constants";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";

type LeadFiltersProps = {
  filters: LeadFiltersType;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (filters: Partial<LeadFiltersType>) => void;
  onReset: () => void;
};

export const LeadFilters = ({
  filters,
  onFilterChange,
  onReset,
  onSearchChange,
  searchValue
}: LeadFiltersProps) => {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="grid gap-3 lg:grid-cols-[1.5fr_0.9fr_0.9fr_0.8fr_auto]">
      <label className="block text-sm font-medium text-slate-700">
        Search
        <span className="relative mt-1 block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            className="h-10 w-full rounded-md border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
            placeholder="Search name or email"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </span>
      </label>

      <Select
        label="Status"
        value={filters.status ?? ""}
        options={[
          { label: "All statuses", value: "" },
          ...statusOptions
        ]}
        onChange={(event) =>
          onFilterChange({ status: event.target.value ? filtersValue(event.target.value) : undefined })
        }
      />

      <Select
        label="Source"
        value={filters.source ?? ""}
        options={[
          { label: "All sources", value: "" },
          ...sourceOptions
        ]}
        onChange={(event) =>
          onFilterChange({ source: event.target.value ? sourceValue(event.target.value) : undefined })
        }
      />

      <Select
        label="Sort"
        value={filters.sort}
        options={sortOptions}
        onChange={(event) => onFilterChange({ sort: event.target.value as LeadSort })}
      />

      <div className="flex items-end">
        <Button className="w-full" variant="secondary" onClick={onReset}>
          Reset
        </Button>
      </div>
      </div>
    </div>
  );
};

const filtersValue = (value: string) => {
  return value as LeadFiltersType["status"];
};

const sourceValue = (value: string) => {
  return value as LeadFiltersType["source"];
};
