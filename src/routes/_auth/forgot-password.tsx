import { createFileRoute } from "@tanstack/react-router";
import ForgotPassword from "@/pages/forgot-password/forgot-password";

export const Route = createFileRoute("/_auth/forgot-password")({
  component: ForgotPassword,
});