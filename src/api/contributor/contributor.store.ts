import type { Contributor } from "@/types/Types";
import { create } from "zustand";

type ContributorState = {
  contributors: Contributor[];
  selectedContributor: Contributor | null;

  page: number;
  limit: number;
  search: string;
  sortField: string;
  sortOrder: "asc" | "desc";
  category: string;
  isActive: string;
  total: number;
  totalPages: number;
  categoryCounts: {
    total: number;
    PARENT: number;
    BOY: number;
    GIRL: number;
  };

  setContributors: (contributors: Contributor[]) => void;
  setSelectedContributor: (contributor: Contributor | null) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearch: (search: string) => void;
  setSortField: (field: string) => void;
  setSortOrder: (order: "asc" | "desc") => void;
  setCategory: (category: string) => void;
  setIsActive: (isActive: string) => void;
  setTotal: (total: number) => void;
  setTotalPages: (totalPages: number) => void;
  setCategoryCounts: (categoryCounts: {
    total: number;
    PARENT: number;
    BOY: number;
    GIRL: number;
  }) => void;
  setPaginationMeta: (data: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }) => void;
  resetFilters: () => void;
  clearContributorState: () => void;
};

const initialFilters = {
  page: 1,
  limit: 10,
  search: "",
  sortField: "createdAt",
  sortOrder: "desc" as const,
  category: "",
  isActive: "true",
  total: 0,
  totalPages: 0,
  categoryCounts: { total: 0, PARENT: 0, BOY: 0, GIRL: 0 },
};

export const useContributorApiStore = create<ContributorState>((set) => ({
  contributors: [],
  selectedContributor: null,
  ...initialFilters,

  setContributors: (contributors) => set({ contributors }),
  setSelectedContributor: (selectedContributor) => set({ selectedContributor }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),
  setSearch: (search) => set({ search, page: 1 }),
  setSortField: (sortField) => set({ sortField, page: 1 }),
  setSortOrder: (sortOrder) => set({ sortOrder, page: 1 }),
  setCategory: (category) => set({ category, page: 1 }),
  setIsActive: (isActive) => set({ isActive, page: 1 }),
  setTotal: (total) => set({ total }),
  setTotalPages: (totalPages) => set({ totalPages }),
  setCategoryCounts: (categoryCounts) => set({ categoryCounts }),
  setPaginationMeta: ({ total, page, limit, totalPages }) =>
    set({ total, page, limit, totalPages }),
  resetFilters: () =>
    set((state) => ({
      ...initialFilters,
      total: state.total,
      totalPages: state.totalPages,
      categoryCounts: state.categoryCounts,
    })),
  clearContributorState: () =>
    set({ contributors: [], selectedContributor: null, ...initialFilters }),
}));
