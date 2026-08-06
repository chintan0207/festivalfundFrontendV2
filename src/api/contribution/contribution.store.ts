import type { ContributionListItem } from "@/types/Types";
import { create } from "zustand";

type ContributionState = {
  contributions: ContributionListItem[];
  selectedContribution: ContributionListItem | null;

  page: number;
  limit: number;
  search: string;
  sortField: string;
  sortOrder: "asc" | "desc";
  status: string;
  category: string;
  type: string;
  festivalId: string;
  total: number;
  totalPages: number;
  statusCounts: {
    total: number;
    DEPOSITED: number;
    PENDING: number;
    CANCELLED: number;
  };

  setContributions: (contributions: ContributionListItem[]) => void;
  setSelectedContribution: (contribution: ContributionListItem | null) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearch: (search: string) => void;
  setSortField: (field: string) => void;
  setSortOrder: (order: "asc" | "desc") => void;
  setStatus: (status: string) => void;
  setCategory: (category: string) => void;
  setType: (type: string) => void;
  setFestivalId: (festivalId: string) => void;
  setPaginationMeta: (data: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }) => void;
  setStatusCounts: (statusCounts: {
    total: number;
    DEPOSITED: number;
    PENDING: number;
    CANCELLED: number;
  }) => void;
  resetFilters: () => void;
  clearContributionState: () => void;
};

const initialFilters = {
  page: 1,
  limit: 10,
  search: "",
  sortField: "createdAt",
  sortOrder: "desc" as const,
  status: "",
  category: "",
  type: "",
  festivalId: "",
  total: 0,
  totalPages: 0,
  statusCounts: { total: 0, DEPOSITED: 0, PENDING: 0, CANCELLED: 0 },
};

export const useContributionApiStore = create<ContributionState>((set) => ({
  contributions: [],
  selectedContribution: null,
  ...initialFilters,

  setContributions: (contributions) => set({ contributions }),
  setSelectedContribution: (selectedContribution) => set({ selectedContribution }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),
  setSearch: (search) => set({ search, page: 1 }),
  setSortField: (sortField) => set({ sortField, page: 1 }),
  setSortOrder: (sortOrder) => set({ sortOrder, page: 1 }),
  setStatus: (status) => set({ status, page: 1 }),
  setCategory: (category) => set({ category, page: 1 }),
  setType: (type) => set({ type, page: 1 }),
  setFestivalId: (festivalId) => set({ festivalId, page: 1 }),
  setPaginationMeta: ({ total, page, limit, totalPages }) =>
    set({ total, page, limit, totalPages }),
  setStatusCounts: (statusCounts) => set({ statusCounts }),
  resetFilters: () =>
    set((state) => ({
      ...initialFilters,
      total: state.total,
      totalPages: state.totalPages,
      statusCounts: state.statusCounts,
    })),
  clearContributionState: () =>
    set({ contributions: [], selectedContribution: null, ...initialFilters }),
}));
