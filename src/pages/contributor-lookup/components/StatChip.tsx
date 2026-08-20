import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StatChip({
  label,
  value,
  accent,
  className,
}: {
  label: string;
  value: ReactNode;
  accent?: string;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0 rounded-xl border border-border/50 bg-muted/30 px-3 py-2", className)}>
      <p className="truncate text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={cn("truncate text-sm font-bold text-foreground sm:text-base", accent)}>{value}</p>
    </div>
  );
}