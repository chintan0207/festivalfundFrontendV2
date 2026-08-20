/**
 * Shared hex palette for Recharts visualizations. Single source of truth so the
 * dashboard and reports never hardcode duplicate chart colors. Kept in sync
 * with the module accent tokens above (emerald = contributions, rose = expenses).
 */
export const chartPalette = {
  contributions: "#10b981",
  expenses: "#f43f5e",
  balance: "#8b5cf6",
  money: "#10b981",
  item: "#6366f1",
  cash: "#10b981",
  upi: "#3b82f6",
  bankTransfer: "#6366f1",
  cheque: "#f59e0b",
  other: "#6b7280",
};

export const chartCategoryColors: Record<string, string> = {
  FOOD: "#ef4444",
  DECORATION: "#10b981",
  SERVICES: "#f59e0b",
  CULTURAL: "#8b5cf6",
  OTHER: "#6b7280",
  PARENT: "#10b981",
  BOY: "#3b82f6",
  GIRL: "#f43f5e",
  MONEY: "#10b981",
  ITEM: "#6366f1",
  CASH: "#10b981",
  UPI: "#3b82f6",
  BANK_TRANSFER: "#6366f1",
  CHEQUE: "#f59e0b",
};

/** Distinct fallback accent cycle for any future category keys. */
const CHART_CATEGORY_FALLBACK = [
  "#10b981",
  "#3b82f6",
  "#8b5cf6",
  "#06b6d4",
  "#f59e0b",
  "#ef4444",
];

/** Stable per-key color for any category, cycling the fallback palette. */
export function chartCategoryColor(key?: string): string {
  if (key && chartCategoryColors[key]) return chartCategoryColors[key];
  return CHART_CATEGORY_FALLBACK[
    Math.abs(hashString(key || "")) % CHART_CATEGORY_FALLBACK.length
  ];
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

export const gradientColors = [
  "bg-gradient-to-r from-pink-500 to-rose-600",
  "bg-gradient-to-r from-sky-500 to-blue-600",
  "bg-gradient-to-r from-green-500 to-emerald-600",
  "bg-gradient-to-r from-rose-500 to-red-600",
  "bg-gradient-to-r from-violet-500 to-purple-600",
  "bg-gradient-to-r from-slate-600 to-zinc-600",
  "bg-gradient-to-r from-red-500 to-orange-600",
  "bg-gradient-to-r from-amber-500 to-yellow-600",
  "bg-gradient-to-r from-lime-500 to-green-600",
  "bg-gradient-to-r from-violet-500 to-fuchsia-600",
] as const;

export const gradientColorNames = {
  pinkToRose: gradientColors[0],
  skyToBlue: gradientColors[1],
  greenToEmerald: gradientColors[2],
  roseToRed: gradientColors[3],
  violetToPurple: gradientColors[4],
  slateToZinc: gradientColors[5],
  redToOrange: gradientColors[6],
  amberToYellow: gradientColors[7],
  limeToGreen: gradientColors[8],
  violetToFuchsia: gradientColors[9],
} as const;

export const moduleGradientColors: Record<string, string> = {
  dashboard: gradientColors[1],
  festivals: gradientColors[0],
  contributors: gradientColors[2],
  contributions: gradientColors[4],
  expenses: gradientColors[3],
  billing: gradientColors[7],
  reports: gradientColors[6],
  analytics: gradientColors[6],
  users: gradientColors[1],
  documents: gradientColors[7],
  "audit-logs": gradientColorNames.slateToZinc,
  integrations: gradientColors[9],
  settings: gradientColors[5],
  help: gradientColors[4],
  "super-admin": gradientColors[0],
  "public-lookup": gradientColors[1],
  default: gradientColors[1],
};

export const moduleIconColors: Record<string, string> = {
  dashboard: "text-sky-500 dark:text-sky-400",
  festivals: "text-pink-500 dark:text-pink-400",
  contributors: "text-green-500 dark:text-green-400",
  contributions: "text-violet-500 dark:text-violet-400",
  expenses: "text-rose-500 dark:text-rose-400",
  billing: "text-amber-500 dark:text-amber-400",
  reports: "text-red-500 dark:text-red-400",
  analytics: "text-red-500 dark:text-red-400",
  users: "text-sky-500 dark:text-sky-400",
  documents: "text-amber-500 dark:text-amber-400",
  "audit-logs": "text-slate-500 dark:text-slate-400",
  integrations: "text-fuchsia-500 dark:text-fuchsia-400",
  settings: "text-slate-400 dark:text-slate-400",
  help: "text-purple-500 dark:text-purple-400",
  "super-admin": "text-pink-500 dark:text-pink-400",
  "public-lookup": "text-sky-500 dark:text-sky-400",
  default: "text-sky-500 dark:text-sky-400",
};

// Left-to-right smooth gradient fills for active sidebar items
export const moduleFillColors: Record<string, string> = {
  dashboard:
    "bg-gradient-to-r from-sky-500/20 via-blue-500/10 to-transparent border-l-4 border-sky-500 text-foreground font-semibold shadow-xs",
  festivals:
    "bg-gradient-to-r from-pink-500/20 via-rose-500/10 to-transparent border-l-4 border-pink-500 text-foreground font-semibold shadow-xs",
  contributors:
    "bg-gradient-to-r from-green-500/20 via-emerald-500/10 to-transparent border-l-4 border-green-500 text-foreground font-semibold shadow-xs",
  contributions:
    "bg-gradient-to-r from-violet-500/20 via-purple-500/10 to-transparent border-l-4 border-violet-500 text-foreground font-semibold shadow-xs",
  expenses:
    "bg-gradient-to-r from-rose-500/20 via-red-500/10 to-transparent border-l-4 border-rose-500 text-foreground font-semibold shadow-xs",
  billing:
    "bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-transparent border-l-4 border-amber-500 text-foreground font-semibold shadow-xs",
  reports:
    "bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-transparent border-l-4 border-cyan-500 text-foreground font-semibold shadow-xs",
  analytics:
    "bg-gradient-to-r from-red-500/20 via-rose-500/10 to-transparent border-l-4 border-red-500 text-foreground font-semibold shadow-xs",
  users:
    "bg-gradient-to-r from-blue-500/20 via-indigo-500/10 to-transparent border-l-4 border-blue-500 text-foreground font-semibold shadow-xs",
  documents:
    "bg-gradient-to-r from-yellow-500/20 via-amber-500/10 to-transparent border-l-4 border-yellow-500 text-foreground font-semibold shadow-xs",
  "audit-logs":
    "bg-gradient-to-r from-lime-500/20 via-green-500/10 to-transparent border-l-4 border-lime-500 text-foreground font-semibold shadow-xs",
  integrations:
    "bg-gradient-to-r from-fuchsia-500/20 via-purple-500/10 to-transparent border-l-4 border-fuchsia-500 text-foreground font-semibold shadow-xs",
  settings:
    "bg-gradient-to-r from-slate-500/20 via-zinc-500/10 to-transparent border-l-4 border-slate-500 text-foreground font-semibold shadow-xs",
  help: "bg-gradient-to-r from-purple-500/20 via-indigo-500/10 to-transparent border-l-4 border-purple-500 text-foreground font-semibold shadow-xs",
  "super-admin":
    "bg-gradient-to-r from-pink-500/20 via-rose-500/10 to-transparent border-l-4 border-pink-500 text-foreground font-semibold shadow-xs",
  "public-lookup":
    "bg-gradient-to-r from-sky-500/20 via-blue-500/10 to-transparent border-l-4 border-sky-500 text-foreground font-semibold shadow-xs",
  default:
    "bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border-l-4 border-primary font-semibold shadow-xs",
};

export const moduleBadgeColors: Record<string, string> = {
  dashboard: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/20",
  festivals: "bg-pink-500/15 text-pink-600 dark:text-pink-400 border border-pink-500/20",
  contributors:
    "bg-green-500/15 text-green-600 dark:text-green-400 border border-green-500/20",
  contributions:
    "bg-violet-500/15 text-violet-600 dark:text-violet-400 border border-violet-500/20",
  expenses: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20",
  billing:
    "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20",
  reports: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20",
  analytics: "bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/20",
  users: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20",
  documents:
    "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20",
  "audit-logs":
    "bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/20",
  integrations:
    "bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-400 border border-fuchsia-500/20",
  settings:
    "bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/20",
  help: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20",
  "super-admin":
    "bg-pink-500/15 text-pink-600 dark:text-pink-400 border border-pink-500/20",
  "public-lookup":
    "bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/20",
  default: "bg-primary/15 text-primary border border-primary/20",
};

export const badgeColors = {
  boys: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-500",
  girls: "bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-500",
  parents: "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-500",

  pending: "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-500",
  deposited: "bg-gradient-to-r from-green-500/20 to-lime-500/20 text-green-500",

  decoration: "bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-purple-500",
  mandap: "bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-500",
  sound: "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-500",
};

export const categoryAvatarGradients: Record<string, string> = {
  PARENT: "bg-gradient-to-br from-emerald-400 to-green-600",
  BOY: "bg-gradient-to-br from-sky-400 to-blue-600",
  GIRL: "bg-gradient-to-br from-pink-400 to-rose-600",
  default: "bg-gradient-to-br from-violet-400 to-purple-600",
};

export function categoryAvatarGradient(category?: string): string {
  return (
    (category && categoryAvatarGradients[category]) || categoryAvatarGradients.default
  );
}

export interface ModuleTheme {
  gradient: string;
  iconColor: string;
  fillColor: string;
  badgeColor: string;
}

/**
 * Utility function to retrieve all theme properties for a given module as a single object.
 * Returns gradient, iconColor, fillColor, and badgeColor for the requested module.
 */
export function getModuleTheme(moduleName: string = "default"): ModuleTheme {
  const key = moduleName.toLowerCase();
  return {
    gradient: moduleGradientColors[key] || moduleGradientColors.default,
    iconColor: moduleIconColors[key] || moduleIconColors.default,
    fillColor: moduleFillColors[key] || moduleFillColors.default,
    badgeColor: moduleBadgeColors[key] || moduleBadgeColors.default,
  };
}

export const getModuleColors = getModuleTheme;
