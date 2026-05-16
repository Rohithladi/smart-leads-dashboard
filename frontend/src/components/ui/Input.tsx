import { forwardRef, type InputHTMLAttributes } from "react";
import { clsx } from "clsx";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, id, label, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <label className="block text-sm font-medium text-slate-700" htmlFor={inputId}>
        {label}
        <input
          className={clsx(
            "mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-100",
            error && "border-red-500 focus:border-red-500 focus:ring-red-100",
            className
          )}
          id={inputId}
          ref={ref}
          {...props}
        />
        {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}
      </label>
    );
  }
);

Input.displayName = "Input";
