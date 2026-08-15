import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "./dashboard.service";

export const DASHBOARD_QUERY_KEYS = {
  all: ["dashboard"] as const,
  festival: (festivalId: string) => ["dashboard", festivalId] as const,
};

/**
 * Optimized single-request dashboard. The query key is scoped to the active
 * festival, so switching the festival in the top navbar automatically triggers
 * a fresh fetch and can never render stale data from the previous festival.
 */
export const useDashboard = (festivalId: string) => {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.festival(festivalId),
    queryFn: async () => {
      const res = await DashboardService.getDashboard(festivalId);
      return res.data;
    },
    enabled: !!festivalId && festivalId !== "ALL",
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
};
