import { createFileRoute } from "@tanstack/react-router";
import Contact from "@/pages/contact/contact";

export const Route = createFileRoute("/_marketing/contact")({
  component: Contact,
});
