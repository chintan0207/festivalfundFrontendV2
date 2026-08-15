/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ExpenseService, type ExpenseQueryParams } from "./expense.service";
import { useExpenseApiStore } from "./expense.store";
import type { CreateExpensePayload, UpdateExpensePayload } from "@/types/Types";

export const EXPENSE_QUERY_KEYS = {
  all: (params?: ExpenseQueryParams) =>
    params ? (["expenses", params] as const) : (["expenses"] as const),
  detail: (id: string) => ["expense", id] as const,
};

export const useExpenses = (params?: ExpenseQueryParams) => {
  const setExpenses = useExpenseApiStore((s) => s.setExpenses);
  const setPaginationMeta = useExpenseApiStore((s) => s.setPaginationMeta);
  const setStatusCounts = useExpenseApiStore((s) => s.setStatusCounts);
  const setStatusAmounts = useExpenseApiStore((s) => s.setStatusAmounts);
  const setCategoryTotals = useExpenseApiStore((s) => s.setCategoryTotals);

  const isListQuery = params?.page !== undefined && params?.limit !== undefined;

  return useQuery({
    queryKey: EXPENSE_QUERY_KEYS.all(params),
    queryFn: async () => {
      const res = await ExpenseService.getAllExpenses(params);
      if (res.data) {
        if (isListQuery) {
          setExpenses(res.data.expenses);
          setPaginationMeta({
            total: res.data.total,
            page: res.data.page,
            limit: res.data.limit,
            totalPages: res.data.totalPages,
          });
          setStatusCounts(res.data.statusCounts);
          setStatusAmounts(res.data.statusAmounts);
          setCategoryTotals(res.data.categoryTotals);
        }
      }
      return res.data;
    },
    staleTime: 0,
  });
};

export const useExpense = (id: string) => {
  return useQuery({
    queryKey: EXPENSE_QUERY_KEYS.detail(id),
    queryFn: async () => {
      const res = await ExpenseService.getExpenseById(id);
      return res.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateExpensePayload) => ExpenseService.createExpense(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["festivals"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(res.message || "Expense created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create expense");
    },
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateExpensePayload }) =>
      ExpenseService.updateExpense(id, payload),
    onSuccess: (res, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: EXPENSE_QUERY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: ["festivals"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(res.message || "Expense updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update expense");
    },
  });
};

export const useUpdateExpenseStatus = () => {
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
    }) => ExpenseService.updateExpenseStatus(id, status, reason),
    onSuccess: (res, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: EXPENSE_QUERY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: ["festivals"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(res.message || "Expense status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update expense status");
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ExpenseService.deleteExpense(id),
    onSuccess: (res, id) => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: EXPENSE_QUERY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: ["festivals"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(res.message || "Expense deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete expense");
    },
  });
};

export const useDownloadExpensesPdfByFestival = () => {
  return useMutation({
    mutationFn: (festivalId: string) =>
      ExpenseService.downloadExpensesPdfByFestival(festivalId),
    onSuccess: (blob, festivalId) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `expenses-festival-${festivalId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Festival expenses PDF downloaded successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to download PDF");
    },
  });
};
