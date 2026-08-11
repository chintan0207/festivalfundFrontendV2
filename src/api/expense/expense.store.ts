import type {
  ExpenseCategoryTotals,
  ExpenseListItem,
  ExpenseStatusAmounts,
  ExpenseStatusCounts,
} from "@/types/Types";
import { create } from "zustand";

type ExpenseState = {
  expenses: ExpenseListItem[];
  selectedExpense: ExpenseListItem | null;

  page: number;
  limit: number;
  search: string;
  sortField: string;
  sortOrder: "asc" | "desc";
  category: string;
  status: string;
  festivalId: string;
  dateRange: string;
  total: number;
  totalPages: number;
  statusCounts: ExpenseStatusCounts;
  statusAmounts: ExpenseStatusAmounts;
  categoryTotals: ExpenseCategoryTotals;

  setExpenses: (expenses: ExpenseListItem[]) => void;
  setSelectedExpense: (expense: ExpenseListItem | null) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearch: (search: string) => void;
  setSortField: (field: string) => void;
  setSortOrder: (order: "asc" | "desc") => void;
  setCategory: (category: string) => void;
  setStatus: (status: string) => void;
  setFestivalId: (festivalId: string) => void;
  setDateRange: (dateRange: string) => void;
  setPaginationMeta: (data: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }) => void;
  setStatusCounts: (statusCounts: ExpenseStatusCounts) => void;
  setStatusAmounts: (statusAmounts: ExpenseStatusAmounts) => void;
  setCategoryTotals: (categoryTotals: ExpenseCategoryTotals) => void;
  resetFilters: () => void;
  clearExpenseState: () => void;
};

const initialFilters = {
  page: 1,
  limit: 10,
  search: "",
  sortField: "createdAt",
  sortOrder: "desc" as const,
  category: "",
  status: "",
  festivalId: "",
  dateRange: "",
  total: 0,
  totalPages: 0,
  statusCounts: { total: 0, PENDING: 0, PAID: 0, CANCELLED: 0 } as ExpenseStatusCounts,
  statusAmounts: { total: 0, PENDING: 0, PAID: 0, CANCELLED: 0 } as ExpenseStatusAmounts,
  categoryTotals: {} as ExpenseCategoryTotals,
};

export const useExpenseApiStore = create<ExpenseState>((set) => ({
  expenses: [],
  selectedExpense: null,
  ...initialFilters,

  setExpenses: (expenses) => set({ expenses }),
  setSelectedExpense: (selectedExpense) => set({ selectedExpense }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),
  setSearch: (search) => set({ search, page: 1 }),
  setSortField: (sortField) => set({ sortField, page: 1 }),
  setSortOrder: (sortOrder) => set({ sortOrder, page: 1 }),
  setCategory: (category) => set({ category, page: 1 }),
  setStatus: (status) => set({ status, page: 1 }),
  setFestivalId: (festivalId) => set({ festivalId, page: 1 }),
  setDateRange: (dateRange) => set({ dateRange, page: 1 }),
  setPaginationMeta: ({ total, page, limit, totalPages }) =>
    set({ total, page, limit, totalPages }),
  setStatusCounts: (statusCounts) => set({ statusCounts }),
  setStatusAmounts: (statusAmounts) => set({ statusAmounts }),
  setCategoryTotals: (categoryTotals) => set({ categoryTotals }),
  resetFilters: () =>
    set((state) => ({
      ...initialFilters,
      total: state.total,
      totalPages: state.totalPages,
      statusCounts: state.statusCounts,
      statusAmounts: state.statusAmounts,
      categoryTotals: state.categoryTotals,
    })),
  clearExpenseState: () =>
    set({ expenses: [], selectedExpense: null, ...initialFilters }),
}));
