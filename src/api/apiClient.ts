import axios from "axios";
import { API_BASE_URL, REFRESH_TOKEN_URL } from "./env";

const ApiClient = axios.create({
  baseURL: API_BASE_URL || "http://localhost:5000/api",
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

ApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 423 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // refresh token API
        const response = await axios.post(
          `${REFRESH_TOKEN_URL}`,
          { refreshToken: localStorage.getItem("refreshToken") },
          {
            withCredentials: true,
          },
        );

        const { accessToken, refreshToken } = response.data.data;

        // store latest tokens
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // update authorization header
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // retry failed request
        return ApiClient(originalRequest);
      } catch (refreshError) {
        // logout if refresh fails
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default ApiClient;
