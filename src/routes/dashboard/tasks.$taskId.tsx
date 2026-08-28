import { createFileRoute } from "@tanstack/react-router";
import TaskDetailPage from "@/pages/tasks/TaskDetailPage";

export const Route = createFileRoute("/dashboard/tasks/$taskId")({
  component: TaskDetailPage,
});
