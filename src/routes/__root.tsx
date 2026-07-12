import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ThemeProvider } from "@/theme/theme-provider";
import { Providers } from "@/api/providers";
import type { QueryClient } from "@tanstack/react-query";
import { lazy } from "react";

interface RouterContext {
  queryClient: QueryClient;
}

const AppPageNotFound = lazy(() => import("@/pages/404/404"));

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  notFoundComponent: () => <AppPageNotFound />,
});

function RootLayout() {
  return (
    <ThemeProvider>
      <Providers>
        <Outlet />
        <TanStackRouterDevtools />
      </Providers>
    </ThemeProvider>
  );
}
