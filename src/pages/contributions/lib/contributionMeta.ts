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

export const contributionCategoryBadgeStyles: Record<string, string> = {
  PARENT: badgeColors.parents,
  BOY: badgeColors.boys,
  GIRL: badgeColors.girls,
};

export const contributionCategoryLabels: Record<string, string> = {
  PARENT: "Parents",
  BOY: "Boys",
  GIRL: "Girls",
};

export const contributionStatusOptions: { value: string; label: string }[] = [
  { value: "DEPOSITED", label: "Deposited" },
  { value: "PENDING", label: "Pending" },
  { value: "CANCELLED", label: "Cancelled" },
];

export const contributionTypeOptions: { value: string; label: string }[] = [
  { value: "MONEY", label: "Cash" },
  { value: "ITEM", label: "Item" },
];

export const contributionPaymentOptions: { value: string; label: string }[] = [
  { value: "CASH", label: "Cash" },
  { value: "UPI", label: "UPI" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "ONLINE", label: "Online" },
  { value: "OTHER", label: "Other" },
];

export const contributionCategoryOptions: { value: string; label: string }[] = [
  { value: "PARENT", label: "Parents" },
  { value: "BOY", label: "Boys" },
  { value: "GIRL", label: "Girls" },
];

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

export function contributionCategoryLabel(category?: string): string {
  return (category && contributionCategoryLabels[category]) || category || "—";
}

export function contributionCategoryBadge(category?: string): string {
  return (category && contributionCategoryBadgeStyles[category]) || "bg-muted text-muted-foreground";
}
