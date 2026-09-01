import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardService, type DashboardTask, type DashboardData } from "./dashboard.service";
import { toast } from "sonner";

/**
 * Helper to update task in list cache (supports object { tasks: [...] } or array [...])
 */
function updateTaskListCache(
  oldData: unknown,
  updater: (task: DashboardTask) => DashboardTask,
): unknown {
  if (!oldData) return oldData;
  if (typeof oldData === "object" && oldData !== null && "tasks" in oldData) {
    const container = oldData as { tasks: DashboardTask[]; [key: string]: unknown };
    if (!Array.isArray(container.tasks)) return oldData;
    return {
      ...container,
      tasks: container.tasks.map(updater),
    };
  }
  if (Array.isArray(oldData)) {
    return (oldData as DashboardTask[]).map(updater);
  }
  return oldData;
}

/**
 * Helper to remove task from list cache
 */
function removeTaskFromListCache(oldData: unknown, taskId: string): unknown {
  if (!oldData) return oldData;
  if (typeof oldData === "object" && oldData !== null && "tasks" in oldData) {
    const container = oldData as { tasks: DashboardTask[]; total?: number; [key: string]: unknown };
    if (!Array.isArray(container.tasks)) return oldData;
    return {
      ...container,
      tasks: container.tasks.filter((t) => t._id !== taskId),
      total: typeof container.total === "number" ? Math.max(0, container.total - 1) : container.total,
    };
  }
  if (Array.isArray(oldData)) {
    return (oldData as DashboardTask[]).filter((t) => t._id !== taskId);
  }
  return oldData;
}

/**
 * Helper to update dashboard cache (which contains a tasks array)
 */
function updateDashboardTasksCache(
  oldData: DashboardData | undefined,
  updater: (task: DashboardTask) => DashboardTask,
): DashboardData | undefined {
  if (!oldData || !Array.isArray(oldData.tasks)) return oldData;
  return {
    ...oldData,
    tasks: oldData.tasks.map(updater),
  };
}

/**
 * Helper to remove task from dashboard cache
 */
function removeTaskFromDashboardCache(
  oldData: DashboardData | undefined,
  taskId: string,
): DashboardData | undefined {
  if (!oldData || !Array.isArray(oldData.tasks)) return oldData;
  return {
    ...oldData,
    tasks: oldData.tasks.filter((t) => t._id !== taskId),
  };
}

export function useOptimisticTasks(festivalId: string) {
  const queryClient = useQueryClient();

  const listKey = ["dashboard", "tasks", festivalId];
  const dashboardKey = ["dashboard", festivalId];

  // 1. Toggle Task Complete / Reopen
  const toggleTaskMutation = useMutation({
    mutationFn: async (task: DashboardTask) => {
      const res = await DashboardService.toggleTask(festivalId, task._id);
      return res.data;
    },
    onMutate: async (task: DashboardTask) => {
      // Cancel active queries
      await queryClient.cancelQueries({ queryKey: listKey });
      await queryClient.cancelQueries({ queryKey: dashboardKey });
      const detailKey = ["dashboard", "task", festivalId, task._id];
      const allDetailKey = ["dashboard", "task", "ALL", task._id];
      await queryClient.cancelQueries({ queryKey: detailKey });

      // Save snapshots
      const previousList = queryClient.getQueryData(listKey);
      const previousDashboard = queryClient.getQueryData<DashboardData>(dashboardKey);
      const previousDetail = queryClient.getQueryData<DashboardTask>(detailKey);

      const isCurrentlyDone = task.status === "COMPLETED" || !!task.isCompleted;
      const nextDone = !isCurrentlyDone;
      const nextStatus: DashboardTask["status"] = nextDone ? "COMPLETED" : "TODO";

      const updateItem = (item: DashboardTask): DashboardTask => {
        if (item._id !== task._id) return item;
        return {
          ...item,
          status: nextStatus,
          isCompleted: nextDone,
          updatedAt: new Date().toISOString(),
        };
      };

      // Optimistically update list cache
      queryClient.setQueryData(listKey, (old: unknown) => updateTaskListCache(old, updateItem));

      // Optimistically update dashboard cache
      queryClient.setQueryData<DashboardData>(dashboardKey, (old) =>
        updateDashboardTasksCache(old, updateItem),
      );

      // Optimistically update detail cache
      queryClient.setQueryData<DashboardTask>(detailKey, (old) => (old ? updateItem(old) : old));
      queryClient.setQueryData<DashboardTask>(allDetailKey, (old) => (old ? updateItem(old) : old));

      return { previousList, previousDashboard, previousDetail, detailKey, allDetailKey };
    },
    onError: (_err, _task, context) => {
      // Rollback
      if (context) {
        queryClient.setQueryData(listKey, context.previousList);
        queryClient.setQueryData(dashboardKey, context.previousDashboard);
        queryClient.setQueryData(context.detailKey, context.previousDetail);
        queryClient.setQueryData(context.allDetailKey, context.previousDetail);
      }
      toast.error("Couldn't update task status. Please try again.");
    },
    onSettled: (_data, _error, task) => {
      queryClient.invalidateQueries({ queryKey: listKey });
      queryClient.invalidateQueries({ queryKey: dashboardKey });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "task", festivalId, task._id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "task", "ALL", task._id] });
    },
  });

  // 2. Update Task Details
  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, payload }: { taskId: string; payload: Partial<DashboardTask> }) => {
      const res = await DashboardService.updateTask(festivalId, taskId, payload);
      return res.data;
    },
    onMutate: async ({ taskId, payload }) => {
      await queryClient.cancelQueries({ queryKey: listKey });
      await queryClient.cancelQueries({ queryKey: dashboardKey });
      const detailKey = ["dashboard", "task", festivalId, taskId];
      const allDetailKey = ["dashboard", "task", "ALL", taskId];
      await queryClient.cancelQueries({ queryKey: detailKey });

      const previousList = queryClient.getQueryData(listKey);
      const previousDashboard = queryClient.getQueryData<DashboardData>(dashboardKey);
      const previousDetail = queryClient.getQueryData<DashboardTask>(detailKey);

      const updateItem = (item: DashboardTask): DashboardTask => {
        if (item._id !== taskId) return item;
        return {
          ...item,
          ...payload,
          updatedAt: new Date().toISOString(),
        };
      };

      queryClient.setQueryData(listKey, (old: unknown) => updateTaskListCache(old, updateItem));
      queryClient.setQueryData<DashboardData>(dashboardKey, (old) =>
        updateDashboardTasksCache(old, updateItem),
      );
      queryClient.setQueryData<DashboardTask>(detailKey, (old) => (old ? updateItem(old) : old));
      queryClient.setQueryData<DashboardTask>(allDetailKey, (old) => (old ? updateItem(old) : old));

      return { previousList, previousDashboard, previousDetail, detailKey, allDetailKey };
    },
    onError: (_err, _vars, context) => {
      if (context) {
        queryClient.setQueryData(listKey, context.previousList);
        queryClient.setQueryData(dashboardKey, context.previousDashboard);
        queryClient.setQueryData(context.detailKey, context.previousDetail);
        queryClient.setQueryData(context.allDetailKey, context.previousDetail);
      }
      toast.error("Couldn't save task changes. Please try again.");
    },
    onSettled: (_data, _error, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: listKey });
      queryClient.invalidateQueries({ queryKey: dashboardKey });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "task", festivalId, taskId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "task", "ALL", taskId] });
    },
  });

  // 3. Delete Task
  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const res = await DashboardService.deleteTask(festivalId, taskId);
      return res.data;
    },
    onMutate: async (taskId: string) => {
      await queryClient.cancelQueries({ queryKey: listKey });
      await queryClient.cancelQueries({ queryKey: dashboardKey });

      const previousList = queryClient.getQueryData(listKey);
      const previousDashboard = queryClient.getQueryData<DashboardData>(dashboardKey);

      queryClient.setQueryData(listKey, (old: unknown) => removeTaskFromListCache(old, taskId));
      queryClient.setQueryData<DashboardData>(dashboardKey, (old) =>
        removeTaskFromDashboardCache(old, taskId),
      );

      return { previousList, previousDashboard };
    },
    onError: (_err, _taskId, context) => {
      if (context) {
        queryClient.setQueryData(listKey, context.previousList);
        queryClient.setQueryData(dashboardKey, context.previousDashboard);
      }
      toast.error("Couldn't delete task. Please try again.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: listKey });
      queryClient.invalidateQueries({ queryKey: dashboardKey });
    },
  });

  // 4. Create Task
  const createTaskMutation = useMutation({
    mutationFn: async (payload: Partial<DashboardTask>) => {
      const res = await DashboardService.createTask(festivalId, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listKey });
      queryClient.invalidateQueries({ queryKey: dashboardKey });
    },
    onError: () => {
      toast.error("Failed to create task. Please try again.");
    },
  });

  return {
    toggleTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
    createTaskMutation,
  };
}
