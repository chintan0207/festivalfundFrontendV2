import ApiClient from "../apiClient";

export type ApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
};

export interface FestivalStatsResponse {
  openingBalance: number;
  totalCollected: number;
  pendingAmount: number;
  totalExpenses: number;
  currentBalance: number;
  categoryTotals?: Record<string, number>;
}

export type ReportExportParams = {
  search?: string;
  status?: string;
  type?: string;
  category?: string;
  contributorCategory?: string;
  paymentMode?: string;
  dateRange?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  isActive?: boolean;
};

export type ReportExportType =
  | "summary"
  | "contributions"
  | "expenses"
  | "contributors"
  | "audit";

export const ReportService = {
  /**
   * Fetch live calculated stats for a festival
   */
  getFestivalStats: async (festivalId: string): Promise<ApiResponse<FestivalStatsResponse>> => {
    const res = await ApiClient.get<ApiResponse<FestivalStatsResponse>>(`/reports/festival/${festivalId}/stats`);
    return res.data;
  },

  /**
   * Download a backend-generated PDF report for a Reports tab.
   */
  exportReport: async (type: ReportExportType, festivalId: string, params?: ReportExportParams): Promise<Blob> => {
    const res = await ApiClient.get(`/reports/export/${type}/${festivalId}`, {
      params,
      responseType: "blob",
    });
    return res.data as Blob;
  },
};
