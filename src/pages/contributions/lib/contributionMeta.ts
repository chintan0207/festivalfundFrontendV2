import { badgeColors } from "@/theme/colors";

export const contributionStatusLabels: Record<string, string> = {
  DEPOSITED: "Deposited",
  PENDING: "Pending",
  CANCELLED: "Cancelled",
};

export const contributionTypeLabels: Record<string, string> = {
  MONEY: "Cash",
  ITEM: "Item",
};

export const contributionPaymentLabels: Record<string, string> = {
  CASH: "Cash",
  UPI: "UPI",
  BANK_TRANSFER: "Bank Transfer",
  ONLINE: "Online",
  OTHER: "Other",
};

export const contributionStatusBadgeStyles: Record<string, string> = {
  DEPOSITED: badgeColors.deposited,
  PENDING: badgeColors.pending,
  CANCELLED: "bg-gradient-to-r from-rose-500/20 to-red-500/20 text-rose-500",
};

export const contributionTypeBadgeStyles: Record<string, string> = {
  MONEY: badgeColors.deposited,
  ITEM: "bg-gradient-to-r from-indigo-500/20 to-violet-500/20 text-indigo-500",
};

export const contributionStatusOptions: { value: string; label: string }[] = [
  { value: "DEPOSITED", label: "Deposited" },
  { value: "PENDING", label: "Pending" },
  { value: "CANCELLED", label: "Cancelled" },
];

/** Statuses allowed when creating a new contribution (records never start cancelled). */
export const contributionStatusCreateOptions: { value: string; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "DEPOSITED", label: "Deposited" },
];

export const contributionTypeOptions: { value: string; label: string }[] = [
  { value: "MONEY", label: "Money" },
  { value: "ITEM", label: "Item" },
];

export const contributionPaymentOptions: { value: string; label: string }[] = [
  { value: "CASH", label: "Cash" },
  { value: "UPI", label: "UPI" },
  // { value: "BANK_TRANSFER", label: "Bank Transfer" },
  // { value: "ONLINE", label: "Online" },
  // { value: "OTHER", label: "Other" },
];

/**
 * Allowed status transitions for a given current status.
 * Mirrors the backend transition matrix (see backend/src/utils/utility.js).
 */
export const contributionStatusTransitions: Record<string, string[]> = {
  PENDING: ["DEPOSITED", "CANCELLED"],
  DEPOSITED: ["PENDING"],
  CANCELLED: [],
};

export function contributionStatusLabel(status?: string): string {
  return (status && contributionStatusLabels[status]) || status || "—";
}

export function contributionTypeLabel(type?: string): string {
  return (type && contributionTypeLabels[type]) || type || "—";
}

export function contributionPaymentLabel(mode?: string): string {
  return (mode && contributionPaymentLabels[mode]) || mode || "—";
}

export function contributionStatusBadge(status?: string): string {
  return (status && contributionStatusBadgeStyles[status]) || "bg-muted text-muted-foreground";
}

export function contributionTypeBadge(type?: string): string {
  return (type && contributionTypeBadgeStyles[type]) || "bg-muted text-muted-foreground";
}
