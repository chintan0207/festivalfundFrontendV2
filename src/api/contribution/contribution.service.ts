import type {
  Contribution,
  CreateContributionPayload,
  UpdateContributionPayload,
} from "@/types/Types";
import ApiClient from "../apiClient";

export type ApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
};

export type ContributionQueryParams = {
  festivalId?: string;
  contributorId?: string;
  type?: string;
  status?: string;
  page?: number;
  limit?: number;
};

export const ContributionService = {
  getAllContributions: async (params?: ContributionQueryParams) => {
    const response = await ApiClient.get<ApiResponse<Contribution[]>>("/contributions", {
      params,
    });
    return response.data;
  },

  getContributionById: async (id: string) => {
    const response = await ApiClient.get<ApiResponse<Contribution>>(`/contributions/${id}`);
    return response.data;
  },

  createContribution: async (payload: CreateContributionPayload) => {
    const response = await ApiClient.post<ApiResponse<Contribution>>("/contributions", payload);
    return response.data;
  },

  updateContribution: async (id: string, payload: UpdateContributionPayload) => {
    const response = await ApiClient.patch<ApiResponse<Contribution>>(
      `/contributions/${id}`,
      payload,
    );
    return response.data;
  },

  deleteContribution: async (id: string) => {
    const response = await ApiClient.delete<ApiResponse<null>>(`/contributions/${id}`);
    return response.data;
  },

  getContributionSlip: async (id: string) => {
    const response = await ApiClient.get(`/contributions/${id}/slip`, {
      responseType: "blob",
    });
    return response.data as Blob;
  },

  downloadContributionsPdfByFestival: async (festivalId: string) => {
    const response = await ApiClient.get(`/contributions/pdf/${festivalId}`, {
      responseType: "blob",
    });
    return response.data as Blob;
  },
};
