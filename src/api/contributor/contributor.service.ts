import type {
  Contributor,
  CreateContributorPayload,
  UpdateContributorPayload,
} from "@/types/Types";
import ApiClient from "../apiClient";

export type ApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
};

export type ContributorQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortOrder?: "asc" | "desc";
  sortField?: string;
  category?: string;
  isActive?: string;
};

export type ContributorListData = {
  contributors: Contributor[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  categoryCounts: {
    total: number;
    PARENT: number;
    BOY: number;
    GIRL: number;
  };
};

export const ContributorService = {
  getAllContributors: async (params?: ContributorQueryParams) => {
    const response = await ApiClient.get<ApiResponse<ContributorListData>>("/contributors", {
      params,
    });
    return response.data;
  },

  getContributorById: async (contributorId: string) => {
    const response = await ApiClient.get<ApiResponse<Contributor>>(
      `/contributors/${contributorId}`,
    );
    return response.data;
  },

  createContributor: async (payload: CreateContributorPayload) => {
    const response = await ApiClient.post<ApiResponse<Contributor>>("/contributors", payload);
    return response.data;
  },

  updateContributor: async (contributorId: string, payload: UpdateContributorPayload) => {
    const response = await ApiClient.patch<ApiResponse<Contributor>>(
      `/contributors/${contributorId}`,
      payload,
    );
    return response.data;
  },

  softDeleteContributor: async (contributorId: string) => {
    const response = await ApiClient.delete<ApiResponse<null>>(`/contributors/${contributorId}`);
    return response.data;
  },

  downloadAllContributorsPdf: async () => {
    const response = await ApiClient.get("/contributors/all/pdf", {
      responseType: "blob",
    });
    return response.data as Blob;
  },
};
