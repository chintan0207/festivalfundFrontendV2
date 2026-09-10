/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ContributionService,
  type ContributionQueryParams,
} from "./contribution.service";
import { useContributionApiStore } from "./contribution.store";
import type { CreateContributionPayload, UpdateContributionPayload } from "@/types/Types";

export const CONTRIBUTION_QUERY_KEYS = {
  all: (params?: ContributionQueryParams) =>
    params ? (["contributions", params] as const) : (["contributions"] as const),
  detail: (id: string) => ["contribution", id] as const,
};

export const useContributions = (params?: ContributionQueryParams) => {
  const setContributions = useContributionApiStore((s) => s.setContributions);
  const setPaginationMeta = useContributionApiStore((s) => s.setPaginationMeta);
  const setStatusCounts = useContributionApiStore((s) => s.setStatusCounts);

  const isListQuery = params?.page !== undefined && params?.limit !== undefined;

  return useQuery({
    queryKey: CONTRIBUTION_QUERY_KEYS.all(params),
    queryFn: async () => {
      const res = await ContributionService.getAllContributions(params);
      if (res.data) {
        if (isListQuery) {
          setContributions(res.data.contributions);
          setPaginationMeta({
            total: res.data.total,
            page: res.data.page,
            limit: res.data.limit,
            totalPages: res.data.totalPages,
          });
          setStatusCounts(res.data.statusCounts);
        }
      }
      return res.data;
    },
    staleTime: 0,
  });
};

export const useContribution = (id: string) => {
  return useQuery({
    queryKey: CONTRIBUTION_QUERY_KEYS.detail(id),
    queryFn: async () => {
      const res = await ContributionService.getContributionById(id);
      return res.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateContribution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateContributionPayload) =>
      ContributionService.createContribution(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["contributions"] });
      queryClient.invalidateQueries({ queryKey: ["festivals"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(res.message || "Contribution created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create contribution");
    },
  });
};

export const useUpdateContribution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateContributionPayload }) =>
      ContributionService.updateContribution(id, payload),
    onSuccess: (res, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["contributions"] });
      queryClient.invalidateQueries({ queryKey: CONTRIBUTION_QUERY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: ["festivals"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(res.message || "Contribution updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update contribution");
    },
  });
};

export const useUpdateContributionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      reason,
    }: {
      id: string;
      status: string;
      reason?: string;
    }) => ContributionService.updateContributionStatus(id, status, reason),
    onSuccess: (res, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["contributions"] });
      queryClient.invalidateQueries({ queryKey: CONTRIBUTION_QUERY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: ["festivals"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(res.message || "Contribution status updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update contribution status",
      );
    },
  });
};

export const useDeleteContribution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ContributionService.deleteContribution(id),
    onSuccess: (res, id) => {
      queryClient.invalidateQueries({ queryKey: ["contributions"] });
      queryClient.invalidateQueries({ queryKey: CONTRIBUTION_QUERY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: ["festivals"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(res.message || "Contribution deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete contribution");
    },
  });
};

const SLIP_TOAST_ID = "download-contribution-slip";

export const useDownloadContributionSlip = () => {
  return useMutation({
    mutationFn: (id: string) => ContributionService.getContributionSlip(id),
    onMutate: () => {
      toast.loading("Downloading slip…", { id: SLIP_TOAST_ID });
    },
    onSuccess: (blob, id) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `contribution-slip-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Receipt slip downloaded successfully", { id: SLIP_TOAST_ID });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to download receipt slip", {
        id: SLIP_TOAST_ID,
      });
    },
  });
};

export const useDownloadContributionsPdfByFestival = () => {
  return useMutation({
    mutationFn: (festivalId: string) =>
      ContributionService.downloadContributionsPdfByFestival(festivalId),
    onSuccess: (blob, festivalId) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `contributions-festival-${festivalId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Festival contributions PDF downloaded successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to download PDF");
    },
  });
};

export const useSendContributionSlipEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, email, force = true }: { id: string; email?: string; force?: boolean }) =>
      ContributionService.sendContributionSlipEmail(id, { email, force }),
    onSuccess: (data, variables) => {
      toast.success(data?.message || `Receipt slip emailed successfully`);
      queryClient.invalidateQueries({ queryKey: CONTRIBUTION_QUERY_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: ["contributions"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to send receipt slip email");
    },
  });
};
