import type { Organization, User } from "@/types/Types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  user: User | null;
  organization: Organization | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (data: {
    user: User;
    organization?: Organization;
    accessToken?: string;
    refreshToken?: string;
  }) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      organization: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: ({ user, organization, accessToken, refreshToken }) => {
        const token = accessToken ?? localStorage.getItem("token");
        const rToken = refreshToken ?? localStorage.getItem("refreshToken");
        if (token) localStorage.setItem("token", token);
        if (rToken) localStorage.setItem("refreshToken", rToken);

        return set({
          user,
          organization: organization ?? null,
          accessToken: token,
          refreshToken: rToken,
          isAuthenticated: true,
        });
      },

      clearAuth: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");

        return set({
          user: null,
          organization: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        organization: state.organization,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
