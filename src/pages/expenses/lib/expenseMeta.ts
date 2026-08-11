import { Utensils, Sparkles, Speaker, MicVocal, Package, type LucideIcon } from "lucide-react";
import {
  badgeColors,
  getModuleTheme,
  moduleBadgeColors,
  moduleGradientColors,
} from "@/theme/colors";

/**
 * Generic 5-category expense taxonomy.
 * Kept in sync with backend `ExpenseCategoryEnum` (backend/src/utils/constants.js).
 */
export interface ExpenseCategoryMeta {
  key: string;
  label: string;
  description: string;
  Icon: LucideIcon;
  /** Distinct module-gradient used for selected chips & breakdown icon tiles. */
  gradient: string;
}

export const expenseCategoryMeta: ExpenseCategoryMeta[] = [
  {
    key: "FOOD",
    label: "Food & Prasad",
    description: "Meals, prasad, catering",
    Icon: Utensils,
    gradient: moduleGradientColors.contributors,
  },
  {
    key: "DECORATION",
    label: "Decoration",
    description: "Stage, lighting, décor",
    Icon: Sparkles,
    gradient: moduleGradientColors.contributions,
  },
  {
    key: "SERVICES",
    label: "Sound & Services",
    description: "Sound, mandap, hired services",
    Icon: Speaker,
    gradient: moduleGradientColors.users,
  },
  {
    key: "CULTURAL",
    label: "Cultural Program",
    description: "Events, artists, programmes",
    Icon: MicVocal,
    gradient: moduleGradientColors.reports,
  },
  {
    key: "OTHER",
    label: "Other / Admin",
    description: "Miscellaneous & admin",
    Icon: Package,
    gradient: moduleGradientColors.settings,
  },
];

export const expenseStatusLabels: Record<string, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  CANCELLED: "Cancelled",
};

export const expenseCategoryLabels: Record<string, string> = {
  FOOD: "Food & Prasad",
  DECORATION: "Decoration",
  SERVICES: "Sound & Services",
  CULTURAL: "Cultural Program",
  OTHER: "Other / Admin",
};

/** Compact chip labels used by the toolbar filter to avoid wrapping. */
export const expenseCategoryShortLabels: Record<string, string> = {
  FOOD: "Food",
  DECORATION: "Decor",
  SERVICES: "Services",
  CULTURAL: "Cultural",
  OTHER: "Other",
};

export const expensePaymentLabels: Record<string, string> = {
  CASH: "Cash",
  UPI: "UPI",
  BANK_TRANSFER: "Bank Transfer",
  CHEQUE: "Cheque",
  OTHER: "Other",
};

export const expenseStatusBadgeStyles: Record<string, string> = {
  PENDING: badgeColors.pending,
  PAID: "bg-gradient-to-r from-emerald-500/20 to-lime-500/20 text-emerald-600 dark:text-emerald-400",
  CANCELLED: "bg-gradient-to-r from-rose-500/20 to-red-500/20 text-rose-500",
};

/** Lite category badges (subtle bg + colored text, matching status-badge style).
 *  Colors are derived from the same per-module gradients the avatars use. */
const moduleBadgeByGradient: Record<string, string> = Object.fromEntries(
  Object.entries(moduleGradientColors).map(([moduleKey, gradient]) => [
    gradient,
    moduleBadgeColors[moduleKey] || "bg-primary/15 text-primary border border-primary/20",
  ]),
);

export const expenseCategoryBadgeStyles: Record<string, string> = Object.fromEntries(
  expenseCategoryMeta.map(({ key, gradient }) => [key, moduleBadgeByGradient[gradient]]),
);

export const expenseCategoryOptions: { value: string; label: string }[] = [
  { value: "FOOD", label: "Food & Prasad" },
  { value: "DECORATION", label: "Decoration" },
  { value: "SERVICES", label: "Sound & Services" },
  { value: "CULTURAL", label: "Cultural Program" },
  { value: "OTHER", label: "Other / Admin" },
];

export const expensePaymentOptions: { value: string; label: string }[] = [
  { value: "UPI", label: "UPI" },
  { value: "CASH", label: "Cash" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "CHEQUE", label: "Cheque" },
];

export const expenseStatusOptions: { value: string; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "CANCELLED", label: "Cancelled" },
];

/** Statuses allowed when creating a new expense (records never start cancelled). */
export const expenseStatusCreateOptions: { value: string; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
];

/**
 * Allowed status transitions for a given current status.
 * Mirrors the backend transition matrix (see backend/src/utils/utility.js).
 */
export const expenseStatusTransitions: Record<string, string[]> = {
  PENDING: ["PAID", "CANCELLED"],
  PAID: ["PENDING"],
  CANCELLED: [],
};

export function expenseStatusLabel(status?: string): string {
  return (status && expenseStatusLabels[status]) || status || "—";
}

export function expenseCategoryLabel(category?: string): string {
  return (category && expenseCategoryLabels[category]) || category || "—";
}

export function expenseCategoryShortLabel(category?: string): string {
  return (
    (category && expenseCategoryShortLabels[category]) ||
    (category && expenseCategoryLabels[category]) ||
    category ||
    "—"
  );
}

export function expensePaymentLabel(mode?: string): string {
  return (mode && expensePaymentLabels[mode]) || mode || "—";
}

export function expenseStatusBadge(status?: string): string {
  return (status && expenseStatusBadgeStyles[status]) || "bg-muted text-muted-foreground";
}

export function expenseCategoryBadge(category?: string): string {
  return (
    (category && expenseCategoryBadgeStyles[category]) || "bg-muted text-muted-foreground"
  );
}

export function expenseCategoryMetaOf(category?: string): ExpenseCategoryMeta | undefined {
  return expenseCategoryMeta.find((m) => m.key === category);
}

export function getExpenseThemeGradient(): string {
  return getModuleTheme("expenses").gradient;
}

export function formatExpenseAmount(amount?: number): string {
  return amount != null && amount > 0
    ? `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
    : "—";
}

/** Amount formatting used by non-live mock/report surfaces (2-decimal en-IN). */
export function formatExpenseAmountPlain(amount?: number): string {
  return amount != null
    ? `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
    : "₹0.00";
}