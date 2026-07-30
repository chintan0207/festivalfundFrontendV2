import { Banknote, Package, Calendar, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatDate } from "@/lib/utils";
import type { Contribution } from "@/types/Types";

const statusStyles: Record<string, string> = {
  DEPOSITED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  CANCELLED: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

const typeStyles: Record<string, string> = {
  CASH: "text-emerald-600 dark:text-emerald-400",
  ITEM: "text-indigo-600 dark:text-indigo-400",
};

function ContributionCard({ c }: { c: Contribution }) {
  const fest = typeof c.festivalId === "object" ? c.festivalId : null;
  const amount =
    c.type === "CASH" && c.amount
      ? `₹${c.amount.toLocaleString("en-IN")}`
      : c.type === "ITEM" && c.estimatedValue
        ? `₹${c.estimatedValue.toLocaleString("en-IN")}`
        : "—";

  return (
    <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-xs space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="font-mono font-bold text-indigo-600 text-[11px]">{c.contributionCode}</span>
        <span
          className={cn(
            "inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold",
            statusStyles[c.status] || "bg-muted text-muted-foreground",
          )}
        >
          {c.status}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span className="font-medium text-foreground">
          {fest ? `${fest.name} ${fest.year || ""}` : "—"}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className={cn("inline-flex items-center gap-1 font-semibold", typeStyles[c.type])}>
          {c.type === "CASH" ? <Banknote className="h-3.5 w-3.5" /> : <Package className="h-3.5 w-3.5" />}
          {c.type}
        </span>
        <span className="font-bold text-foreground">{amount}</span>
      </div>

      {c.date && (
        <div className="text-[11px] text-muted-foreground">{formatDate(c.date)}</div>
      )}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="p-3.5 rounded-2xl bg-card border border-border/80 space-y-2.5">
      <div className="flex justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-36" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

export function ContributorContributionCards({
  contributions,
  isLoading,
}: {
  contributions: Contribution[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (contributions.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <Search className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
        <p className="text-sm font-medium text-foreground">No contributions yet</p>
        <p className="text-xs text-muted-foreground mt-1">Contributions made by this donor will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {contributions.map((c) => (
        <ContributionCard key={c._id} c={c} />
      ))}
    </div>
  );
}
