import type { Festival } from "@/types/Types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type FestivalState = {
  activeFestivalId: string | null;
  activeFestival: Festival | null;
  festivals: Festival[];
  setActiveFestivalId: (id: string | null) => void;
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

      setActiveFestivalId: (id) => {
        const found = get().festivals.find((f) => f._id === id) || null;
        set({ activeFestivalId: id, activeFestival: found });
      },

      setActiveFestival: (festival) => {
        set({
          activeFestival: festival,
          activeFestivalId: festival ? festival._id : null,
        });
      },

      setFestivals: (festivals) => {
        const currentActiveId = get().activeFestivalId;
        const currentActive =
          festivals.find((f) => f._id === currentActiveId) || festivals[0] || null;
        set({
          festivals,
          activeFestival: currentActive,
          activeFestivalId: currentActive ? currentActive._id : null,
        });
      },

      clearFestivalState: () => {
        set({ activeFestivalId: null, activeFestival: null, festivals: [] });
      },
    }),
    {
      name: "festival-storage",
      partialize: (state) => ({
        activeFestivalId: state.activeFestivalId,
      }),
    },
  ),
);
