import { createFileRoute } from "@tanstack/react-router";
import CookiePolicy from "@/pages/cookie-policy/cookie-policy";

export const Route = createFileRoute("/_marketing/cookie-policy")({
  component: CookiePolicy,
});
