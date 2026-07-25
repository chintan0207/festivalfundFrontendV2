/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ContributorService } from "../contributor/contributor.service";
import { useContributorApiStore } from "../contributor/contributor.store";
import type { CreateContributorPayload, UpdateContributorPayload } from "@/types/Types";

export const CONTRIBUTOR_QUERY_KEYS = {
  all: ["contributors"] as const,
  detail: (id: string) => ["contributor", id] as const,
};

export const useContributors = () => {
  const setContributors = useContributorApiStore((s) => s.setContributors);

  return useQuery({
    queryKey: CONTRIBUTOR_QUERY_KEYS.all,
    queryFn: async () => {
      const res = await ContributorService.getAllContributors();
      if (res.data) {
        setContributors(res.data);
      }
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
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
      queryClient.invalidateQueries({ queryKey: CONTRIBUTOR_QUERY_KEYS.all });
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
      queryClient.invalidateQueries({ queryKey: CONTRIBUTOR_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: CONTRIBUTOR_QUERY_KEYS.detail(contributorId) });
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
    mutationFn: (contributorId: string) => ContributorService.softDeleteContributor(contributorId),
    onSuccess: (res, contributorId) => {
      queryClient.invalidateQueries({ queryKey: CONTRIBUTOR_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: CONTRIBUTOR_QUERY_KEYS.detail(contributorId) });
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
