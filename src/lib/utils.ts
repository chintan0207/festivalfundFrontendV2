/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { GlobalRoleEnum } from "./constants";

import { API_BASE_URL } from "@/api/env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFileUrl(url?: string | null): string {
  if (!url) return "";
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("blob:") ||
    url.startsWith("data:")
  ) {
    return url;
  }
  const base = (API_BASE_URL || "http://localhost:8081/api").replace(/\/api\/?$/, "");
  return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
}

export function looksLikeImage(url?: string | null): boolean {
  if (!url) return false;
  try {
    const cleanUrl = url.split("?")[0].split("#")[0].toLowerCase();
    return /\.(jpe?g|png|gif|webp|svg|bmp|avif)$/i.test(cleanUrl);
  } catch {
    return /\.(jpe?g|png|gif|webp|svg|bmp|avif)([?#].*)?$/i.test(url);
  }
}

export function looksLikePdf(url?: string | null): boolean {
  if (!url) return false;
  try {
    const cleanUrl = url.split("?")[0].split("#")[0].toLowerCase();
    return cleanUrl.endsWith(".pdf") || /\.pdf$/i.test(cleanUrl);
  } catch {
    return /\.pdf([?#].*)?$/i.test(url);
  }
}

export function getFileNameFromUrl(url?: string | null, fallback = "Attachment"): string {
  if (!url) return fallback;
  try {
    const cleanUrl = url.split("?")[0].split("#")[0];
    const name = cleanUrl.split("/").pop();
    return name ? decodeURIComponent(name) : fallback;
  } catch {
    return fallback;
  }
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

export function formatINR(value: number | string | null | undefined): string {
  const n = Number(value) || 0;
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(n);
}

export const getDashboardRoute = (user: any) => {
  switch (user?.role) {
    case GlobalRoleEnum.SUPER_ADMIN:
      return "/super-admin/dashboard" as const;
    case GlobalRoleEnum.ORG_ADMIN:
      return "/dashboard" as const;
    case GlobalRoleEnum.ORG_VIEWER:
      return "/dashboard" as const;
    default:
      return "/" as const;
  }
};

