import type { AuthResponse, SignupPayload } from "@/types/Types";
import ApiClient from "../apiClient";

type ApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
};

export const AuthService = {
  login: async (email: string, password: string) => {
    const response = await ApiClient.post<ApiResponse<AuthResponse>>("/auth/login", {
      email,
      password,
    });

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
    const response = await ApiClient.get<ApiResponse<AuthResponse>>("/auth/me");
    return response.data;
  },
};
