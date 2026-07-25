import type {
  AuthResponse,
  SignupPayload,
  LoginPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  User,
} from "@/types/Types";
import ApiClient from "../apiClient";

type ApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
};

type ApiMessageResponse = {
  statusCode: number;
  success: boolean;
  message: string;
};

export const AuthService = {
  login: async (payload: LoginPayload) => {
    const response = await ApiClient.post<ApiResponse<AuthResponse>>("/auth/login", payload);
    return response.data;
  },

  signup: async (payload: SignupPayload) => {
    const response = await ApiClient.post<ApiResponse<AuthResponse>>(
      "/organizations",
      payload,
    );
    return response.data;
  },

  getMe: async () => {
    const response = await ApiClient.get<ApiResponse<User>>("/auth/me");
    return response.data;
  },

  forgotPassword: async (payload: ForgotPasswordPayload) => {
    const response = await ApiClient.post<ApiMessageResponse>("/auth/forgot-password", payload);
    return response.data;
  },

  resetPassword: async (payload: ResetPasswordPayload) => {
    const response = await ApiClient.post<ApiMessageResponse>("/auth/reset-password", {
      token: payload.token,
      newPassword: payload.password,
      password: payload.password,
    });
    return response.data;
  },

  logout: async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await ApiClient.post<ApiMessageResponse>("/auth/logout", { refreshToken });
    return response.data;
  },
};
