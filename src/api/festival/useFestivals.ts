/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  FestivalService,
  type FestivalQueryParams,
} from "./festival.service";
import { useFestivalApiStore } from "./festival.store";
import type { CreateFestivalPayload, UpdateFestivalPayload } from "@/types/Types";

export const FESTIVAL_QUERY_KEYS = {
  all: (params?: FestivalQueryParams) =>
    params ? (["festivals", params] as const) : (["festivals"] as const),
  detail: (id: string) => ["festival", id] as const,
};

export const useFestivals = (params?: FestivalQueryParams) => {
  const setFestivals = useFestivalApiStore((s) => s.setFestivals);
  const setPaginationMeta = useFestivalApiStore((s) => s.setPaginationMeta);
  const setStatusCounts = useFestivalApiStore((s) => s.setStatusCounts);
  const setFacets = useFestivalApiStore((s) => s.setFacets);

  const isListQuery = params?.page !== undefined && params?.limit !== undefined;

  return useQuery({
    queryKey: FESTIVAL_QUERY_KEYS.all(params),
    queryFn: async () => {
      const res = await FestivalService.getAllFestivals(params);
      if (res.data) {
        // Always keep stored festival stats fresh so KPI cards re-derive data
        // immediately after any `["festivals"]` invalidation (e.g. contribution added).
        setFestivals(res.data.festivals);
        if (isListQuery) {
          setPaginationMeta({
            total: res.data.total,
            page: res.data.page,
            limit: res.data.limit,
            totalPages: res.data.totalPages,
          });
          setStatusCounts(res.data.statusCounts);
          setFacets(res.data.facets);
        }
      }
      return res.data;
    },
    staleTime: 0,
  });
};

export const useFestival = (festivalId: string) => {
  return useQuery({
    queryKey: FESTIVAL_QUERY_KEYS.detail(festivalId),
    queryFn: async () => {
      const res = await FestivalService.getFestivalById(festivalId);
      return res.data;
    },
    enabled: !!festivalId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateFestival = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateFestivalPayload) => FestivalService.createFestival(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: FESTIVAL_QUERY_KEYS.all() });
      toast.success(res.message || "Festival created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create festival");
    },
  });
};

export const useUpdateFestival = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      festivalId,
      payload,
    }: {
      festivalId: string;
      payload: UpdateFestivalPayload;
    }) => FestivalService.updateFestival(festivalId, payload),
    onSuccess: (res, { festivalId }) => {
      queryClient.invalidateQueries({ queryKey: FESTIVAL_QUERY_KEYS.all() });
      queryClient.invalidateQueries({ queryKey: FESTIVAL_QUERY_KEYS.detail(festivalId) });
      toast.success(res.message || "Festival updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update festival");
    },
  });
};

export const useSoftDeleteFestival = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (param: string | { festivalId: string; organizationId?: string }) => {
      const festivalId = typeof param === "string" ? param : param.festivalId;
      const organizationId = typeof param === "string" ? undefined : param.organizationId;
      return FestivalService.softDeleteFestival(festivalId, organizationId);
    },
    onSuccess: (res, param) => {
      const festivalId = typeof param === "string" ? param : param.festivalId;
      queryClient.invalidateQueries({ queryKey: FESTIVAL_QUERY_KEYS.all() });
      if (festivalId) {
        queryClient.invalidateQueries({ queryKey: FESTIVAL_QUERY_KEYS.detail(festivalId) });
      }
      toast.success(res.message || "Festival deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete festival");
    },
  });
};

export const useRestoreFestival = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (param: string | { festivalId: string; organizationId?: string }) => {
      const festivalId = typeof param === "string" ? param : param.festivalId;
      const organizationId = typeof param === "string" ? undefined : param.organizationId;
      return FestivalService.restoreFestival(festivalId, organizationId);
    },
    onSuccess: (res, param) => {
      const festivalId = typeof param === "string" ? param : param.festivalId;
      queryClient.invalidateQueries({ queryKey: FESTIVAL_QUERY_KEYS.all() });
      if (festivalId) {
        queryClient.invalidateQueries({ queryKey: FESTIVAL_QUERY_KEYS.detail(festivalId) });
      }
      toast.success(res.message || "Festival restored successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to restore festival");
    },
  });
};

export const useHardDeleteFestival = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (param: string | { festivalId: string; organizationId?: string }) => {
      const festivalId = typeof param === "string" ? param : param.festivalId;
      const organizationId = typeof param === "string" ? undefined : param.organizationId;
      return FestivalService.hardDeleteFestival(festivalId, organizationId);
    },
    onSuccess: (res, param) => {
      const festivalId = typeof param === "string" ? param : param.festivalId;
      queryClient.invalidateQueries({ queryKey: FESTIVAL_QUERY_KEYS.all() });
      if (festivalId) {
        queryClient.invalidateQueries({ queryKey: FESTIVAL_QUERY_KEYS.detail(festivalId) });
      }
      toast.success(res.message || "Festival permanently deleted");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to hard delete festival");
    },
  });
};