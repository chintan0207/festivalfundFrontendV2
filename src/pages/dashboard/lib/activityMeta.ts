import {
  HandCoins,
  Receipt,
  UserPlus,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";
import type { DashboardActivityType } from "@/api/dashboard/dashboard.service";

export interface ActivityTypeMeta {
  Icon: LucideIcon;
  bubble: string;
  text: string;
}

export const ACTIVITY_META: Record<DashboardActivityType, ActivityTypeMeta> = {
  CONTRIBUTION: {
    Icon: HandCoins,
    bubble: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  CONTRIBUTION_STATUS: {
    Icon: RefreshCw,
    bubble: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    text: "text-amber-600 dark:text-amber-400",
  },
  EXPENSE: {
    Icon: Receipt,
    bubble: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    text: "text-rose-600 dark:text-rose-400",
  },
  EXPENSE_STATUS: {
    Icon: RefreshCw,
    bubble: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    text: "text-blue-600 dark:text-blue-400",
  },
  CONTRIBUTOR: {
    Icon: UserPlus,
    bubble: "bg-green-500/10 text-green-600 dark:text-green-400",
    text: "text-green-600 dark:text-green-400",
  },
};

export function activityMeta(type: DashboardActivityType | string): ActivityTypeMeta {
  return ACTIVITY_META[type as DashboardActivityType] || ACTIVITY_META.CONTRIBUTION;
}