import type { Contributor } from "@/types/Types";
import { create } from "zustand";

type ContributorState = {
  contributors: Contributor[];
  selectedContributor: Contributor | null;
  setContributors: (contributors: Contributor[]) => void;
  setSelectedContributor: (contributor: Contributor | null) => void;
  clearContributorState: () => void;
};

export const useContributorApiStore = create<ContributorState>((set) => ({
  contributors: [],
  selectedContributor: null,

  setContributors: (contributors) => set({ contributors }),
  setSelectedContributor: (selectedContributor) => set({ selectedContributor }),
  clearContributorState: () => set({ contributors: [], selectedContributor: null }),
}));
