/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../auth/auth.store";
import { AuthService } from "../auth/auth.service";
import { toast } from "sonner";
import type { SignupPayload } from "@/types/Types";

export const useLogin = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      AuthService.login(email, password),
    onSuccess: (res) => {
      const data = res.data;
      if (!data) {
        toast.error("Invalid response from server");
        return;
      }
      const { accessToken, refreshToken, loggedInUser } = data;
      setAuth({ user: loggedInUser, accessToken, refreshToken });
      toast.success(res.message || "Login successful");
      navigate("/dashboard", { replace: true });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Login failed");
    },
  });
};

export const useSignup = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: SignupPayload) => AuthService.signup(data),
    onSuccess: (res) => {
      const data = res.data;
      if (!data) {
        toast.error("Invalid response from server");
        return;
      }
      console.log("Signup response data:", data);
      const { accessToken, refreshToken, loggedInUser, organization } = data;
      setAuth({ user: loggedInUser, organization, accessToken, refreshToken });
      toast.success(res.message || "Organization created successfully");
      navigate("/dashboard", { replace: true });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Signup failed");
    },
  });
};

export const useCurrentUser = () => {
  const accessToken = useAuthStore((s) => s.accessToken);
  const setAuth = useAuthStore((s) => s.setAuth);

  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const res = await AuthService.getMe();
      setAuth({
        user: res.data,
      });
      return res.data;
    },
    enabled: !!accessToken,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};

export const useLogout = () => {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const queryClient = useQueryClient();

  return () => {
    clearAuth();
    queryClient.clear();
  };
};
