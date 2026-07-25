import { create } from "zustand";
import type { Festival, Contributor, Contribution, Expense } from "@/lib/data/mockData";
import {
  INITIAL_FESTIVALS,
  INITIAL_CONTRIBUTORS,
  INITIAL_CONTRIBUTIONS,
  INITIAL_EXPENSES,
} from "@/lib/data/mockData";

interface FestivalState {
  activeFestivalId: string | "ALL";
  festivals: Festival[];
  contributors: Contributor[];
  contributions: Contribution[];
  expenses: Expense[];

  // Actions
  setActiveFestival: (id: string | "ALL") => void;
  addFestival: (festival: Omit<Festival, "id" | "stats" | "contributorsCount">) => void;
  updateFestival: (id: string, updates: Partial<Festival>) => void;
  addContributor: (contributor: Omit<Contributor, "id" | "contributorCode" | "totalContributed">) => void;
  addContribution: (contribution: Omit<Contribution, "id" | "contributionCode" | "receiptNo" | "date">) => void;
  addExpense: (expense: Omit<Expense, "id" | "expenseCode" | "voucherNo" | "date">) => void;
}

export const useFestivalStore = create<FestivalState>((set, get) => ({
  activeFestivalId: "fest-1",
  festivals: INITIAL_FESTIVALS,
  contributors: INITIAL_CONTRIBUTORS,
  contributions: INITIAL_CONTRIBUTIONS,
  expenses: INITIAL_EXPENSES,

  setActiveFestival: (id) => set({ activeFestivalId: id }),

  addFestival: (newFestData) => {
    const newId = `fest-${Date.now()}`;
    const newFestival: Festival = {
      ...newFestData,
      id: newId,
      stats: {
        openingBalance: 0,
        totalCollected: 0,
        pendingAmount: 0,
        totalExpenses: 0,
        currentBalance: 0,
      },
      contributorsCount: 0,
    };
    set((state) => ({
      festivals: [newFestival, ...state.festivals],
      activeFestivalId: newId,
    }));
  },

  updateFestival: (id, updates) => {
    set((state) => ({
      festivals: state.festivals.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    }));
  },

  addContributor: (cData) => {
    const count = get().contributors.length + 1;
    const newContributor: Contributor = {
      ...cData,
      id: `c-${Date.now()}`,
      contributorCode: `CTR-${String(count).padStart(3, "0")}`,
      totalContributed: 0,
    };
    set((state) => ({
      contributors: [newContributor, ...state.contributors],
    }));
  },

  addContribution: (cntData) => {
    const count = get().contributions.length + 1;
    const newId = `cnt-${Date.now()}`;
    const contributionCode = `CON-${String(count).padStart(3, "0")}`;
    const receiptNo = `REC-2025-${String(count).padStart(3, "0")}`;
    const date = new Date().toISOString().split("T")[0];

    const newCnt: Contribution = {
      ...cntData,
      id: newId,
      contributionCode,
      receiptNo,
      date,
    };

    set((state) => {
      // Update festival stats
      const updatedFestivals = state.festivals.map((f) => {
        if (f.id === cntData.festivalId) {
          const newCollected = f.stats.totalCollected + (cntData.status === "DEPOSITED" ? cntData.amount : 0);
          const newPending = f.stats.pendingAmount + (cntData.status === "PENDING" ? cntData.amount : 0);
          const newCurrentBalance = f.stats.openingBalance + newCollected - f.stats.totalExpenses;
          return {
            ...f,
            stats: {
              ...f.stats,
              totalCollected: newCollected,
              pendingAmount: newPending,
              currentBalance: newCurrentBalance,
            },
            contributorsCount: f.contributorsCount + 1,
          };
        }
        return f;
      });

      return {
        contributions: [newCnt, ...state.contributions],
        festivals: updatedFestivals,
      };
    });
  },

  addExpense: (expData) => {
    const count = get().expenses.length + 1;
    const newId = `exp-${Date.now()}`;
    const expenseCode = `EXP-${String(count).padStart(3, "0")}`;
    const voucherNo = `VOU-2025-${String(count).padStart(3, "0")}`;
    const date = new Date().toISOString().split("T")[0];

    const newExp: Expense = {
      ...expData,
      id: newId,
      expenseCode,
      voucherNo,
      date,
    };

    set((state) => {
      const updatedFestivals = state.festivals.map((f) => {
        if (f.id === expData.festivalId) {
          const newExpenses = f.stats.totalExpenses + expData.amount;
          const newCurrentBalance = f.stats.openingBalance + f.stats.totalCollected - newExpenses;
          return {
            ...f,
            stats: {
              ...f.stats,
              totalExpenses: newExpenses,
              currentBalance: newCurrentBalance,
            },
          };
        }
        return f;
      });

      return {
        expenses: [newExp, ...state.expenses],
        festivals: updatedFestivals,
      };
    });
  },
}));
