import { X } from "lucide-react";
import type { ReactNode } from "react";

type LeadModalProps = {
  title: string;
  children: ReactNode;
  onClose: () => void;
};

export const LeadModal = ({ children, onClose, title }: LeadModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
          <button
            className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            type="button"
            aria-label="Close modal"
            onClick={onClose}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};
