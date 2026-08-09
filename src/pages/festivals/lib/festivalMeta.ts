import type { FestivalStatus } from "@/types/Types";

export const festivalStatusOptions: { value: FestivalStatus; label: string }[] = [
  { value: "UPCOMING", label: "Upcoming" },
  { value: "ACTIVE", label: "Active" },
  { value: "COMPLETED", label: "Completed" },
  { value: "ARCHIVED", label: "Archived" },
];

export const festivalStatusTransition: Partial<
  Record<FestivalStatus, FestivalStatus[]>
> = {
  UPCOMING: ["ACTIVE", "ARCHIVED"],
  ACTIVE: ["COMPLETED", "ARCHIVED"],
  COMPLETED: ["ARCHIVED"],
  ARCHIVED: [],
};

export const festivalStatusBadge = (status: string) => {
  switch (status) {
    case "UPCOMING":
      return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20";
    case "ACTIVE":
      return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    case "COMPLETED":
      return "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/20";
    default:
      return "bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/20";
  }
};

export const festivalStatusLabel = (status: string) =>
  festivalStatusOptions.find((o) => o.value === status)?.label ?? status;

export const festivalCategoryOptions: { value: string; label: string }[] = [
  { value: "Religious & Cultural", label: "Religious & Cultural" },
  { value: "Social & Community", label: "Social & Community" },
  { value: "Youth & Sports", label: "Youth & Sports" },
];

export const festivalCategoryBadge = (category?: string) => {
  switch (category) {
    case "Religious & Cultural":
      return "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
    case "Social & Community":
      return "bg-pink-500/15 text-pink-600 dark:text-pink-400 border-pink-500/20";
    case "Youth & Sports":
      return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};