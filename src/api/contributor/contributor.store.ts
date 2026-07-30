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
  setSortField: (sortField) => set({ sortField }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  setCategory: (category) => set({ category, page: 1 }),
  setIsActive: (isActive) => set({ isActive, page: 1 }),
  setTotal: (total) => set({ total }),
  setTotalPages: (totalPages) => set({ totalPages }),
  setPaginationMeta: ({ total, page, limit, totalPages }) =>
    set({ total, page, limit, totalPages }),
  resetFilters: () => set({ ...initialFilters }),
  clearContributorState: () =>
    set({ contributors: [], selectedContributor: null, ...initialFilters }),
}));
