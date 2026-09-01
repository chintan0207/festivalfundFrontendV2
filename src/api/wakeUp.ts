import ApiClient from "./apiClient";

let wakeUpPromise: Promise<boolean> | null = null;

/**
 * Initiates a lightweight, non-blocking startup wake-up request to the backend.
 * Uses a single-flight Promise pattern so it executes ONCE per page load,
 * protecting against React StrictMode double invocations, route changes, or re-renders.
 */
export const wakeUpBackend = (): Promise<boolean> => {
  const isEnabled = import.meta.env.VITE_ENABLE_BACKEND_WAKEUP !== "false";
  if (!isEnabled) {
    return Promise.resolve(true);
  }

  if (!wakeUpPromise) {
    wakeUpPromise = (async () => {
      const maxAttempts = 2; // 1 initial attempt + 1 bounded retry
      let attempts = 0;

      while (attempts < maxAttempts) {
        try {
          attempts++;
          const response = await ApiClient.get("/health", {
            timeout: 15000, // 15s timeout for Render cold-starts
          });

          if (response.status === 200 && response.data?.status === "ok") {
            return true;
          }
        } catch (error) {
          if (import.meta.env.DEV) {
            console.debug(`[Backend WakeUp] Attempt ${attempts} failed:`, error);
          }
          if (attempts >= maxAttempts) break;
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
      return false;
    })();
  }

  return wakeUpPromise;
};
