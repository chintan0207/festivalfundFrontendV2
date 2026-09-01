import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "./dashboard.service";

export const DASHBOARD_QUERY_KEYS = {
  all: ["dashboard"] as const,
  festival: (festivalId: string) => ["dashboard", festivalId] as const,
};

/**
 * Single-request dashboard query with fallback handlers for tasks and notes.
 */
export const useDashboard = (festivalId: string) => {
  const { data: dashboardData, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.festival(festivalId),
    queryFn: async () => {
      const res = await DashboardService.getDashboard(festivalId);
      const tasksRes = await DashboardService.getTasks(festivalId).catch(() => ({ data: [] }));
      const notesRes = await DashboardService.getNotes(festivalId).catch(() => ({ data: [] }));

      const dataObj = res?.data;

      return {
        ...dataObj,
        tasks: Array.isArray(tasksRes?.data) ? tasksRes.data : (dataObj?.tasks || []),
        notes: Array.isArray(notesRes?.data) ? notesRes.data : (dataObj?.notes || []),
      };
    },
    enabled: !!festivalId && festivalId !== "ALL",
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    data: dashboardData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};
