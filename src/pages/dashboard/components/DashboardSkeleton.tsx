import { Skeleton } from "@/components/ui/skeleton";
import { KPIGrid } from "@/components/common/KPICard";

export function DashboardSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>

      {/* KPI cards */}
      <KPIGrid columns={5}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-card border border-border/70 space-y-3 h-full"
          >
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-9 w-9 rounded-xl" />
            </div>
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </KPIGrid>

      {/* Row 2: festival summary / payment channels / contributor categories */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 sm:gap-4">
        <Skeleton className="h-80 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>

      {/* Overview chart */}
      <Skeleton className="h-[430px] rounded-2xl" />

      {/* Lower grid: 40% cards left / 60% activity right (45/55 on tablet) */}
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,45fr)_minmax(0,55fr)] lg:grid-cols-[minmax(0,40fr)_minmax(0,60fr)] gap-3 sm:gap-4">
        <div className="order-2 md:order-1 grid gap-3 sm:gap-4">
          <Skeleton className="h-56 rounded-2xl" />
          <Skeleton className="h-56 rounded-2xl" />
          <Skeleton className="h-56 rounded-2xl" />
        </div>
        <Skeleton className="order-1 md:order-2 h-[720px] rounded-2xl" />
      </div>
    </div>
  );
}