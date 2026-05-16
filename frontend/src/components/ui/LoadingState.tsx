import { Loader2 } from "lucide-react";

export const LoadingState = ({ label = "Loading" }: { label?: string }) => {
  return (
    <div className="flex min-h-56 items-center justify-center rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
        <Loader2 className="h-5 w-5 animate-spin text-brand-600" aria-hidden="true" />
        {label}
      </div>
    </div>
  );
};
