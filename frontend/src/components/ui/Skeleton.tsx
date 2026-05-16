import { clsx } from "clsx";

export const Skeleton = ({ className }: { className?: string }) => {
  return <div className={clsx("animate-pulse rounded-md bg-slate-200/80", className)} />;
};

export const TableSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="space-y-3 p-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="grid grid-cols-[1.4fr_0.7fr_0.7fr_0.7fr_0.8fr] gap-4">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
        ))}
      </div>
    </div>
  );
};
