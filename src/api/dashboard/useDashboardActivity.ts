import { useInfiniteQuery } from "@tanstack/react-query";
import { DashboardService } from "./dashboard.service";

export const ACTIVITY_PAGE_SIZE = 30;

/**
 * Paginated, full-festival activity feed used by Reports → Audit Log.
 * The query key is scoped to the festival + page size so switching the
 * festival in the top navbar refetches immediately and never shows stale data.
 */
export const useDashboardActivity = (
  festivalId: string,
  pageSize: number = ACTIVITY_PAGE_SIZE,
) => {
  return useInfiniteQuery({
    queryKey: ["dashboard", "activity", festivalId, pageSize] as const,
    queryFn: async ({ pageParam }) => {
      const res = await DashboardService.getActivity(festivalId, {
        limit: pageSize,
        offset: pageParam,
      });
      return res.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const loaded = allPages.reduce((sum, p) => sum + p.activity.length, 0);
      if (loaded >= lastPage.activityTotal) return undefined;
      return lastPageParam + lastPage.activity.length;
    },
    enabled: !!festivalId && festivalId !== "ALL",
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
};