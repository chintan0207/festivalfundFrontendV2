/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { GlobalRoleEnum } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDashboardRoute = (user: any) => {
  switch (user?.role) {
    case GlobalRoleEnum.ORG_ADMIN:
      return "/dashboard";
    case GlobalRoleEnum.ORG_VIEWER:
      return "/viewer/dashboard";
    default:
      return "/";
  }
};
