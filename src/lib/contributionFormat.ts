import type { Contribution } from "@/types/Types";

export const contributionStatusStyles: Record<string, string> = {
  DEPOSITED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  CANCELLED: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

export const contributionTypeStyles: Record<string, string> = {
  CASH: "text-emerald-600 dark:text-emerald-400",
  ITEM: "text-indigo-600 dark:text-indigo-400",
};

export function contributionStatusBadge(status?: string): string {
  return contributionStatusStyles[status || ""] || "bg-muted text-muted-foreground";
}

export function contributionAmountValue(c: Contribution): number {
  if (c.type === "CASH" && c.amount) return c.amount;
  if (c.type === "ITEM" && c.estimatedValue) return c.estimatedValue;
  return 0;
}

export function formatContributionAmount(c: Contribution): string {
  const value = contributionAmountValue(c);
  return value ? `₹${value.toLocaleString("en-IN")}` : "—";
}

export function contributionFestivalLabel(c: Contribution): string {
  const fest = typeof c.festivalId === "object" ? c.festivalId : null;
  return fest ? `${fest.name} ${fest.year || ""}`.trim() : "—";
}

export function contributionTotal(contributions: Contribution[]): number {
  return contributions.reduce((sum, c) => sum + contributionAmountValue(c), 0);
}

export function normalizeContributions(data: unknown): Contribution[] {
  if (Array.isArray(data)) return data as Contribution[];
  if (data && typeof data === "object" && "docs" in data) {
    return (data as { docs: Contribution[] }).docs || [];
  }
  if (data && typeof data === "object" && "contributions" in data) {
    return (data as { contributions: Contribution[] }).contributions || [];
  }
  if (data && typeof data === "object" && "data" in data) {
    return normalizeContributions((data as { data: unknown }).data);
  }
  return [];
}
