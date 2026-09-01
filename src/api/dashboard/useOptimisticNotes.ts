import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardService, type DashboardNote, type DashboardData, type NoteChecklistItem, type NoteImage } from "./dashboard.service";
import { toast } from "sonner";

/**
 * Helper to update note in list cache (supports object { notes: [...] } or array [...])
 */
function updateNoteListCache(
  oldData: unknown,
  updater: (note: DashboardNote) => DashboardNote,
): unknown {
  if (!oldData) return oldData;
  if (typeof oldData === "object" && oldData !== null && "notes" in oldData) {
    const container = oldData as { notes: DashboardNote[]; [key: string]: unknown };
    if (!Array.isArray(container.notes)) return oldData;
    const updated = container.notes.map(updater);
    // Re-sort notes: pinned first, then newest
    updated.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return dateB - dateA;
    });
    return {
      ...container,
      notes: updated,
    };
  }
  if (Array.isArray(oldData)) {
    const updated = (oldData as DashboardNote[]).map(updater);
    updated.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return dateB - dateA;
    });
    return updated;
  }
  return oldData;
}

/**
 * Helper to remove note from list cache
 */
function removeNoteFromListCache(oldData: unknown, noteId: string): unknown {
  if (!oldData) return oldData;
  if (typeof oldData === "object" && oldData !== null && "notes" in oldData) {
    const container = oldData as { notes: DashboardNote[]; total?: number; [key: string]: unknown };
    if (!Array.isArray(container.notes)) return oldData;
    return {
      ...container,
      notes: container.notes.filter((n) => n._id !== noteId),
      total: typeof container.total === "number" ? Math.max(0, container.total - 1) : container.total,
    };
  }
  if (Array.isArray(oldData)) {
    return (oldData as DashboardNote[]).filter((n) => n._id !== noteId);
  }
  return oldData;
}

/**
 * Helper to update dashboard cache (which contains a notes array)
 */
function updateDashboardNotesCache(
  oldData: DashboardData | undefined,
  updater: (note: DashboardNote) => DashboardNote,
): DashboardData | undefined {
  if (!oldData || !Array.isArray(oldData.notes)) return oldData;
  const updated = oldData.notes.map(updater);
  updated.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return dateB - dateA;
  });
  return {
    ...oldData,
    notes: updated,
  };
}

/**
 * Helper to remove note from dashboard cache
 */
function removeNoteFromDashboardCache(
  oldData: DashboardData | undefined,
  noteId: string,
): DashboardData | undefined {
  if (!oldData || !Array.isArray(oldData.notes)) return oldData;
  return {
    ...oldData,
    notes: oldData.notes.filter((n) => n._id !== noteId),
  };
}

export function useOptimisticNotes(festivalId: string) {
  const queryClient = useQueryClient();

  const listKey = ["dashboard", "notes", festivalId];
  const dashboardKey = ["dashboard", festivalId];

  // 1. Toggle Pin / Unpin Note
  const toggleNotePinMutation = useMutation({
    mutationFn: async (note: DashboardNote) => {
      if (note.isPinned) {
        const res = await DashboardService.unpinNote(festivalId, note._id);
        return res.data;
      } else {
        const res = await DashboardService.pinNote(festivalId, note._id);
        return res.data;
      }
    },
    onMutate: async (note: DashboardNote) => {
      await queryClient.cancelQueries({ queryKey: listKey });
      await queryClient.cancelQueries({ queryKey: dashboardKey });
      const detailKey = ["dashboard", "note", festivalId, note._id];
      const allDetailKey = ["dashboard", "note", "ALL", note._id];
      await queryClient.cancelQueries({ queryKey: detailKey });

      const previousList = queryClient.getQueryData(listKey);
      const previousDashboard = queryClient.getQueryData<DashboardData>(dashboardKey);
      const previousDetail = queryClient.getQueryData<DashboardNote>(detailKey);

      const updateItem = (item: DashboardNote): DashboardNote => {
        if (item._id !== note._id) return item;
        return {
          ...item,
          isPinned: !item.isPinned,
          updatedAt: new Date().toISOString(),
        };
      };

      queryClient.setQueryData(listKey, (old: unknown) => updateNoteListCache(old, updateItem));
      queryClient.setQueryData<DashboardData>(dashboardKey, (old) =>
        updateDashboardNotesCache(old, updateItem),
      );
      queryClient.setQueryData<DashboardNote>(detailKey, (old) => (old ? updateItem(old) : old));
      queryClient.setQueryData<DashboardNote>(allDetailKey, (old) => (old ? updateItem(old) : old));

      return { previousList, previousDashboard, previousDetail, detailKey, allDetailKey };
    },
    onError: (_err, _note, context) => {
      if (context) {
        queryClient.setQueryData(listKey, context.previousList);
        queryClient.setQueryData(dashboardKey, context.previousDashboard);
        queryClient.setQueryData(context.detailKey, context.previousDetail);
        queryClient.setQueryData(context.allDetailKey, context.previousDetail);
      }
      toast.error("Couldn't update pin status. Please try again.");
    },
    onSettled: (_data, _error, note) => {
      queryClient.invalidateQueries({ queryKey: listKey });
      queryClient.invalidateQueries({ queryKey: dashboardKey });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "note", festivalId, note._id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "note", "ALL", note._id] });
    },
  });

  // 2. Toggle Checklist Item inside Note
  const toggleChecklistMutation = useMutation({
    mutationFn: async ({ noteId, checklist }: { noteId: string; itemId?: string; checklist: NoteChecklistItem[] }) => {
      const res = await DashboardService.updateNote(festivalId, noteId, { checklist });
      return res.data;
    },
    onMutate: async ({ noteId, itemId, checklist }) => {
      await queryClient.cancelQueries({ queryKey: listKey });
      await queryClient.cancelQueries({ queryKey: dashboardKey });
      const detailKey = ["dashboard", "note", festivalId, noteId];
      const allDetailKey = ["dashboard", "note", "ALL", noteId];
      await queryClient.cancelQueries({ queryKey: detailKey });

      const previousList = queryClient.getQueryData(listKey);
      const previousDashboard = queryClient.getQueryData<DashboardData>(dashboardKey);
      const previousDetail = queryClient.getQueryData<DashboardNote>(detailKey);

      const updateItem = (item: DashboardNote): DashboardNote => {
        if (item._id !== noteId) return item;

        let updatedChecklist = checklist;
        if (itemId && (!checklist || checklist.length === 0)) {
          updatedChecklist = (item.checklist || []).map((c) =>
            c.id === itemId ? { ...c, isCompleted: !c.isCompleted } : c,
          );
        }

        return {
          ...item,
          checklist: updatedChecklist,
          updatedAt: new Date().toISOString(),
        };
      };

      queryClient.setQueryData(listKey, (old: unknown) => updateNoteListCache(old, updateItem));
      queryClient.setQueryData<DashboardData>(dashboardKey, (old) =>
        updateDashboardNotesCache(old, updateItem),
      );
      queryClient.setQueryData<DashboardNote>(detailKey, (old) => (old ? updateItem(old) : old));
      queryClient.setQueryData<DashboardNote>(allDetailKey, (old) => (old ? updateItem(old) : old));

      return { previousList, previousDashboard, previousDetail, detailKey, allDetailKey };
    },
    onError: (_err, _vars, context) => {
      if (context) {
        queryClient.setQueryData(listKey, context.previousList);
        queryClient.setQueryData(dashboardKey, context.previousDashboard);
        queryClient.setQueryData(context.detailKey, context.previousDetail);
        queryClient.setQueryData(context.allDetailKey, context.previousDetail);
      }
      toast.error("Couldn't update checklist item. Please try again.");
    },
    onSettled: (_data, _error, { noteId }) => {
      queryClient.invalidateQueries({ queryKey: listKey });
      queryClient.invalidateQueries({ queryKey: dashboardKey });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "note", festivalId, noteId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "note", "ALL", noteId] });
    },
  });

  // 3. Update Note Details
  const updateNoteMutation = useMutation({
    mutationFn: async ({
      noteId,
      payload,
    }: {
      noteId: string;
      payload: {
        title?: string;
        content?: string;
        images?: NoteImage[];
        checklist?: NoteChecklistItem[];
        relatedModule?: string;
        relatedEntityId?: string;
        attachmentUrls?: string[];
      };
    }) => {
      const res = await DashboardService.updateNote(festivalId, noteId, payload);
      return res.data;
    },
    onMutate: async ({ noteId, payload }) => {
      await queryClient.cancelQueries({ queryKey: listKey });
      await queryClient.cancelQueries({ queryKey: dashboardKey });
      const detailKey = ["dashboard", "note", festivalId, noteId];
      const allDetailKey = ["dashboard", "note", "ALL", noteId];
      await queryClient.cancelQueries({ queryKey: detailKey });

      const previousList = queryClient.getQueryData(listKey);
      const previousDashboard = queryClient.getQueryData<DashboardData>(dashboardKey);
      const previousDetail = queryClient.getQueryData<DashboardNote>(detailKey);

      const updateItem = (item: DashboardNote): DashboardNote => {
        if (item._id !== noteId) return item;
        return {
          ...item,
          ...payload,
          updatedAt: new Date().toISOString(),
        };
      };

      queryClient.setQueryData(listKey, (old: unknown) => updateNoteListCache(old, updateItem));
      queryClient.setQueryData<DashboardData>(dashboardKey, (old) =>
        updateDashboardNotesCache(old, updateItem),
      );
      queryClient.setQueryData<DashboardNote>(detailKey, (old) => (old ? updateItem(old) : old));
      queryClient.setQueryData<DashboardNote>(allDetailKey, (old) => (old ? updateItem(old) : old));

      return { previousList, previousDashboard, previousDetail, detailKey, allDetailKey };
    },
    onError: (_err, _vars, context) => {
      if (context) {
        queryClient.setQueryData(listKey, context.previousList);
        queryClient.setQueryData(dashboardKey, context.previousDashboard);
        queryClient.setQueryData(context.detailKey, context.previousDetail);
        queryClient.setQueryData(context.allDetailKey, context.previousDetail);
      }
      toast.error("Couldn't save note. Please try again.");
    },
    onSettled: (_data, _error, { noteId }) => {
      queryClient.invalidateQueries({ queryKey: listKey });
      queryClient.invalidateQueries({ queryKey: dashboardKey });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "note", festivalId, noteId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "note", "ALL", noteId] });
    },
  });

  // 4. Delete Note
  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      const res = await DashboardService.deleteNote(festivalId, noteId);
      return res.data;
    },
    onMutate: async (noteId: string) => {
      await queryClient.cancelQueries({ queryKey: listKey });
      await queryClient.cancelQueries({ queryKey: dashboardKey });

      const previousList = queryClient.getQueryData(listKey);
      const previousDashboard = queryClient.getQueryData<DashboardData>(dashboardKey);

      queryClient.setQueryData(listKey, (old: unknown) => removeNoteFromListCache(old, noteId));
      queryClient.setQueryData<DashboardData>(dashboardKey, (old) =>
        removeNoteFromDashboardCache(old, noteId),
      );

      return { previousList, previousDashboard };
    },
    onError: (_err, _noteId, context) => {
      if (context) {
        queryClient.setQueryData(listKey, context.previousList);
        queryClient.setQueryData(dashboardKey, context.previousDashboard);
      }
      toast.error("Couldn't delete note. Please try again.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: listKey });
      queryClient.invalidateQueries({ queryKey: dashboardKey });
    },
  });

  // 5. Create Note
  const createNoteMutation = useMutation({
    mutationFn: async (payload: {
      title: string;
      content?: string;
      images?: NoteImage[];
      checklist?: NoteChecklistItem[];
      relatedModule?: string;
      relatedEntityId?: string;
      attachmentUrls?: string[];
    }) => {
      const res = await DashboardService.createNote(festivalId, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listKey });
      queryClient.invalidateQueries({ queryKey: dashboardKey });
    },
    onError: () => {
      toast.error("Failed to create note. Please try again.");
    },
  });

  return {
    toggleNotePinMutation,
    toggleChecklistMutation,
    updateNoteMutation,
    deleteNoteMutation,
    createNoteMutation,
  };
}
