import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  DashboardService,
  type DashboardNote,
  type DashboardData,
  type NoteImage,
  type NoteChecklistItem,
} from "@/api/dashboard/dashboard.service";
import { FileAttachmentsInput } from "@/pages/expenses/components/dialogs/ExpenseAttachmentsInput";
import {
  FileText,
  Plus,
  Pin,
  PinOff,
  Pencil,
  Trash2,
  ArrowRight,
  LayoutGrid,
  List,
  Image as ImageIcon,
  CheckSquare,
  Square,
  X,
  Search,
  ExternalLink,
  Download,
} from "lucide-react";
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
import { formatDate, cn, getFileUrl, looksLikeImage, looksLikePdf, getFileNameFromUrl } from "@/lib/utils";
import { getModuleTheme } from "@/theme/colors";
import { toast } from "sonner";

export type { DashboardNote };

interface AuthorItem {
  _id?: string;
  name?: string;
  email?: string;
}

const useDashboardNotes = (festivalId: string) => {
  return useQuery({
    queryKey: ["dashboard", "notes", festivalId],
    queryFn: () => DashboardService.getNotes(festivalId).then((r) => r.data),
    enabled: !!festivalId && festivalId !== "ALL",
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

interface DashboardNotesProps {
  data?: DashboardData;
  limit?: number;
  isWidget?: boolean;
  embedded?: boolean;
}

export const DashboardNotes = ({
  data: initialData,
  limit,
  isWidget = false,
  embedded = false,
}: DashboardNotesProps) => {
  const theme = getModuleTheme("tasks-notes");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { activeFestivalId } = useFestivalApiStore();
  const { data: festivalsData } = useFestivals();
  const festivals = (festivalsData?.festivals ?? []).filter((f) => !f.isDeleted);
  const resolvedFestivalId =
    activeFestivalId && festivals.some((f) => f._id === activeFestivalId)
      ? activeFestivalId
      : festivals[0]?._id || "";

  const { data: notesData = initialData?.notes || [], isLoading } = useDashboardNotes(resolvedFestivalId);

  // View & Filter states
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [filterTab, setFilterTab] = useState<"all" | "pinned" | "recent">("all");
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [searchQuery, setSearchQuery] = useState("");

  // Create/Edit Note Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<DashboardNote | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [formAttachmentUrls, setFormAttachmentUrls] = useState<string[]>([]);
  const [checklist, setChecklist] = useState<NoteChecklistItem[]>([]);
  const [newCheckitemText, setNewCheckitemText] = useState("");

  // Lightbox Preview State
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Delete Note state
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredNotes = useMemo(() => {
    const extracted =
      typeof notesData === "object" && notesData && "notes" in notesData
        ? (notesData as { notes: DashboardNote[] }).notes
        : Array.isArray(notesData)
          ? notesData
          : [];
    const rawNotes: DashboardNote[] = Array.isArray(extracted) ? extracted : [];

    let list = [...rawNotes].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    if (filterTab === "pinned") {
      list = list.filter((n) => n.isPinned);
    } else if (filterTab === "recent") {
      list = list.slice(0, 5);
    }

    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        (n.content && n.content.toLowerCase().includes(q)) ||
        (n.checklist && n.checklist.some((c) => c.text.toLowerCase().includes(q))),
    );
  }, [notesData, filterTab, searchQuery]);

  const displayNotes = useMemo(() => {
    if (limit) return filteredNotes.slice(0, limit);
    const start = (page - 1) * pageSize;
    return filteredNotes.slice(start, start + pageSize);
  }, [filteredNotes, limit, page]);

  const totalPages = Math.ceil(filteredNotes.length / pageSize);

  const invalidateNotes = () => {
    queryClient.invalidateQueries({
      queryKey: ["dashboard", "notes", resolvedFestivalId],
    });
    queryClient.invalidateQueries({
      queryKey: ["dashboard", resolvedFestivalId],
    });
  };

  const openCreateModal = () => {
    setEditingNote(null);
    setTitle("");
    setContent("");
    setFormAttachmentUrls([]);
    setChecklist([]);
    setNewCheckitemText("");
    setIsFormOpen(true);
  };

  const openEditModal = (note: DashboardNote) => {
    setEditingNote(note);
    setTitle(note.title || "");
    setContent(note.content || "");
    const existingImgs = (note.images || []).map((img) => img.url).filter(Boolean);
    const existingAtts = note.attachmentUrls || [];
    setFormAttachmentUrls(Array.from(new Set([...existingImgs, ...existingAtts])));
    setChecklist(note.checklist || []);
    setNewCheckitemText("");
    setIsFormOpen(true);
  };

  const addChecklistItem = () => {
    if (!newCheckitemText.trim()) return;
    setChecklist((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        text: newCheckitemText.trim(),
        isCompleted: false,
      },
    ]);
    setNewCheckitemText("");
  };

  const toggleChecklistItem = (id?: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isCompleted: !item.isCompleted } : item)),
    );
  };

  const removeChecklistItem = (id?: string) => {
    setChecklist((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !resolvedFestivalId) return;
    try {
      setIsSubmitting(true);

      const imageItems: NoteImage[] = formAttachmentUrls
        .filter((url) => looksLikeImage(url))
        .map((url) => ({ url, key: url, caption: "" }));
      const docUrls = formAttachmentUrls.filter((url) => !looksLikeImage(url));

      const payload = {
        title: title.trim(),
        content: content.trim(),
        images: imageItems,
        attachmentUrls: docUrls,
        checklist,
      };

      if (editingNote) {
        await DashboardService.updateNote(resolvedFestivalId, editingNote._id, payload);
        toast.success("Note updated successfully");
      } else {
        await DashboardService.createNote(resolvedFestivalId, payload);
        toast.success("Note created successfully");
      }

      setIsFormOpen(false);
      invalidateNotes();
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast.error(msg || "Failed to save note");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePin = async (note: DashboardNote) => {
    if (!resolvedFestivalId) return;
    try {
      if (note.isPinned) {
        await DashboardService.unpinNote(resolvedFestivalId, note._id);
        toast.success("Note unpinned");
      } else {
        await DashboardService.pinNote(resolvedFestivalId, note._id);
        toast.success("Note pinned");
      }
      invalidateNotes();
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast.error(msg || "Failed to toggle pin status");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingNoteId || !resolvedFestivalId) return;
    try {
      setIsDeleting(true);
      await DashboardService.deleteNote(resolvedFestivalId, deletingNoteId);
      toast.success("Note deleted successfully");
      setDeletingNoteId(null);
      invalidateNotes();
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast.error(msg || "Failed to delete note");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!resolvedFestivalId) {
    return (
      <EmptyState
        icon={FileText}
        title="No notes yet"
        description="Add a note to keep important festival information in one place."
      />
    );
  }

  const getNoteActions = (note: DashboardNote): RowAction[] => [
    {
      key: "view",
      label: "View Full Note",
      icon: <FileText className="h-3.5 w-3.5 text-primary" />,
      onSelect: () => navigate({ to: "/dashboard/notes/$noteId", params: { noteId: note._id } }),
    },
    {
      key: "pin",
      label: note.isPinned ? "Unpin Note" : "Pin Note",
      icon: note.isPinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />,
      onSelect: () => handleTogglePin(note),
    },
    {
      key: "edit",
      label: "Edit Note",
      icon: <Pencil className="h-3.5 w-3.5" />,
      onSelect: () => openEditModal(note),
    },
    {
      key: "delete",
      label: "Delete Note",
      icon: <Trash2 className="h-3.5 w-3.5 text-destructive" />,
      variant: "destructive",
      onSelect: () => setDeletingNoteId(note._id),
    },
  ];

  const contentNode = (
    <>
      {/* Control Bar: Tabs, Search, View Mode & Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3 flex-wrap">
        {!limit && (
          <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
            {/* Filter Tabs */}
            <div className="inline-flex items-center rounded-xl bg-muted/60 p-1 border border-border/60 text-xs w-full sm:w-auto justify-between sm:justify-start">
              <button
                type="button"
                onClick={() => setFilterTab("all")}
                className={cn(
                  "px-3 py-1 rounded-lg font-medium transition-all cursor-pointer flex-1 sm:flex-initial text-center text-xs",
                  filterTab === "all" ? cn(theme.gradient, "text-white shadow-2xs font-bold") : "text-muted-foreground hover:text-foreground",
                )}
              >
                All Notes
              </button>
              <button
                type="button"
                onClick={() => setFilterTab("pinned")}
                className={cn(
                  "px-3 py-1 rounded-lg font-medium transition-all cursor-pointer flex-1 sm:flex-initial text-center text-xs inline-flex items-center justify-center gap-1",
                  filterTab === "pinned" ? cn(theme.gradient, "text-white shadow-2xs font-bold") : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Pin className="h-3 w-3" /> Pinned
              </button>
              <button
                type="button"
                onClick={() => setFilterTab("recent")}
                className={cn(
                  "px-3 py-1 rounded-lg font-medium transition-all cursor-pointer flex-1 sm:flex-initial text-center text-xs",
                  filterTab === "recent" ? cn(theme.gradient, "text-white shadow-2xs font-bold") : "text-muted-foreground hover:text-foreground",
                )}
              >
                Recent
              </button>
            </div>

            {/* Search Input */}
            <div className="w-full sm:w-48 relative">
              <AppInput
                placeholder="Search notes..."
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
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-1.5 rounded-md text-xs transition-all cursor-pointer",
                  viewMode === "grid" ? cn(theme.gradient, "text-white shadow-2xs") : "text-muted-foreground hover:text-foreground",
                )}
                title="Grid View"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
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
            </div>
          )}

          <AppButton
            size="sm"
            gradient={theme.gradient}
            leftIcon={<Plus className="h-3.5 w-3.5" />}
            onClick={openCreateModal}
            className="flex items-center gap-1 text-xs"
          >
            Add Note
          </AppButton>
        </div>
      </div>

      {/* Note Cards / Rows Display */}
      {isLoading ? (
        <div className="p-6 text-center text-xs text-muted-foreground">Loading notes...</div>
      ) : displayNotes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No notes found"
          description="Add a note with text, photos, or checklists for this festival."
        />
      ) : (
        <div
          className={cn(
            viewMode === "grid" && !limit
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5"
              : "divide-y divide-border/60 flex-1",
          )}
        >
          {displayNotes.map((note) => {
            const authorName =
              typeof note.createdBy === "object" ? (note.createdBy as AuthorItem)?.name : note.createdBy;
            const rawImgs = (note.images || []).map((i) => i.url).filter(Boolean);
            const rawAtts = (note.attachmentUrls || []).filter(Boolean);
            const allUrls = Array.from(new Set([...rawImgs, ...rawAtts]));

            const noteImages = allUrls.filter((url) => looksLikeImage(url));
            const noteDocs = allUrls.filter((url) => !looksLikeImage(url));
            const noteChecklist = note.checklist || [];
            const completedCount = noteChecklist.filter((c) => c.isCompleted).length;

            if (viewMode === "grid" && !limit) {
              return (
                <div
                  key={note._id}
                  className="group rounded-2xl border border-border/60 bg-card p-4 shadow-2xs hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between gap-3 relative"
                >
                  <div className="space-y-2.5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                        {note.isPinned && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full shrink-0">
                            <Pin className="h-3 w-3 fill-current" /> Pinned
                          </span>
                        )}
                        <span
                          onClick={() => navigate({ to: "/dashboard/notes/$noteId", params: { noteId: note._id } })}
                          className="font-bold text-foreground text-sm line-clamp-1 hover:text-primary cursor-pointer transition-colors"
                        >
                          {note.title}
                        </span>
                      </div>
                      <RowActionsMenu actions={getNoteActions(note)} />
                    </div>

                    {/* Content Snippet */}
                    {note.content && (
                      <p
                        onClick={() => navigate({ to: "/dashboard/notes/$noteId", params: { noteId: note._id } })}
                        className="text-xs text-muted-foreground line-clamp-3 leading-relaxed whitespace-pre-line hover:text-foreground cursor-pointer transition-colors"
                      >
                        {note.content}
                      </p>
                    )}

                    {/* Photo Thumbnails Preview */}
                    {noteImages.length > 0 && (
                      <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1">
                        {noteImages.slice(0, 3).map((url, idx) => {
                          const resolved = getFileUrl(url);
                          const fileName = getFileNameFromUrl(url, `Photo ${idx + 1}`);
                          return (
                            <div
                              key={idx}
                              onClick={() => setLightboxImage(resolved)}
                              className="relative h-16 w-16 rounded-xl overflow-hidden border border-border/60 shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                            >
                              <img
                                src={resolved}
                                alt={fileName}
                                className="h-full w-full object-cover"
                              />
                              {idx === 2 && noteImages.length > 3 && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold">
                                  +{noteImages.length - 2}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* PDF & Document Attachments Preview */}
                    {noteDocs.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        {noteDocs.slice(0, 2).map((url, idx) => {
                          const isPdf = looksLikePdf(url);
                          const resolved = getFileUrl(url);
                          const fileName = getFileNameFromUrl(
                            url,
                            isPdf ? `Document_${idx + 1}.pdf` : `Attachment_${idx + 1}`
                          );
                          return (
                            <div
                              key={idx}
                              className="flex items-center justify-between gap-2 p-2 rounded-xl bg-muted/40 border border-border/50 text-xs hover:border-primary/30 transition-colors"
                            >
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <div
                                  className={cn(
                                    "h-7 w-7 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-bold",
                                    isPdf ? "bg-rose-500/10 text-rose-500 dark:bg-rose-500/20" : "bg-primary/10 text-primary"
                                  )}
                                >
                                  <FileText className="h-4 w-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <span className="font-semibold text-foreground truncate block text-xs" title={fileName}>
                                    {fileName}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground block">
                                    {isPdf ? "PDF Document" : "Attachment"}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <a
                                  href={resolved}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                                  title="Open document"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                                <a
                                  href={resolved}
                                  download={fileName}
                                  onClick={(e) => e.stopPropagation()}
                                  className="p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                                  title="Download document"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                </a>
                              </div>
                            </div>
                          );
                        })}
                        {noteDocs.length > 2 && (
                          <span className="text-[10px] text-muted-foreground font-medium pl-1 block">
                            +{noteDocs.length - 2} more document(s)
                          </span>
                        )}
                      </div>
                    )}

                    {/* Checklist Preview */}
                    {noteChecklist.length > 0 && (
                      <div className="space-y-1 pt-1 bg-muted/40 p-2.5 rounded-xl border border-border/40">
                        <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CheckSquare className="h-3 w-3 text-primary" /> Checklist
                          </span>
                          <span>
                            {completedCount}/{noteChecklist.length}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {noteChecklist.slice(0, 3).map((item, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-xs text-foreground truncate">
                              {item.isCompleted ? (
                                <CheckSquare className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                              ) : (
                                <Square className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                              )}
                              <span className={cn("truncate", item.isCompleted && "line-through text-muted-foreground")}>
                                {item.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{authorName ? `By ${authorName}` : ""}</span>
                    <span>{note.updatedAt ? formatDate(note.updatedAt) : note.createdAt ? formatDate(note.createdAt) : ""}</span>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={note._id}
                className="flex items-center justify-between gap-3 py-3 px-3 hover:bg-muted/40 rounded-2xl transition-colors"
              >
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {note.isPinned && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full shrink-0">
                        <Pin className="h-3 w-3 fill-current" /> Pinned
                      </span>
                    )}
                    <span className="font-bold text-foreground text-sm truncate">{note.title}</span>
                    {noteImages.length > 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-muted px-2 py-0.5 rounded-md text-muted-foreground font-semibold">
                        <ImageIcon className="h-3 w-3" /> {noteImages.length} photo(s)
                      </span>
                    )}
                    {noteDocs.length > 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-md font-semibold">
                        <FileText className="h-3 w-3" /> {noteDocs.length} file(s)
                      </span>
                    )}
                  </div>
                  {note.content && (
                    <p className="text-xs text-muted-foreground line-clamp-1 truncate">
                      {note.content}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    {authorName && <span>By {authorName}</span>}
                    <span>·</span>
                    <span>{note.updatedAt ? formatDate(note.updatedAt) : note.createdAt ? formatDate(note.createdAt) : ""}</span>
                  </div>
                </div>
                <div className="shrink-0">
                  <RowActionsMenu actions={getNoteActions(note)} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination for Full Workspace View */}
      {!limit && totalPages > 1 && (
        <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Page {page} of {totalPages} ({filteredNotes.length} notes)
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

      {/* Bottom Link for Dashboard Widget Mode */}
      {(limit || isWidget) && (
        <Link
          to="/dashboard/tasks-notes"
          className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          View all notes <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}

      {/* Create / Edit Note Drawer */}
      <ResponsiveFormDrawer
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        title={editingNote ? "Edit Note" : "Add New Note"}
        titleIcon={
          <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs font-bold", theme.gradient)}>
            <FileText className="h-4.5 w-4.5 text-white" />
          </div>
        }
        gradient={theme.gradient}
        submitLabel={editingNote ? "Save Changes" : "Create Note"}
        loading={isSubmitting}
      >
        <div className="space-y-4">
          <AppInput
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter note title..."
            required
          />

          <AppTextArea
            label="Content / Quick Notes"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write details, meeting minutes, venue notes..."
            rows={4}
          />

          {/* Reusable File & Photo Attachment Input */}
          <FileAttachmentsInput
            label="Photos & File Attachments (PDF, Images, Receipts)"
            value={formAttachmentUrls}
            onChange={(urls) => setFormAttachmentUrls(urls)}
            folder="notes"
          />

          {/* Checklist Builder Section */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <CheckSquare className="h-4 w-4 text-primary" /> Checklist Items ({checklist.length})
            </label>

            <div className="flex items-center gap-2">
              <AppInput
                placeholder="Add checklist item..."
                value={newCheckitemText}
                onChange={(e) => setNewCheckitemText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addChecklistItem();
                  }
                }}
              />
              <AppButton type="button" variant="outline" size="sm" onClick={addChecklistItem}>
                Add
              </AppButton>
            </div>

            {checklist.length > 0 && (
              <div className="space-y-1.5 max-h-40 overflow-y-auto bg-muted/30 p-2.5 rounded-xl border border-border/40 mt-2">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-muted/60 transition-colors"
                  >
                    <div
                      className="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
                      onClick={() => toggleChecklistItem(item.id)}
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
                      onClick={() => removeChecklistItem(item.id)}
                      className="text-muted-foreground hover:text-rose-500 p-1 cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </ResponsiveFormDrawer>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deletingNoteId}
        onCancel={() => setDeletingNoteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Note"
        description="Are you sure you want to delete this note? This action cannot be undone."
        confirmLabel="Delete Note"
        variant="danger"
        loading={isDeleting}
      />

      {/* Image Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl">
            <img src={lightboxImage} alt="Full resolution view" className="max-h-[85vh] w-auto object-contain rounded-2xl" />
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="absolute top-3 right-3 bg-black/70 text-white rounded-full p-2 hover:bg-rose-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );

  if (embedded) {
    return <div className="flex h-full flex-col min-w-0">{contentNode}</div>;
  }

  return (
    <AppCard
      icon={<FileText className={cn("h-4 w-4", theme.iconColor)} />}
      title={limit || isWidget ? "Recent Notes" : "Festival Notes"}
      subtitle={`${filteredNotes.length} total notes`}
      compact
      className="flex h-full flex-col"
    >
      {contentNode}
    </AppCard>
  );
};
