import { forwardRef, type SelectHTMLAttributes } from "react";
import { clsx } from "clsx";

type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: SelectOption[];
  error?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, id, label, options, ...props }, ref) => {
    const selectId = id ?? props.name;

    return (
      <label className="block text-sm font-medium text-slate-700" htmlFor={selectId}>
        {label}
        <select
          className={clsx(
            "mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100",
            error && "border-red-500 focus:border-red-500 focus:ring-red-100",
            className
          )}
          id={selectId}
          ref={ref}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}
      </label>
    );
  }
);

Select.displayName = "Select";
