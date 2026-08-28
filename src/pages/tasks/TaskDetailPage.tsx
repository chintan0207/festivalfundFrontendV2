import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, Link } from "@tanstack/react-router";
import { DashboardService, type DashboardTask } from "@/api/dashboard/dashboard.service";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Pencil,
  Trash2,
  User as UserIcon,
  Calendar,
  Clock,
} from "lucide-react";
import { useFestivalApiStore } from "@/api/festival/festival.store";
import { useFestivals } from "@/api/festival/useFestivals";
import { AppButton } from "@/components/common/AppButton";
import { AppInput } from "@/components/common/AppInput";
import { AppTextArea } from "@/components/common/AppTextArea";
import { ResponsiveFormDrawer } from "@/components/common/ResponsiveFormDrawer";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { formatDate, cn } from "@/lib/utils";
import { getModuleTheme } from "@/theme/colors";
import { toast } from "sonner";

interface AuthorItem {
  _id?: string;
  name?: string;
  email?: string;
}

export default function TaskDetailPage() {
  const theme = getModuleTheme("tasks-notes");
  const params = useParams({ strict: false }) as { taskId?: string };
  const taskId = params.taskId || "";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { activeFestivalId } = useFestivalApiStore();
  const { data: festivalsData, isLoading: isFestivalsLoading } = useFestivals();
  const festivals = (festivalsData?.festivals ?? []).filter((f) => !f.isDeleted);
  const resolvedFestivalId =
    activeFestivalId && festivals.some((f) => f._id === activeFestivalId)
      ? activeFestivalId
      : festivals[0]?._id || "ALL";

  // Fetch Task Detail
  const {
    data: task,
    isLoading: isTaskLoading,
    isError,
    refetch,
  } = useQuery<DashboardTask>({
    queryKey: ["dashboard", "task", resolvedFestivalId, taskId],
    queryFn: () => DashboardService.getTaskById(resolvedFestivalId, taskId).then((r) => r.data),
    enabled: !!taskId,
  });

  // Edit Form State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState("");

  // Delete Dialog State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const invalidateTask = () => {
    queryClient.invalidateQueries({ queryKey: ["dashboard", "task", resolvedFestivalId, taskId] });
    queryClient.invalidateQueries({ queryKey: ["dashboard", "tasks", resolvedFestivalId] });
    queryClient.invalidateQueries({ queryKey: ["dashboard", resolvedFestivalId] });
  };

  const openEditModal = () => {
    if (!task) return;
    setEditTitle(task.title || "");
    setEditDescription(task.description || "");
    setEditDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "");
    setIsEditOpen(true);
  };

  const handleToggleComplete = async () => {
    if (!task || !resolvedFestivalId) return;
    try {
      await DashboardService.toggleTask(resolvedFestivalId, task._id);
      const isDone = task.isCompleted || task.status === "COMPLETED";
      toast.success(isDone ? "To-do reopened" : "To-do completed");
      invalidateTask();
    } catch {
      toast.error("Failed to update to-do status");
    }
  };

  const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!task || !editTitle.trim() || !resolvedFestivalId) return;

    try {
      setIsSubmitting(true);
      await DashboardService.updateTask(resolvedFestivalId, task._id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        dueDate: editDueDate ? new Date(editDueDate).toISOString() : undefined,
      });

      toast.success("To-do updated successfully");
      setIsEditOpen(false);
      invalidateTask();
    } catch {
      toast.error("Failed to save to-do");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!task || !resolvedFestivalId) return;
    try {
      setIsDeleting(true);
      await DashboardService.deleteTask(resolvedFestivalId, task._id);
      toast.success("To-do deleted");
      navigate({ to: "/dashboard/tasks-notes" });
    } catch {
      toast.error("Failed to delete to-do");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isTaskLoading || isFestivalsLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4 p-3 sm:p-6 animate-pulse">
        <div className="h-6 w-32 bg-muted rounded-lg" />
        <div className="rounded-2xl border border-border/70 bg-card p-4 sm:p-6 space-y-4">
          <div className="h-7 w-3/4 bg-muted rounded-xl" />
          <div className="h-4 w-1/2 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center space-y-4">
        <p className="text-sm font-semibold text-rose-500">Failed to load to-do details</p>
        <div className="flex justify-center gap-3">
          <AppButton size="sm" variant="outline" onClick={() => refetch()}>
            Retry
          </AppButton>
          <Link
            to="/dashboard/tasks-notes"
            className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back to To-dos
          </Link>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center space-y-4">
        <p className="text-sm font-semibold text-foreground">To-do Not Found</p>
        <p className="text-xs text-muted-foreground">The to-do item you are looking for does not exist or has been removed.</p>
        <Link
          to="/dashboard/tasks-notes"
          className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to To-dos
        </Link>
      </div>
    );
  }

  const isDone = task.status === "COMPLETED" || task.isCompleted;
  const authorName =
    typeof task.createdBy === "object" ? (task.createdBy as AuthorItem)?.name : task.createdBy;

  return (
    <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6 p-3 sm:p-6 overflow-x-hidden pb-24 sm:pb-8">
      {/* Navigation */}
      <div>
        <Link
          to="/dashboard/tasks-notes"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to To-dos
        </Link>
      </div>

      {/* Main Detail Container */}
      <div className="rounded-2xl sm:rounded-3xl border border-border/70 bg-card p-4 sm:p-6 shadow-xs space-y-5">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border/60 pb-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* 1-click Checkbox */}
            <button
              type="button"
              onClick={handleToggleComplete}
              className="mt-1 text-foreground hover:scale-110 transition-transform cursor-pointer shrink-0 min-h-[40px] min-w-[40px] flex items-center justify-center -m-1"
              title={isDone ? "Mark Pending" : "Mark Complete"}
            >
              {isDone ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-500 fill-emerald-500/20" />
              ) : (
                <Circle className="h-6 w-6 text-muted-foreground hover:text-primary" />
              )}
            </button>

            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={cn(
                    "text-lg sm:text-xl font-bold text-foreground leading-snug",
                    isDone && "line-through text-muted-foreground",
                  )}
                >
                  {task.title}
                </span>
                <span
                  className={cn(
                    "text-[10px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 inline-flex items-center gap-1",
                    isDone
                      ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
                      : "bg-amber-500/15 text-amber-600 border-amber-500/20 dark:text-amber-400",
                  )}
                >
                  {isDone ? "Completed" : "Pending"}
                </span>
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap pt-1">
                {authorName && (
                  <span className="inline-flex items-center gap-1">
                    <UserIcon className="h-3.5 w-3.5" /> Created by {authorName}
                  </span>
                )}
                {task.updatedAt && (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> Updated {formatDate(task.updatedAt)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <AppButton
              size="sm"
              gradient={theme.gradient}
              onClick={openEditModal}
              leftIcon={<Pencil className="h-3.5 w-3.5" />}
            >
              Edit
            </AppButton>
            <AppButton
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteOpen(true)}
              className="text-rose-600 hover:bg-rose-500/10 border-rose-200 dark:border-rose-900"
              leftIcon={<Trash2 className="h-3.5 w-3.5" />}
            >
              Delete
            </AppButton>
          </div>
        </div>

        {/* Optional Description */}
        {task.description ? (
          <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {task.description}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">No additional details provided.</p>
        )}

        {/* Due Date Badge */}
        {task.dueDate && (
          <div className="pt-3 border-t border-border/60 flex items-center gap-2 text-xs font-medium">
            <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold", theme.badgeColor)}>
              <Calendar className={cn("h-3.5 w-3.5", theme.iconColor)} />
              Due Date: {formatDate(task.dueDate)}
            </span>
          </div>
        )}
      </div>

      {/* Edit Form Drawer */}
      <ResponsiveFormDrawer
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleSaveEdit}
        title="Edit To-do"
        titleIcon={
          <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs font-bold", theme.gradient)}>
            <Pencil className="h-4.5 w-4.5 text-white" />
          </div>
        }
        gradient={theme.gradient}
        submitLabel="Save Changes"
        loading={isSubmitting}
      >
        <div className="space-y-4">
          <AppInput
            label="Title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Enter task title..."
            required
          />

          <AppTextArea
            label="Details (Optional)"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Add details, instructions..."
            rows={3}
          />

          <AppInput
            type="date"
            label="Due Date (Optional)"
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
          />
        </div>
      </ResponsiveFormDrawer>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={isDeleteOpen}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete To-do"
        description="Are you sure you want to delete this to-do? This action cannot be undone."
        confirmLabel="Delete To-do"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}
