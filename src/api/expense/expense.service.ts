import type {
  Expense,
  ExpenseListData,
  CreateExpensePayload,
  UpdateExpensePayload,
} from "@/types/Types";
import ApiClient from "../apiClient";

export type ApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
};

export type ExpenseQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  festivalId?: string;
  category?: string;
  status?: string;
  dateRange?: string;
  startDate?: string;
  endDate?: string;
};

export const ExpenseService = {
  getAllExpenses: async (params?: ExpenseQueryParams) => {
    const response = await ApiClient.get<ApiResponse<ExpenseListData>>("/expenses", {
      params,
    });
    return response.data;
  },

  getExpenseById: async (id: string) => {
    const response = await ApiClient.get<ApiResponse<Expense>>(`/expenses/${id}`);
    return response.data;
  },

  createExpense: async (payload: CreateExpensePayload) => {
    const response = await ApiClient.post<ApiResponse<{ expense: Expense }>>(
      "/expenses",
      payload,
    );
    return response.data;
  },

  updateExpense: async (id: string, payload: UpdateExpensePayload) => {
    const response = await ApiClient.patch<ApiResponse<{ expense: Expense }>>(
      `/expenses/${id}`,
      payload,
    );
    return response.data;
  },

  updateExpenseStatus: async (id: string, status: string, reason?: string) => {
    const response = await ApiClient.patch<ApiResponse<{ expense: Expense }>>(
      `/expenses/${id}/status`,
      { status, reason: reason?.trim() || "" },
    );
    return response.data;
  },

  deleteExpense: async (id: string) => {
    const response = await ApiClient.delete<ApiResponse<null>>(`/expenses/${id}`);
    return response.data;
  },

  downloadExpensesPdfByFestival: async (festivalId: string) => {
    const response = await ApiClient.get(`/expenses/pdf/${festivalId}`, {
      responseType: "blob",
    });
    return response.data as Blob;
  },
};
