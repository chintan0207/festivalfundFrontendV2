import { createFileRoute } from "@tanstack/react-router";
import TasksNotesPage from "@/pages/tasks-notes/TasksNotesPage";

export const Route = createFileRoute("/dashboard/tasks-notes/")({
  component: TasksNotesPage,
});
