import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { DashboardService, type DashboardTask, type DashboardData } from "@/api/dashboard/dashboard.service";
import { Plus, Pencil, Trash2, ArrowRight, LayoutGrid, List, CheckCircle2, Circle, Search, Calendar, X } from "lucide-react";
import { useFestivals } from "@/api/festival/useFestivals";
import { AppCard } from "@/components/common/AppCard";
import { AppInput } from "@/components/common/AppInput";
import { AppButton } from "@/components/common/AppButton";
import { AppTextArea } from "@/components/common/AppTextArea";
import { EmptyState } from "@/components/common/EmptyState";
import { ResponsiveFormDrawer } from "@/components/common/ResponsiveFormDrawer";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { RowActionsMenu, type RowAction } from "@/components/common/RowActionsMenu";
import { useFestivalApiStore } from "@/api/festival/festival.store";
import { formatDate, cn } from "@/lib/utils";
import { getModuleTheme } from "@/theme/colors";
import { toast } from "sonner";

export type { DashboardTask };

export interface MultiTodoItem {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
}

const useDashboardTasks = (festivalId: string) => {
  return useQuery({
    queryKey: ["dashboard", "tasks", festivalId],
    queryFn: () => DashboardService.getTasks(festivalId).then((r) => r.data),
    enabled: !!festivalId && festivalId !== "ALL",
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

interface DashboardTasksProps {
  data?: DashboardData;
  limit?: number;
  isWidget?: boolean;
  embedded?: boolean;
}

export const DashboardTasks = ({
  data: initialData,
  limit,
  isWidget = false,
  embedded = false,
}: DashboardTasksProps) => {
  const theme = getModuleTheme("tasks-notes");
  const queryClient = useQueryClient();
  const { activeFestivalId } = useFestivalApiStore();
  const { data: festivalsData } = useFestivals();
  const festivals = (festivalsData?.festivals ?? []).filter((f) => !f.isDeleted);
  const resolvedFestivalId =
    activeFestivalId && festivals.some((f) => f._id === activeFestivalId)
      ? activeFestivalId
      : festivals[0]?._id || "";

  const navigate = useNavigate();
  const { data: tasksData = initialData?.tasks || [], isLoading } = useDashboardTasks(resolvedFestivalId);

  const tasks: DashboardTask[] = useMemo(() => {
    const rawTasks =
      typeof tasksData === "object" && tasksData && "tasks" in tasksData
        ? (tasksData as { tasks: DashboardTask[] }).tasks
        : Array.isArray(tasksData)
          ? tasksData
          : [];
    return Array.isArray(rawTasks) ? rawTasks : [];
  }, [tasksData]);

  // UI States
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [tabFilter, setTabFilter] = useState<"all" | "pending" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Single Edit Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<DashboardTask | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Multi To-do Form State (for Create mode)
  const [todoItems, setTodoItems] = useState<MultiTodoItem[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newTodoDescription, setNewTodoDescription] = useState("");
  const [newTodoDueDate, setNewTodoDueDate] = useState("");
  const [showDetailsForm, setShowDetailsForm] = useState(false);

  // Delete State
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredTasks = useMemo(() => {
    let result = [...tasks].sort((a, b) => {
      const isDoneA = a.status === "COMPLETED" || a.isCompleted;
      const isDoneB = b.status === "COMPLETED" || b.isCompleted;
      if (isDoneA !== isDoneB) return isDoneA ? 1 : -1;
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    if (tabFilter === "pending") {
      result = result.filter((t) => t.status !== "COMPLETED" && !t.isCompleted);
    } else if (tabFilter === "completed") {
      result = result.filter((t) => t.status === "COMPLETED" || t.isCompleted);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q)),
      );
    }

    return result;
  }, [tasks, tabFilter, searchQuery]);

  const displayTasks = useMemo(() => {
    if (limit) return filteredTasks.slice(0, limit);
    const start = (page - 1) * pageSize;
    return filteredTasks.slice(start, start + pageSize);
  }, [filteredTasks, limit, page]);

  const totalPages = Math.ceil(filteredTasks.length / pageSize);

  const invalidateTasks = () => {
    queryClient.invalidateQueries({
      queryKey: ["dashboard", "tasks", resolvedFestivalId],
    });
    queryClient.invalidateQueries({
      queryKey: ["dashboard", resolvedFestivalId],
    });
  };

  const handleToggleComplete = async (task: DashboardTask) => {
    if (!resolvedFestivalId) return;
    try {
      await DashboardService.toggleTask(resolvedFestivalId, task._id);
      toast.success(task.isCompleted || task.status === "COMPLETED" ? "To-do reopened" : "To-do completed");
      invalidateTasks();
    } catch {
      toast.error("Failed to update to-do status");
    }
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setTitle("");
    setDescription("");
    setDueDate("");
    setTodoItems([]);
    setNewTodoTitle("");
    setNewTodoDescription("");
    setNewTodoDueDate("");
    setShowDetailsForm(false);
    setIsFormOpen(true);
  };

  const openEditModal = (task: DashboardTask) => {
    setEditingTask(task);
    setTitle(task.title || "");
    setDescription(task.description || "");
    setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "");
    setIsFormOpen(true);
  };

  const handleAddTodoItem = () => {
    if (!newTodoTitle.trim()) return;
    const newItem: MultiTodoItem = {
      id: window.crypto?.randomUUID ? window.crypto.randomUUID() : Date.now().toString() + Math.random().toString(),
      title: newTodoTitle.trim(),
      description: newTodoDescription.trim() || undefined,
      dueDate: newTodoDueDate ? new Date(newTodoDueDate).toISOString() : undefined,
    };
    setTodoItems((prev) => [...prev, newItem]);
    setNewTodoTitle("");
    setNewTodoDescription("");
    setNewTodoDueDate("");
    setShowDetailsForm(false);
  };

  const handleRemoveTodoItem = (id: string) => {
    setTodoItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!resolvedFestivalId) return;

    try {
      setIsSubmitting(true);

      if (editingTask) {
        if (!title.trim()) {
          toast.error("Task title is required");
          return;
        }
        const payload = {
          title: title.trim(),
          description: description.trim(),
          dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        };
        await DashboardService.updateTask(resolvedFestivalId, editingTask._id, payload);
        toast.success("To-do updated successfully");
      } else {
        const finalItems = [...todoItems];
        if (newTodoTitle.trim()) {
          finalItems.push({
            id: Date.now().toString(),
            title: newTodoTitle.trim(),
            description: newTodoDescription.trim() || undefined,
            dueDate: newTodoDueDate ? new Date(newTodoDueDate).toISOString() : undefined,
          });
        }

        if (finalItems.length === 0) {
          toast.error("Please enter at least one to-do title");
          return;
        }

        for (const item of finalItems) {
          await DashboardService.createTask(resolvedFestivalId, {
            title: item.title,
            description: item.description,
            dueDate: item.dueDate,
          });
        }

        toast.success(
          finalItems.length > 1
            ? `${finalItems.length} to-dos created successfully`
            : "To-do created successfully"
        );
      }

      setIsFormOpen(false);
      invalidateTasks();
    } catch {
      toast.error("Failed to save to-do");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTaskId || !resolvedFestivalId) return;
    try {
      setIsDeleting(true);
      await DashboardService.deleteTask(resolvedFestivalId, deletingTaskId);
      toast.success("To-do deleted successfully");
      setDeletingTaskId(null);
      invalidateTasks();
    } catch {
      toast.error("Failed to delete to-do");
    } finally {
      setIsDeleting(false);
    }
  };

  const getTaskActions = (task: DashboardTask): RowAction[] => {
    const isDone = task.status === "COMPLETED" || task.isCompleted;
    return [
      {
        key: "view",
        label: "View Details",
        icon: <ArrowRight className="h-3.5 w-3.5 text-primary" />,
        onSelect: () => navigate({ to: "/dashboard/tasks/$taskId", params: { taskId: task._id } }),
      },
      {
        key: "toggle",
        label: isDone ? "Mark Pending (○)" : "Mark Complete (✓)",
        icon: isDone ? <Circle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />,
        onSelect: () => handleToggleComplete(task),
      },
      {
        key: "edit",
        label: "Edit To-do",
        icon: <Pencil className="h-3.5 w-3.5" />,
        onSelect: () => openEditModal(task),
      },
      {
        key: "delete",
        label: "Delete To-do",
        icon: <Trash2 className="h-3.5 w-3.5 text-destructive" />,
        variant: "destructive",
        onSelect: () => setDeletingTaskId(task._id),
      },
    ];
  };

  if (!resolvedFestivalId) {
    return (
      <EmptyState
        icon={Circle}
        title="No to-dos yet"
        description="Add a to-do item for this festival."
      />
    );
  }

  const contentNode = (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3 flex-wrap">
        {!limit && (
          <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
            <div className="inline-flex items-center rounded-xl bg-muted/60 p-1 border border-border/60 text-xs w-full sm:w-auto justify-between sm:justify-start">
              <button
                type="button"
                onClick={() => setTabFilter("all")}
                className={cn(
                  "px-3 py-1 rounded-lg font-medium transition-all cursor-pointer flex-1 sm:flex-initial text-center text-xs",
                  tabFilter === "all" ? cn(theme.gradient, "text-white shadow-2xs font-bold") : "text-muted-foreground hover:text-foreground",
                )}
              >
                All ({tasks.length})
              </button>
              <button
                type="button"
                onClick={() => setTabFilter("pending")}
                className={cn(
                  "px-3 py-1 rounded-lg font-medium transition-all cursor-pointer flex-1 sm:flex-initial text-center text-xs",
                  tabFilter === "pending" ? cn(theme.gradient, "text-white shadow-2xs font-bold") : "text-muted-foreground hover:text-foreground",
                )}
              >
                Pending
              </button>
              <button
                type="button"
                onClick={() => setTabFilter("completed")}
                className={cn(
                  "px-3 py-1 rounded-lg font-medium transition-all cursor-pointer flex-1 sm:flex-initial text-center text-xs",
                  tabFilter === "completed" ? cn(theme.gradient, "text-white shadow-2xs font-bold") : "text-muted-foreground hover:text-foreground",
                )}
              >
                Completed
              </button>
            </div>

            <div className="w-full sm:w-48">
              <AppInput
                placeholder="Search to-dos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-3.5 w-3.5 text-muted-foreground" />}
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 ml-auto w-full sm:w-auto justify-between sm:justify-end pt-1 sm:pt-0">
          {!limit && (
            <div className="inline-flex items-center rounded-lg bg-muted/60 p-0.5 border border-border/60">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-1.5 rounded-md text-xs transition-all cursor-pointer",
                  viewMode === "list" ? cn(theme.gradient, "text-white shadow-2xs") : "text-muted-foreground hover:text-foreground",
                )}
                title="List View"
              >
                <List className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-1.5 rounded-md text-xs transition-all cursor-pointer",
                  viewMode === "grid" ? cn(theme.gradient, "text-white shadow-2xs") : "text-muted-foreground hover:text-foreground",
                )}
                title="Grid View"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <AppButton
            size="sm"
            gradient={theme.gradient}
            leftIcon={<Plus className="h-3.5 w-3.5" />}
            onClick={openCreateModal}
            className="flex items-center gap-1 text-xs"
          >
            Add To-do
          </AppButton>
        </div>
      </div>

      {isLoading ? (
        <div className="p-6 text-center text-xs text-muted-foreground">Loading to-dos...</div>
      ) : displayTasks.length === 0 ? (
        <EmptyState
          icon={Circle}
          title="No to-do items"
          description="Click 'Add To-do' to create a new task."
        />
      ) : (
        <div
          className={cn(
            viewMode === "grid" && !limit
              ? "grid grid-cols-1 sm:grid-cols-2 gap-3"
              : "divide-y divide-border/60 flex-1",
          )}
        >
          {displayTasks.map((task) => {
            const isDone = task.status === "COMPLETED" || task.isCompleted;

            if (viewMode === "grid" && !limit) {
              return (
                <div
                  key={task._id}
                  className={cn(
                    "group rounded-2xl border border-border/60 bg-card p-3.5 shadow-2xs hover:border-primary/40 transition-all flex flex-col justify-between gap-2.5",
                    isDone && "opacity-65 bg-muted/20",
                  )}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div
                        className="flex items-start gap-2.5 cursor-pointer flex-1 min-w-0"
                        onClick={() => handleToggleComplete(task)}
                      >
                        <button
                          type="button"
                          className="mt-0.5 text-foreground hover:scale-110 transition-transform cursor-pointer shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center -m-1"
                          title={isDone ? "Mark Pending" : "Mark Complete"}
                        >
                          {isDone ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-500/20" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
                          )}
                        </button>
                        <span
                          className={cn(
                            "font-semibold text-foreground text-xs leading-snug line-clamp-2 pt-1",
                            isDone && "line-through text-muted-foreground",
                          )}
                        >
                          {task.title}
                        </span>
                      </div>
                      <RowActionsMenu actions={getTaskActions(task)} />
                    </div>

                    {task.description && (
                      <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed pl-7">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-1.5 pt-1 pl-7">
                      <span
                        className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0",
                          isDone
                            ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
                            : "bg-amber-500/15 text-amber-600 border-amber-500/20 dark:text-amber-400",
                        )}
                      >
                        {isDone ? "Completed" : "Pending"}
                      </span>
                    </div>
                  </div>

                  {task.dueDate && (
                    <div className="pt-2 border-t border-border/40 text-[10px] text-muted-foreground pl-7 flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Due {formatDate(task.dueDate)}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div
                key={task._id}
                className={cn(
                  "flex items-center justify-between gap-3 py-2.5 px-3 hover:bg-muted/40 rounded-xl transition-colors group",
                  isDone && "opacity-65",
                )}
              >
                <div
                  className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                  onClick={() => handleToggleComplete(task)}
                >
                  <button
                    type="button"
                    className="text-foreground hover:scale-110 transition-transform cursor-pointer shrink-0 min-h-[40px] min-w-[40px] flex items-center justify-center -m-1"
                    title={isDone ? "Mark Pending" : "Mark Complete"}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-500/20" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <span
                      className={cn(
                        "font-semibold text-foreground text-xs block truncate",
                        isDone && "line-through text-muted-foreground",
                      )}
                    >
                      {task.title}
                    </span>
                    {task.description && (
                      <span className="text-[11px] text-muted-foreground block truncate">
                        {task.description}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {task.dueDate && (
                    <span className="text-[10px] text-muted-foreground hidden sm:inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {formatDate(task.dueDate)}
                    </span>
                  )}
                  <RowActionsMenu actions={getTaskActions(task)} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!limit && totalPages > 1 && (
        <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Page {page} of {totalPages} ({filteredTasks.length} items)
          </span>
          <div className="flex items-center gap-1">
            <AppButton
              variant="outline"
              size="xs"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Prev
            </AppButton>
            <AppButton
              variant="outline"
              size="xs"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </AppButton>
          </div>
        </div>
      )}

      {(limit || isWidget) && (
        <Link
          to="/dashboard/tasks-notes"
          className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          View all to-dos <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}

      <ResponsiveFormDrawer
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSaveTask}
        title={editingTask ? "Edit To-do" : "Add New To-dos"}
        titleIcon={
          <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs font-bold", theme.gradient)}>
            <CheckCircle2 className="h-4.5 w-4.5 text-white" />
          </div>
        }
        gradient={theme.gradient}
        submitLabel={
          editingTask
            ? "Save Changes"
            : todoItems.length + (newTodoTitle.trim() ? 1 : 0) > 1
              ? `Create ${todoItems.length + (newTodoTitle.trim() ? 1 : 0)} To-dos`
              : "Create To-do"
        }
        loading={isSubmitting}
      >
        {editingTask ? (
          /* Single Task Edit Mode */
          <div className="space-y-4">
            <AppInput
              label="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Confirm artist payment"
              required
            />

            <AppTextArea
              label="Details (Optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional notes or steps..."
              rows={3}
            />

            <AppInput
              label="Due Date (Optional)"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        ) : (
          /* Multi To-do Creation Mode (Notes Checklist Pattern) */
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">
                  To-do Title <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowDetailsForm((prev) => !prev)}
                  className={cn("text-[11px] font-semibold hover:underline cursor-pointer", theme.iconColor)}
                >
                  {showDetailsForm ? "Hide details" : "+ Add details / date"}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <AppInput
                  placeholder="Enter to-do item..."
                  value={newTodoTitle}
                  onChange={(e) => setNewTodoTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTodoItem();
                    }
                  }}
                  className="flex-1"
                />
                <AppButton
                  type="button"
                  size="sm"
                  gradient={theme.gradient}
                  onClick={handleAddTodoItem}
                  leftIcon={<Plus className="h-3.5 w-3.5" />}
                  className="shrink-0 font-semibold shadow-xs"
                >
                  Add
                </AppButton>
              </div>

              {showDetailsForm && (
                <div className="p-3 bg-muted/40 rounded-xl border border-border/50 space-y-2.5 mt-2 animate-in fade-in-50 duration-200">
                  <AppTextArea
                    label="Details (Optional)"
                    value={newTodoDescription}
                    onChange={(e) => setNewTodoDescription(e.target.value)}
                    placeholder="Additional notes or steps..."
                    rows={2}
                  />
                  <AppInput
                    label="Due Date (Optional)"
                    type="date"
                    value={newTodoDueDate}
                    onChange={(e) => setNewTodoDueDate(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* List of Added To-dos in Batch */}
            {todoItems.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-border/60">
                <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                  <span className="flex items-center gap-1.5">
                    To-dos to create{" "}
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold border", theme.badgeColor)}>
                      {todoItems.length}
                    </span>
                  </span>
                  <span className="text-[10px] text-muted-foreground font-normal">Tap X to remove</span>
                </div>

                <div className="space-y-1.5 max-h-52 overflow-y-auto bg-muted/30 p-2.5 rounded-xl border border-border/40">
                  {todoItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-2 p-2 rounded-lg bg-card border border-border/50 text-xs shadow-2xs group"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className={cn("text-[10px] font-bold w-4 shrink-0", theme.iconColor)}>
                          {idx + 1}.
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-foreground block truncate">
                            {item.title}
                          </span>
                          {item.description && (
                            <span className="text-[11px] text-muted-foreground block truncate">
                              {item.description}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.dueDate && (
                          <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-md border hidden sm:inline-block", theme.badgeColor)}>
                            {formatDate(item.dueDate)}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveTodoItem(item.id)}
                          className="text-muted-foreground hover:text-rose-500 p-1 cursor-pointer transition-colors"
                          title="Remove item"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </ResponsiveFormDrawer>

      <ConfirmDialog
        open={!!deletingTaskId}
        onCancel={() => setDeletingTaskId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete To-do"
        description="Are you sure you want to delete this item?"
        confirmLabel="Delete Item"
        variant="danger"
        loading={isDeleting}
      />
    </>
  );

  if (embedded) {
    return <div className="flex h-full flex-col min-w-0">{contentNode}</div>;
  }

  return (
    <AppCard
      icon={<CheckCircle2 className={cn("h-4 w-4", theme.iconColor)} />}
      title={limit || isWidget ? "Recent To-dos" : "Festival To-dos"}
      subtitle={`${filteredTasks.length} to-do items`}
      compact
      className="flex h-full flex-col"
    >
      {contentNode}
    </AppCard>
  );
};