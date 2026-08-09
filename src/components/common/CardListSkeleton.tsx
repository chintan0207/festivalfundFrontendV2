import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface CardListSkeletonProps {
  count?: number;
  className?: string;
}

/** Loading state for responsive mobile card lists (hidden on desktop). */
export function CardListSkeleton({
  count = 3,
  className,
}: CardListSkeletonProps) {
  return (
    <div className={cn("space-y-3 md:hidden", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-3.5 rounded-2xl bg-card border border-border/80 space-y-2.5"
        >
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-8 rounded-lg" />
        </div>
      ))}
    </div>
  );
}