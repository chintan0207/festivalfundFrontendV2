import { createFileRoute } from "@tanstack/react-router";
import ProfilePage from "@/pages/profile/profile";

export const Route = createFileRoute("/dashboard/profile")({
  component: ProfilePage,
});
