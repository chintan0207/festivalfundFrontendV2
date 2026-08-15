import { contributionStatusBadge } from "@/lib/contributionFormat";
import { API_BASE_URL } from "@/api/env";
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

/** Absolute URL to a slip on the API origin (slips are publicly served). */
export const slipUrl = (slipPath?: string): string | null => {
  if (!slipPath) return null;
  let origin = "";
  try {
    origin = new URL(API_BASE_URL || "", window.location.origin).origin;
  } catch {
    origin = "";
  }
  return `${origin}${slipPath}`;
};

/**
 * Slips only exist for DEPOSITED contributions (the generator creates them on
 * deposit confirmation and rejects every other status), so gate both the view
 * and download actions on that status having a stored slip path.
 */
export const canDownloadSlip = (contribution: PublicContribution): boolean =>
  contribution.status === "DEPOSITED" && Boolean(contribution.slipPath);

/**
 * Fetches the publicly served slip PDF and triggers a file download. A plain
 * <a download> is ignored for cross-origin URLs, so we fetch the blob first.
 */
export const downloadSlip = async (contribution: PublicContribution): Promise<void> => {
  const url = slipUrl(contribution.slipPath);
  if (!url) return;
  const response = await fetch(url, { mode: "cors" });
  if (!response.ok) throw new Error("Failed to fetch slip");
  const blob = await response.blob();
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.setAttribute("download", `receipt-${contribution.contributionCode}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(objectUrl);
};