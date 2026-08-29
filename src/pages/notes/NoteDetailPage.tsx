import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, Link } from "@tanstack/react-router";
import {
  DashboardService,
  type DashboardNote,
  type NoteImage,
  type NoteChecklistItem,
} from "@/api/dashboard/dashboard.service";
import {
  ArrowLeft,
  Pin,
  PinOff,
  Pencil,
  Trash2,
  CheckSquare,
  Square,
  X,
  User as UserIcon,
  Calendar,
  Plus,
  Save,
  RotateCcw,
} from "lucide-react";
import { useFestivalApiStore } from "@/api/festival/festival.store";
import { useFestivals } from "@/api/festival/useFestivals";
import { AppButton } from "@/components/common/AppButton";
import { AppInput } from "@/components/common/AppInput";
import { AppTextArea } from "@/components/common/AppTextArea";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { FileAttachmentsInput } from "@/pages/expenses/components/dialogs/ExpenseAttachmentsInput";
import { FilePreviewSection } from "@/pages/notes/components/FilePreviewSection";
import { formatDate, cn, looksLikeImage } from "@/lib/utils";
import { getModuleTheme } from "@/theme/colors";
import { toast } from "sonner";

interface AuthorItem {
  _id?: string;
  name?: string;
  email?: string;
}

export default function NoteDetailPage() {
  const theme = getModuleTheme("tasks-notes");
  const params = useParams({ strict: false }) as { noteId?: string };
  const noteId = params.noteId || "";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { activeFestivalId } = useFestivalApiStore();
  const { data: festivalsData, isLoading: isFestivalsLoading } = useFestivals();
  const festivals = (festivalsData?.festivals ?? []).filter((f) => !f.isDeleted);
  const resolvedFestivalId =
    activeFestivalId && festivals.some((f) => f._id === activeFestivalId)
      ? activeFestivalId
      : festivals[0]?._id || "ALL";

  // Fetch Note Detail
  const {
    data: note,
    isLoading: isNoteLoading,
    isError,
    refetch,
  } = useQuery<DashboardNote>({
    queryKey: ["dashboard", "note", resolvedFestivalId, noteId],
    queryFn: () => DashboardService.getNoteById(resolvedFestivalId, noteId).then((r) => r.data),
    enabled: !!noteId,
  });

  // Inline Editing State
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editAttachmentUrls, setEditAttachmentUrls] = useState<string[]>([]);
  const [editChecklist, setEditChecklist] = useState<NoteChecklistItem[]>([]);
  const [newChecklistText, setNewChecklistText] = useState("");

  // Delete Dialog State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Initialize edit state when note data arrives or when entering edit mode
  useEffect(() => {
    if (note) {
      setEditTitle(note.title || "");
      setEditContent(note.content || "");
      const existingImgs = (note.images || []).map((img) => img.url).filter(Boolean);
      const existingAtts = note.attachmentUrls || [];
      const mergedUrls = Array.from(new Set([...existingImgs, ...existingAtts]));
      setEditAttachmentUrls(mergedUrls);
      setEditChecklist(note.checklist || []);
      setNewChecklistText("");
    }
  }, [note]);

  const invalidateNote = () => {
    queryClient.invalidateQueries({ queryKey: ["dashboard", "note", resolvedFestivalId, noteId] });
    queryClient.invalidateQueries({ queryKey: ["dashboard", "notes", resolvedFestivalId] });
    queryClient.invalidateQueries({ queryKey: ["dashboard", resolvedFestivalId] });
  };

  const handleStartEditing = () => {
    if (!note) return;
    setEditTitle(note.title || "");
    setEditContent(note.content || "");
    const existingImgs = (note.images || []).map((img) => img.url).filter(Boolean);
    const existingAtts = note.attachmentUrls || [];
    setEditAttachmentUrls(Array.from(new Set([...existingImgs, ...existingAtts])));
    setEditChecklist(note.checklist || []);
    setNewChecklistText("");
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    if (note) {
      setEditTitle(note.title || "");
      setEditContent(note.content || "");
      const existingImgs = (note.images || []).map((img) => img.url).filter(Boolean);
      const existingAtts = note.attachmentUrls || [];
      setEditAttachmentUrls(Array.from(new Set([...existingImgs, ...existingAtts])));
      setEditChecklist(note.checklist || []);
      setNewChecklistText("");
    }
    setIsEditing(false);
  };

  const handleTogglePin = async () => {
    if (!note || !resolvedFestivalId) return;
    try {
      if (note.isPinned) {
        await DashboardService.unpinNote(resolvedFestivalId, note._id);
        toast.success("Note unpinned");
      } else {
        await DashboardService.pinNote(resolvedFestivalId, note._id);
        toast.success("Note pinned");
      }
      invalidateNote();
    } catch {
      toast.error("Failed to update pin status");
    }
  };

  const handleToggleChecklistDetail = async (itemId?: string) => {
    if (!note || !resolvedFestivalId || isEditing) return;
    const updatedChecklist = (note.checklist || []).map((item) =>
      item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item,
    );
    try {
      await DashboardService.updateNote(resolvedFestivalId, note._id, {
        checklist: updatedChecklist,
      });
      invalidateNote();
    } catch {
      toast.error("Failed to update checklist item");
    }
  };

  const handleSaveInline = async () => {
    if (!note || !editTitle.trim() || !resolvedFestivalId) {
      toast.error("Note title is required");
      return;
    }

    try {
      setIsSubmitting(true);
      const imagesPayload: NoteImage[] = editAttachmentUrls
        .filter((url) => looksLikeImage(url))
        .map((url) => ({
          url,
          key: url,
          caption: "",
        }));
      const docUrls = editAttachmentUrls.filter((url) => !looksLikeImage(url));

      await DashboardService.updateNote(resolvedFestivalId, note._id, {
        title: editTitle.trim(),
        content: editContent.trim(),
        images: imagesPayload,
        attachmentUrls: docUrls,
        checklist: editChecklist,
      });

      toast.success("Note saved successfully");
      setIsEditing(false);
      invalidateNote();
    } catch {
      toast.error("Failed to save note changes");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!note || !resolvedFestivalId) return;
    try {
      setIsDeleting(true);
      await DashboardService.deleteNote(resolvedFestivalId, note._id);
      toast.success("Note deleted");
      navigate({ to: "/dashboard/tasks-notes" });
    } catch {
      toast.error("Failed to delete note");
    } finally {
      setIsDeleting(false);
    }
  };

  const addChecklistItemEdit = () => {
    if (!newChecklistText.trim()) return;
    setEditChecklist((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        text: newChecklistText.trim(),
        isCompleted: false,
      },
    ]);
    setNewChecklistText("");
  };

  const toggleChecklistItemEdit = (id?: string) => {
    setEditChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isCompleted: !item.isCompleted } : item)),
    );
  };

  const removeChecklistItemEdit = (id?: string) => {
    setEditChecklist((prev) => prev.filter((item) => item.id !== id));
  };

  const removeAttachmentUrl = (urlToRemove: string) => {
    setEditAttachmentUrls((prev) => prev.filter((u) => u !== urlToRemove));
  };

  if (isNoteLoading || isFestivalsLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4 p-2.5 sm:p-6 animate-pulse">
        <div className="h-6 w-32 bg-muted rounded-lg" />
        <div className="rounded-2xl sm:rounded-3xl border border-border/70 bg-card p-4 sm:p-8 space-y-4">
          <div className="h-8 w-3/4 bg-muted rounded-xl" />
          <div className="h-4 w-1/2 bg-muted rounded-lg" />
          <div className="h-32 bg-muted/40 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center space-y-4">
        <p className="text-sm font-semibold text-rose-500">Failed to load note details</p>
        <div className="flex justify-center gap-3">
          <AppButton size="sm" variant="outline" onClick={() => refetch()}>
            Retry
          </AppButton>
          <Link
            to="/dashboard/tasks-notes"
            className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Notes
          </Link>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center space-y-4">
        <p className="text-sm font-semibold text-foreground">Note Not Found</p>
        <p className="text-xs text-muted-foreground">The note you are looking for does not exist or has been removed.</p>
        <Link
          to="/dashboard/tasks-notes"
          className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Notes
        </Link>
      </div>
    );
  }

  const authorName =
    typeof note.createdBy === "object" ? (note.createdBy as AuthorItem)?.name : note.createdBy;
  const noteImages = note.images || [];
  const noteAttachments = note.attachmentUrls || [];
  const allUrls = Array.from(
    new Set([...noteImages.map((i) => i.url), ...noteAttachments]),
  ).filter(Boolean);
  const checklist = note.checklist || [];
  const completedChecklistCount = checklist.filter((c) => c.isCompleted).length;

  return (
    <div className="max-w-4xl mx-auto space-y-3 sm:space-y-6 p-3 sm:p-6 overflow-x-hidden pb-24 sm:pb-8">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between gap-2">
        {!isEditing ? (
          <Link
            to="/dashboard/tasks-notes"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Notes
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleCancelEditing}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Cancel Editing
          </button>
        )}

        {/* Desktop / Mobile Action Bar */}
        {!isEditing ? (
          <div className="flex items-center gap-1.5">
            <AppButton
              variant="outline"
              size="sm"
              onClick={handleTogglePin}
              leftIcon={
                note.isPinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />
              }
              className="text-xs py-1 px-2.5 h-8"
            >
              {note.isPinned ? "Unpin" : "Pin"}
            </AppButton>

            <AppButton
              size="sm"
              gradient={theme.gradient}
              onClick={handleStartEditing}
              leftIcon={<Pencil className="h-3.5 w-3.5" />}
              className="text-xs py-1 px-3 h-8"
            >
              Edit
            </AppButton>

            <AppButton
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteOpen(true)}
              className="text-rose-600 hover:bg-rose-500/10 border-rose-200 dark:border-rose-900 text-xs py-1 px-2.5 h-8"
              leftIcon={<Trash2 className="h-3.5 w-3.5" />}
            >
              Delete
            </AppButton>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <AppButton
              variant="outline"
              size="sm"
              onClick={handleCancelEditing}
              disabled={isSubmitting}
              className="text-xs py-1 px-3 h-8"
            >
              Cancel
            </AppButton>
            <AppButton
              size="sm"
              gradient={theme.gradient}
              onClick={handleSaveInline}
              loading={isSubmitting}
              leftIcon={<Save className="h-3.5 w-3.5" />}
              className="text-xs py-1 px-3.5 h-8"
            >
              Save Note
            </AppButton>
          </div>
        )}
      </div>

      {/* Main Card Container */}
      <div className="rounded-2xl sm:rounded-3xl border border-border/70 bg-card p-3.5 sm:p-8 shadow-xs space-y-4 sm:space-y-6">
        {/* Title & Metadata Section */}
        <div className="border-b border-border/60 pb-3.5 sm:pb-5 space-y-2">
          {!isEditing ? (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                {note.isPinned && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full shrink-0">
                    <Pin className="h-3 w-3 fill-current" /> Pinned
                  </span>
                )}
                <h1 className="text-lg sm:text-2xl font-bold text-foreground leading-snug">
                  {note.title}
                </h1>
              </div>

              <div className="flex items-center gap-3.5 text-[11px] sm:text-xs text-muted-foreground flex-wrap">
                {authorName && (
                  <span className="inline-flex items-center gap-1">
                    <UserIcon className="h-3.5 w-3.5" /> {authorName}
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Updated {note.updatedAt ? formatDate(note.updatedAt) : formatDate(note.createdAt || "")}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <AppInput
                label="Note Title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Enter note title..."
                required
                className="font-bold text-base sm:text-lg"
              />
            </div>
          )}
        </div>

        {/* Content Section (Inline Edit vs View Mode) */}
        {!isEditing ? (
          note.content ? (
            <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {note.content}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">No detailed content text provided.</p>
          )
        ) : (
          <div className="space-y-1.5">
            <AppTextArea
              label="Content / Paragraphs"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Write note details, meeting minutes, venue notes..."
              rows={6}
              className="text-xs sm:text-sm"
            />
          </div>
        )}

        {/* Checklist Section */}
        {!isEditing ? (
          checklist.length > 0 && (
            <div className="space-y-2.5 pt-3 border-t border-border/60">
              <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                <span className="flex items-center gap-1.5">
                  <CheckSquare className={cn("h-4 w-4", theme.iconColor)} /> Checklist Items
                </span>
                <span
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                    completedChecklistCount === checklist.length
                      ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
                      : theme.badgeColor,
                  )}
                >
                  {completedChecklistCount} of {checklist.length} completed
                </span>
              </div>

              <div className="space-y-1.5 bg-muted/30 p-3 rounded-2xl border border-border/50">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleToggleChecklistDetail(item.id)}
                    className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer p-1 rounded-lg hover:bg-muted/60 transition-colors"
                  >
                    {item.isCompleted ? (
                      <CheckSquare className="h-4 w-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Square className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    <span className={cn("flex-1", item.isCompleted && "line-through text-muted-foreground")}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        ) : (
          <div className="space-y-2 pt-3 border-t border-border/60">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <CheckSquare className={cn("h-4 w-4", theme.iconColor)} /> Checklist Items ({editChecklist.length})
            </label>

            <div className="flex items-center gap-2">
              <AppInput
                placeholder="Add checklist item..."
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addChecklistItemEdit();
                  }
                }}
              />
              <AppButton type="button" variant="outline" size="sm" onClick={addChecklistItemEdit}>
                <Plus className="h-3.5 w-3.5" /> Add
              </AppButton>
            </div>

            {editChecklist.length > 0 && (
              <div className="space-y-1.5 max-h-40 overflow-y-auto bg-muted/30 p-2.5 rounded-xl border border-border/40 mt-2">
                {editChecklist.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-muted/60 transition-colors"
                  >
                    <div
                      className="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
                      onClick={() => toggleChecklistItemEdit(item.id)}
                    >
                      {item.isCompleted ? (
                        <CheckSquare className="h-4 w-4 text-emerald-500 shrink-0" />
                      ) : (
                        <Square className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                      <span className={cn("text-xs truncate", item.isCompleted && "line-through text-muted-foreground")}>
                        {item.text}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeChecklistItemEdit(item.id)}
                      className="text-muted-foreground hover:text-rose-500 p-1 cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Photos & Files Section (View Mode vs Edit Mode) */}
        {!isEditing ? (
          <FilePreviewSection urls={allUrls} />
        ) : (
          <div className="space-y-3 pt-3 border-t border-border/60">
            <FileAttachmentsInput
              label="Photos, PDF Documents & Files"
              value={editAttachmentUrls}
              onChange={(urls) => setEditAttachmentUrls(urls)}
              folder="notes"
            />

            {/* Display list of current attached files with remove option */}
            {editAttachmentUrls.length > 0 && (
              <div className="pt-2">
                <FilePreviewSection
                  urls={editAttachmentUrls}
                  onRemoveUrl={removeAttachmentUrl}
                  isEditing={true}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={isDeleteOpen}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Note"
        description="Are you sure you want to delete this note? This action cannot be undone."
        confirmLabel="Delete Note"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}
