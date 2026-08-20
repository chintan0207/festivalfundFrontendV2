/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { ContributorService, type ContributorQueryParams } from "./contributor.service";
import { useContributorApiStore } from "./contributor.store";
import type { CreateContributorPayload, UpdateContributorPayload } from "@/types/Types";

export const CONTRIBUTOR_QUERY_KEYS = {
  all: (params?: ContributorQueryParams) =>
    params ? (["contributors", params] as const) : (["contributors"] as const),
  detail: (id: string) => ["contributor", id] as const,
};

export type UseContributorsOptions = {
  keepPreviousData?: boolean;
};

export const useContributors = (
  params?: ContributorQueryParams,
  options?: UseContributorsOptions,
) => {
  const setContributors = useContributorApiStore((s) => s.setContributors);
  const setPaginationMeta = useContributorApiStore((s) => s.setPaginationMeta);
  const setCategoryCounts = useContributorApiStore((s) => s.setCategoryCounts);

  const isListQuery = params?.page !== undefined && params?.limit !== undefined;

  return useQuery({
    queryKey: CONTRIBUTOR_QUERY_KEYS.all(params),
    queryFn: async () => {
      const res = await ContributorService.getAllContributors(params);
      if (res.data) {
        if (isListQuery) {
          setContributors(res.data.contributors);
          setPaginationMeta({
            total: res.data.total,
            page: res.data.page,
            limit: res.data.limit,
            totalPages: res.data.totalPages,
          });
          setCategoryCounts(res.data.categoryCounts);
        }
      }
      return res.data;
    },
    staleTime: 0,
    ...(options?.keepPreviousData ? { placeholderData: keepPreviousData } : {}),
  });
};

export const useContributor = (contributorId: string) => {
  return useQuery({
    queryKey: CONTRIBUTOR_QUERY_KEYS.detail(contributorId),
    queryFn: async () => {
      const res = await ContributorService.getContributorById(contributorId);
      return res.data;
    },
    enabled: !!contributorId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateContributor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateContributorPayload) =>
      ContributorService.createContributor(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: CONTRIBUTOR_QUERY_KEYS.all() });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(res.message || "Contributor added successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to add contributor");
    },
  });
};

export const useUpdateContributor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      contributorId,
      payload,
    }: {
      contributorId: string;
      payload: UpdateContributorPayload;
    }) => ContributorService.updateContributor(contributorId, payload),
    onSuccess: (res, { contributorId }) => {
      queryClient.invalidateQueries({ queryKey: CONTRIBUTOR_QUERY_KEYS.all() });
      queryClient.invalidateQueries({
        queryKey: CONTRIBUTOR_QUERY_KEYS.detail(contributorId),
      });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(res.message || "Contributor updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update contributor");
    },
  });
};

export const useSoftDeleteContributor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contributorId: string) =>
      ContributorService.softDeleteContributor(contributorId),
    onSuccess: (res, contributorId) => {
      queryClient.invalidateQueries({ queryKey: CONTRIBUTOR_QUERY_KEYS.all() });
      queryClient.invalidateQueries({
        queryKey: CONTRIBUTOR_QUERY_KEYS.detail(contributorId),
      });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(res.message || "Contributor deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete contributor");
    },
  });
};

export const useDownloadContributorsPdf = () => {
  return useMutation({
    mutationFn: () => ContributorService.downloadAllContributorsPdf(),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `contributors-list-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Contributors PDF downloaded successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to download PDF");
    },
  });
};
