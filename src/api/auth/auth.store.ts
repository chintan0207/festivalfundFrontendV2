/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Organization, SignupPayload, User } from "@/types/Types";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthService } from "./auth.service";

type AuthState = {
  user: User | null;
  organization: Organization | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: SignupPayload) => Promise<boolean>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      organization: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      login: async (email, password) => {
        try {
          set({ isLoading: true });
          const res = await AuthService.login(email, password);
          const { accessToken, refreshToken, loggedInUser } = res.data;
          set({
            user: loggedInUser,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });

          toast.success(res.message || "Login successful");
          return true;
        } catch (error: any) {
          set({ isLoading: false });
          toast.error(error?.response?.data?.message || "Login failed");
          return false;
        }
      },

      signup: async (data) => {
        try {
          set({ isLoading: true });
          const res = await AuthService.signup(data);
          const { accessToken, refreshToken, loggedInUser, organization } = res.data;
          set({
            user: loggedInUser,
            organization,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
          toast.success(res.message || "Organization created successfully");
          return true;
        } catch (error: any) {
          set({ isLoading: false });
          toast.error(error?.response?.data?.message || "Signup failed");
          return false;
        }
      },

      logout: () => {
        set({
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
