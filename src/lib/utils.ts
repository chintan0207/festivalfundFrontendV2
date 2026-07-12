/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { GlobalRoleEnum } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
