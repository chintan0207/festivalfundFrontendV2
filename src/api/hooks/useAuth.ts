/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "../auth/auth.store";
import { AuthService } from "../auth/auth.service";
import { toast } from "sonner";
import type {
  SignupPayload,
  LoginPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from "@/types/Types";

export const useLogin = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginPayload) => AuthService.login(data),
    onSuccess: (res) => {
      const data = res.data;
      if (!data) {
        toast.error("Invalid response from server");
        return;
      }
      const { accessToken, refreshToken, loggedInUser } = data;
      setAuth({ user: loggedInUser, accessToken, refreshToken });
      toast.success(res.message || "Login successful");
      navigate({ to: "/dashboard", replace: true });
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
      navigate({ to: "/dashboard", replace: true });
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

export const useForgotPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: ForgotPasswordPayload) => AuthService.forgotPassword(data),
    onSuccess: (res) => {
      toast.success(res.message || "Password reset link sent to your email");
      navigate({ to: "/login", replace: true });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to send reset link");
    },
  });
};

export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: ResetPasswordPayload) => AuthService.resetPassword(data),
    onSuccess: (res) => {
      toast.success(res.message || "Password reset successful. Please login.");
      navigate({ to: "/login", replace: true });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to reset password");
    },
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
