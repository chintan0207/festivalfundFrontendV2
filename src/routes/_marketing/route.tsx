import { createFileRoute } from "@tanstack/react-router";
import HomeLayout from "@/layouts/home/HomeLayout";

export const Route = createFileRoute("/_marketing")({
  component: HomeLayout,
});
