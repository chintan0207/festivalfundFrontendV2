const ENV = import.meta.env.VITE_APP_ENV || "development";

const API_BASE_URL =
  ENV === "production"
    ? import.meta.env.VITE_API_LIVE_URL
    : import.meta.env.VITE_API_LOCAL_URL;

const REFRESH_TOKEN_URL =
  ENV === "production"
    ? import.meta.env.VITE_API_LIVE_REFRESH_URL
    : import.meta.env.VITE_API_LOCAL_REFRESH_URL;

export { API_BASE_URL, REFRESH_TOKEN_URL };    
