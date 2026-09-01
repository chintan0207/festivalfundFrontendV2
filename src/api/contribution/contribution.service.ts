import type {
  Contribution,
  ContributionListItem,
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
  page?: number;
  limit?: number;
  search?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  festivalId?: string;
  contributorId?: string;
  status?: string;
  category?: string;
  type?: string;
};

export type ContributionListData = {
  contributions: ContributionListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  statusCounts: {
    total: number;
    DEPOSITED: number;
    PENDING: number;
    CANCELLED: number;
  };
};

export const ContributionService = {
  getAllContributions: async (params?: ContributionQueryParams) => {
    const response = await ApiClient.get<ApiResponse<ContributionListData>>("/contributions", {
      params,
    });
    return response.data;
  },

  getContributionById: async (id: string) => {
    const response = await ApiClient.get<ApiResponse<ContributionListItem>>(
      `/contributions/${id}`,
    );
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

  updateContributionStatus: async (id: string, status: string, reason?: string) => {
    const response = await ApiClient.patch<ApiResponse<Contribution>>(
      `/contributions/${id}/status`,
      { status, reason: reason?.trim() || "" },
    );
    return response.data;
  },

  deleteContribution: async (id: string) => {
    const response = await ApiClient.delete<ApiResponse<null>>(`/contributions/${id}`);
    return response.data;
  },

  getContributionSlip: async (id: string, version?: number) => {
    const response = await ApiClient.get(`/contributions/${id}/slip`, {
      params: version ? { v: version } : { _t: Date.now() },
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
