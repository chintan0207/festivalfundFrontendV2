import { Toaster as SonnerToaster } from "sonner";
import { useTheme } from "@/theme/theme-provider";

export function AppToaster() {
  const { theme } = useTheme();

  return (
    <SonnerToaster
      theme={theme as "light" | "dark"}
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        className: "font-sans rounded-xl text-xs shadow-lg",
      }}
    />
  );
}
