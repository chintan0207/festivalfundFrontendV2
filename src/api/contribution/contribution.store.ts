import type { Contribution } from "@/types/Types";
import { create } from "zustand";

type ContributionState = {
  contributions: Contribution[];
  selectedContribution: Contribution | null;
  setContributions: (contributions: Contribution[]) => void;
  setSelectedContribution: (contribution: Contribution | null) => void;
  clearContributionState: () => void;
};

export const useContributionApiStore = create<ContributionState>((set) => ({
  contributions: [],
  selectedContribution: null,

  setContributions: (contributions) => set({ contributions }),
  setSelectedContribution: (selectedContribution) => set({ selectedContribution }),
  clearContributionState: () => set({ contributions: [], selectedContribution: null }),
}));
