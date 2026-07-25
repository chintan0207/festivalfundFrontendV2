/* eslint-disable @typescript-eslint/no-explicit-any */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import { setNavigator } from "./lib/navigation";
import "./theme/tokens.css";
import "./theme/modules.css";

setNavigator((opts) => {
  router.navigate({ to: opts.to as any, replace: opts.replace });
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
