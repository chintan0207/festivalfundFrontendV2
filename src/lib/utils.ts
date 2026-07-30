/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { GlobalRoleEnum } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export const getDashboardRoute = (user: any) => {
  console.log("getDashboardRoute user:", user);
  switch (user?.role) {
    case GlobalRoleEnum.ORG_ADMIN:
      return "/dashboard" as const;
    case GlobalRoleEnum.ORG_VIEWER:
      return "/dashboard" as const;
    default:
      return "/" as const;
  }
};
