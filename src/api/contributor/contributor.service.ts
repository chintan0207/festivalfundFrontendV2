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

export const ContributorService = {
  getAllContributors: async () => {
    const response = await ApiClient.get<ApiResponse<Contributor[]>>("/contributors");
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
