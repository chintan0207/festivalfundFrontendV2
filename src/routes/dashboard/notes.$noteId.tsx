import { createFileRoute } from "@tanstack/react-router";
import NoteDetailPage from "@/pages/notes/NoteDetailPage";

export const Route = createFileRoute("/dashboard/notes/$noteId")({
  component: NoteDetailPage,
});
