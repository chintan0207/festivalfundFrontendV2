import type {
  Festival,
  FestivalFacets,
  FestivalStatusCounts,
} from "@/types/Types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type FestivalState = {
  activeFestivalId: string | null;
  activeFestival: Festival | null;
  festivals: Festival[];
  isAllFestivals: boolean;
  page: number;
  limit: number;
  search: string;
  sortField: string;
  sortOrder: "asc" | "desc";
  status: string;
  category: string;
  year: string;
  location: string;
  total: number;
  totalPages: number;
  statusCounts: FestivalStatusCounts;
  facets: FestivalFacets;
  setActiveFestivalId: (id: string | null) => void;
  setActiveFestivalAll: () => void;
  setActiveFestival: (festival: Festival | null) => void;
  setFestivals: (festivals: Festival[]) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearch: (search: string) => void;
  setSortField: (sortField: string) => void;
  setSortOrder: (sortOrder: "asc" | "desc") => void;
  setStatus: (status: string) => void;
  setCategory: (category: string) => void;
  setYear: (year: string) => void;
  setLocation: (location: string) => void;
  setPaginationMeta: (meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }) => void;
  setStatusCounts: (statusCounts: FestivalStatusCounts) => void;
  setFacets: (facets: FestivalFacets) => void;
  resetFilters: () => void;
  clearFestivalState: () => void;
};

const DEFAULT_STATUS_COUNTS: FestivalStatusCounts = {
  total: 0,
  UPCOMING: 0,
  ACTIVE: 0,
  COMPLETED: 0,
  ARCHIVED: 0,
};

const DEFAULT_FACETS: FestivalFacets = {
  years: [],
  locations: [],
};

export const useFestivalApiStore = create<FestivalState>()(
  persist(
    (set, get) => ({
      activeFestivalId: null,
      activeFestival: null,
      festivals: [],
      isAllFestivals: false,
      page: 1,
      limit: 10,
      search: "",
      sortField: "name",
      sortOrder: "asc",
      status: "ACTIVE",
      category: "",
      year: "",
      location: "",
      total: 0,
      totalPages: 0,
      statusCounts: DEFAULT_STATUS_COUNTS,
      facets: DEFAULT_FACETS,

      setActiveFestivalId: (id) => {
        const found = get().festivals.find((f) => f._id === id) || null;
        set({ activeFestivalId: id, activeFestival: found, isAllFestivals: false });
      },

      setActiveFestivalAll: () => {
        set({ activeFestivalId: null, activeFestival: null, isAllFestivals: true });
      },

      setActiveFestival: (festival) => {
        set({
          activeFestival: festival,
          activeFestivalId: festival ? festival._id : null,
          isAllFestivals: false,
        });
      },

      setFestivals: (festivals) => {
        if (get().isAllFestivals) {
          set({ festivals, activeFestival: null, activeFestivalId: null });
          return;
        }
        const currentActiveId = get().activeFestivalId;
        const currentActive =
          festivals.find((f) => f._id === currentActiveId) || festivals[0] || null;
        set({
          festivals,
          activeFestival: currentActive,
          activeFestivalId: currentActive ? currentActive._id : null,
          isAllFestivals: false,
        });
      },

      setPage: (page) => set({ page }),

      setLimit: (limit) => set({ limit, page: 1 }),

      setSearch: (search) => set({ search, page: 1 }),

      setSortField: (sortField) => set({ sortField, page: 1 }),

      setSortOrder: (sortOrder) => set({ sortOrder, page: 1 }),

      setStatus: (status) => set({ status, page: 1 }),

      setCategory: (category) => set({ category, page: 1 }),

      setYear: (year) => set({ year, page: 1 }),

      setLocation: (location) => set({ location, page: 1 }),

      setPaginationMeta: ({ total, page, limit, totalPages }) =>
        set({ total, page, limit, totalPages }),

      setStatusCounts: (statusCounts) => set({ statusCounts }),

      setFacets: (facets) => set({ facets }),

      resetFilters: () =>
        set({
          search: "",
          sortField: "name",
          sortOrder: "asc",
          status: "ACTIVE",
          category: "",
          year: "",
          location: "",
          page: 1,
          limit: 10,
        }),

      clearFestivalState: () => {
        set({
          activeFestivalId: null,
          activeFestival: null,
          festivals: [],
          isAllFestivals: false,
          page: 1,
          limit: 10,
          search: "",
          sortField: "name",
          sortOrder: "asc",
          status: "ACTIVE",
          category: "",
          year: "",
          location: "",
          total: 0,
          totalPages: 0,
          statusCounts: DEFAULT_STATUS_COUNTS,
          facets: DEFAULT_FACETS,
        });
      },
    }),
    {
      name: "festival-storage",
      partialize: (state) => ({
        activeFestivalId: state.activeFestivalId,
        isAllFestivals: state.isAllFestivals,
      }),
    },
  ),
);