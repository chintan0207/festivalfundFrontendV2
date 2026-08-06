import type { Festival } from "@/types/Types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type FestivalState = {
  activeFestivalId: string | null;
  activeFestival: Festival | null;
  festivals: Festival[];
  isAllFestivals: boolean;
  setActiveFestivalId: (id: string | null) => void;
  setActiveFestivalAll: () => void;
  setActiveFestival: (festival: Festival | null) => void;
  setFestivals: (festivals: Festival[]) => void;
  clearFestivalState: () => void;
};

export const useFestivalApiStore = create<FestivalState>()(
  persist(
    (set, get) => ({
      activeFestivalId: null,
      activeFestival: null,
      festivals: [],
      isAllFestivals: false,

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

      clearFestivalState: () => {
        set({
          activeFestivalId: null,
          activeFestival: null,
          festivals: [],
          isAllFestivals: false,
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