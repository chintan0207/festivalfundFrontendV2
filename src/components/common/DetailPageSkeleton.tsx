import { Skeleton } from "@/components/ui/skeleton";

export interface DetailPageSkeletonProps {
  /** `stats` renders a two-column stats grid; `stack` renders a full-width block. */
  variant?: "stats" | "stack";
}

/** Loading state for module detail pages (matches the module page container). */
export function DetailPageSkeleton({ variant = "stats" }: DetailPageSkeletonProps) {
  return (
    <>
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-48 w-full rounded-2xl" />
      {variant === "stats" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
      ) : (
        <Skeleton className="h-64 w-full rounded-2xl" />
      )}
    </>
  );
}