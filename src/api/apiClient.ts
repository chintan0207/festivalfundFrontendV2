/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { API_BASE_URL, REFRESH_TOKEN_URL } from "./env";
import { useAuthStore } from "./auth/auth.store";
import { navigateTo } from "@/lib/navigation";
import { toast } from "sonner";

const ApiClient = axios.create({
  baseURL: API_BASE_URL || "http://localhost:8081/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

ApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

ApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const isUnauthorized = status === 401 || status === 423;

    const requestUrl = originalRequest.url || "";
    const isAuthEndpoint =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/refresh-accesstoken") ||
      requestUrl.includes("/auth/logout");

    if (isUnauthorized && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return ApiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const storedRefreshToken = localStorage.getItem("refreshToken");

      if (!storedRefreshToken) {
        isRefreshing = false;
        useAuthStore.getState().clearAuth();
        navigateTo("/login");
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          REFRESH_TOKEN_URL,
          { refreshToken: storedRefreshToken },
          { withCredentials: true },
        );

        const { accessToken, refreshToken } = response.data.data;

        localStorage.setItem("token", accessToken);
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }

        const store = useAuthStore.getState();
        if (store.user) {
          store.setAuth({
            user: store.user,
            organization: store.organization || undefined,
            accessToken,
            refreshToken: refreshToken || store.refreshToken || undefined,
          });
        }

        ApiClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        return ApiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().clearAuth();
        toast.error("Session expired. Please log in again.");
        navigateTo("/login");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default ApiClient;
