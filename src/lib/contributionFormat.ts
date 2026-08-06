import type { Contribution } from "@/types/Types";

export const contributionStatusStyles: Record<string, string> = {
  DEPOSITED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  CANCELLED: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

export const contributionTypeStyles: Record<string, string> = {
  MONEY: "text-emerald-600 dark:text-emerald-400",
  ITEM: "text-indigo-600 dark:text-indigo-400",
};

export function contributionStatusBadge(status?: string): string {
  return contributionStatusStyles[status || ""] || "bg-muted text-muted-foreground";
}

type AmountShape = { type?: string; amount?: number; estimatedValue?: number };

export function contributionAmountValue(c: AmountShape): number {
  if (c.type === "MONEY" && c.amount) return c.amount;
  if (c.type === "ITEM" && c.estimatedValue) return c.estimatedValue;
  return 0;
}

export function formatContributionAmount(c: AmountShape): string {
  const value = contributionAmountValue(c);
  return value ? `₹${value.toLocaleString("en-IN")}` : "—";
}

export function contributionFestivalLabel(c: {
  festivalId?: unknown;
  festival?: { name?: string; year?: number } | null;
}): string {
  const nestedFest =
    c.festival && typeof c.festival === "object" ? c.festival : null;
  const legacyFest =
    typeof c.festivalId === "object" && c.festivalId
      ? (c.festivalId as { name?: string; year?: number })
      : null;
  const fest = nestedFest || legacyFest;
  return fest ? `${fest.name || ""} ${fest.year || ""}`.trim() : "—";
}

export function contributionTotal(contributions: AmountShape[]): number {
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
