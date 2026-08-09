import type {
  Festival,
  CreateFestivalPayload,
  UpdateFestivalPayload,
} from "@/types/Types";
import ApiClient from "../apiClient";

export type ApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
};

export type ApiMessageResponse = {
  statusCode: number;
  success: boolean;
  message: string;
};

export type FestivalQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  category?: string;
  year?: string;
  location?: string;
};

export type FestivalStatusCounts = {
  total: number;
  UPCOMING: number;
  ACTIVE: number;
  COMPLETED: number;
  ARCHIVED: number;
};

export type FestivalFacets = {
  years: number[];
  locations: string[];
};

export type FestivalListData = {
  festivals: Festival[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  statusCounts: FestivalStatusCounts;
  facets: FestivalFacets;
};

export const FestivalService = {
  getAllFestivals: async (params?: FestivalQueryParams) => {
    const response = await ApiClient.get<ApiResponse<FestivalListData>>("/festivals", {
      params,
    });
    return response.data;
  },

  getFestivalById: async (festivalId: string) => {
    const response = await ApiClient.get<ApiResponse<Festival>>(`/festivals/${festivalId}`);
    return response.data;
  },

  createFestival: async (payload: CreateFestivalPayload) => {
    const response = await ApiClient.post<ApiResponse<Festival>>("/festivals", payload);
    return response.data;
  },

  updateFestival: async (festivalId: string, payload: UpdateFestivalPayload) => {
    const response = await ApiClient.patch<ApiResponse<Festival>>(
      `/festivals/${festivalId}`,
      payload,
    );
    return response.data;
  },

  softDeleteFestival: async (festivalId: string, organizationId?: string) => {
    const response = await ApiClient.delete<ApiResponse<null>>(`/festivals/${festivalId}`, {
      data: organizationId ? { organizationId } : undefined,
    });
    return response.data;
  },

  restoreFestival: async (festivalId: string, organizationId?: string) => {
    const response = await ApiClient.patch<ApiResponse<null>>(
      `/festivals/${festivalId}/restore`,
      organizationId ? { organizationId } : {},
    );
    return response.data;
  },

  hardDeleteFestival: async (festivalId: string, organizationId?: string) => {
    const response = await ApiClient.delete<ApiResponse<null>>(`/festivals/${festivalId}/hard`, {
      data: organizationId ? { organizationId } : undefined,
    });
    return response.data;
  },
};
