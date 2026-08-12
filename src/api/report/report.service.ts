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

export const ReportService = {
  /**
   * Fetch live calculated stats for a festival
   */
  getFestivalStats: async (festivalId: string): Promise<ApiResponse<FestivalStatsResponse>> => {
    const res = await ApiClient.get<ApiResponse<FestivalStatsResponse>>(`/reports/festival/${festivalId}/stats`);
    return res.data;
  },

  /**
   * Download Complete Festival Report PDF blob
   */
  downloadFestivalPdf: async (festivalId: string): Promise<Blob> => {
    const res = await ApiClient.get(`/reports/festival/${festivalId}/pdf`, {
      responseType: "blob",
    });
    return res.data;
  },

  /**
   * Download Contributions PDF blob
   */
  downloadContributionsPdf: async (festivalId?: string): Promise<Blob> => {
    const res = await ApiClient.get("/reports/contributions/pdf", {
      params: festivalId ? { festivalId } : {},
      responseType: "blob",
    });
    return res.data;
  },

  /**
   * Download Expenses PDF blob
   */
  downloadExpensesPdf: async (festivalId?: string): Promise<Blob> => {
    const res = await ApiClient.get("/reports/expenses/pdf", {
      params: festivalId ? { festivalId } : {},
      responseType: "blob",
    });
    return res.data;
  },
};
