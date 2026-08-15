import { contributionStatusBadge } from "@/lib/contributionFormat";
import type { PublicContribution, PublicFestivalGroup } from "@/api/public/publicLookup.service";

export const formatMoney = (value?: number | null): string =>
  value ? `₹${value.toLocaleString("en-IN")}` : "₹0";

export const formatDate = (value?: string | null): string => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const paymentLabels: Record<string, string> = {
  CASH: "Cash",
  UPI: "UPI",
  BANK_TRANSFER: "Bank Transfer",
  CHEQUE: "Cheque",
  OTHER: "Other",
};

export const paymentLabel = (mode?: string): string =>
  mode ? paymentLabels[mode] || mode : "—";

export const statusBadgeClass = (status?: string): string =>
  status ? contributionStatusBadge(status) : "bg-muted text-muted-foreground";

export const isCancelled = (contribution: PublicContribution): boolean =>
  contribution.status === "CANCELLED";

/** Contributions to display (CANCELLED rows are hidden) + how many were hidden. */
export function visibleContributions(group: PublicFestivalGroup): {
  list: PublicContribution[];
  hidden: number;
} {
  const list = group.contributions.filter((c) => !isCancelled(c));
  return { list, hidden: Math.max(0, group.contributionCount - list.length) };
}

/**
 * Slips only exist/are generated for DEPOSITED contributions (the generator
 * rejects every other status), so gate both view and download actions on it.
 */
export const isSlipEligible = (contribution: PublicContribution): boolean =>
  contribution.status === "DEPOSITED";