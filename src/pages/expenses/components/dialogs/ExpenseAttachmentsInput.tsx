/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from "react";
import {
  FileText,
  Loader2,
  Paperclip,
  Trash2,
  Upload,
  ExternalLink,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { cn, getFileUrl } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { UploadService } from "@/api/upload/upload.service";

interface ExpenseAttachmentsInputProps {
  value?: string[];
  onChange?: (urls: string[]) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
  folder?: string;
}

const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp", ".avif"];

function looksLikeImage(url: string): boolean {
  try {
    const path = new URL(url, "http://localhost").pathname.toLowerCase();
    return IMAGE_EXT.some((ext) => path.endsWith(ext));
  } catch {
    return /\.(jpe?g|png|gif|webp|svg|bmp|avif)([?#].*)?$/i.test(url);
  }
}

export function ExpenseAttachmentsInput({
  value = [],
  onChange,
  disabled = false,
  label = "Receipts & Attachments",
  className,
  folder = "expenses",
}: ExpenseAttachmentsInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);

  const isUploading = uploadingCount > 0;

  const handleFilesSelected = async (files: FileList | File[] | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    setUploadingCount(fileArray.length);

    const newUrls: string[] = [];

    for (const file of fileArray) {
      if (file.size > 3 * 1024 * 1024) {
        toast.error(`File "${file.name}" exceeds the maximum allowed size of 3 MB.`);
        setUploadingCount((prev) => Math.max(0, prev - 1));
        continue;
      }

      try {
        const result = await UploadService.uploadFile(file, folder);
        if (result?.url) {
          newUrls.push(result.url);
        }
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message || `Failed to upload ${file.name}. Please try again.`,
        );
      } finally {
        setUploadingCount((prev) => Math.max(0, prev - 1));
      }
    }

    if (newUrls.length > 0) {
      onChange?.([...value, ...newUrls]);
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleRemove = (indexToRemove: number) => {
    const urlToRemove = value[indexToRemove];
    if (urlToRemove) {
      UploadService.deleteFile(urlToRemove).catch(() => {});
    }
    const updated = value.filter((_, idx) => idx !== indexToRemove);
    onChange?.(updated);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isUploading) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (!disabled && !isUploading && e.dataTransfer.files) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  return (
    <div className={cn("space-y-2.5 w-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <div className="p-1 rounded-md bg-rose-500/10 text-rose-500 dark:bg-rose-500/20">
            <Paperclip className="h-3.5 w-3.5" />
          </div>
          <span>{label}</span>
          {value.length > 0 && (
            <span className="inline-flex items-center justify-center rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 px-2 py-0.5 text-[10px] font-bold">
              {value.length} {value.length === 1 ? "file" : "files"}
            </span>
          )}
        </Label>

        {value.length > 0 && (
          <button
            type="button"
            disabled={disabled || isUploading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add More</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        disabled={disabled || isUploading}
        onChange={(e) => handleFilesSelected(e.target.files)}
      />

      {/* Dropzone & Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && !isUploading && inputRef.current?.click()}
        className={cn(
          "relative group overflow-hidden rounded-2xl border-2 border-dashed transition-all cursor-pointer p-4 text-center flex flex-col items-center justify-center gap-2",
          isDragOver
            ? "border-rose-500 bg-rose-500/10 dark:bg-rose-500/20 scale-[0.99]"
            : "border-border/70 hover:border-rose-500/50 bg-muted/15 hover:bg-muted/30 dark:bg-muted/10",
          (disabled || isUploading) && "opacity-60 cursor-not-allowed",
        )}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-2 py-1">
            <div className="p-2.5 rounded-full bg-rose-500/10 text-rose-500 animate-spin">
              <Loader2 className="h-5 w-5" />
            </div>
            <p className="text-xs font-semibold text-foreground">
              Uploading attachments ({uploadingCount} remaining)...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5 py-1">
            <div className="p-2.5 rounded-xl bg-muted/60 text-muted-foreground group-hover:bg-rose-500/10 group-hover:text-rose-500 transition-colors">
              <Upload className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-foreground">
                <span className="text-rose-600 dark:text-rose-400 hover:underline">
                  Click to upload
                </span>{" "}
                or drag & drop
              </p>
              <p className="text-[11px] text-muted-foreground">
                Receipts, Invoices, Payment Slips (PNG, JPG, PDF up to 3MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Uploaded Items List */}
      {value.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {value.map((url, index) => {
            const resolved = getFileUrl(url);
            const isImg = looksLikeImage(resolved);
            const fileName = url.split("/").pop() || `Attachment ${index + 1}`;
            const ext = fileName.split(".").pop()?.toUpperCase() || (isImg ? "IMG" : "DOC");

            return (
              <div
                key={`${url}-${index}`}
                className="group relative rounded-xl border border-border/80 bg-card p-2.5 flex items-center gap-3 transition-all hover:shadow-sm hover:border-border"
              >
                {/* Icon / Thumbnail */}
                {isImg ? (
                  <div className="relative h-11 w-11 shrink-0 rounded-lg overflow-hidden border border-border/60 bg-muted/40 group-hover:opacity-90">
                    <img
                      src={resolved}
                      alt={fileName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-11 w-11 shrink-0 rounded-lg bg-rose-500/10 text-rose-500 dark:bg-rose-500/20 flex flex-col items-center justify-center border border-rose-500/20">
                    <FileText className="h-4 w-4" />
                    <span className="text-[9px] font-bold mt-0.5 tracking-wider">{ext}</span>
                  </div>
                )}

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <a
                    href={resolved}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="truncate block text-xs font-semibold text-foreground hover:text-rose-600 dark:hover:text-rose-400 transition-colors flex items-center gap-1"
                    title={fileName}
                  >
                    <span className="truncate">{fileName}</span>
                    <ExternalLink className="h-3 w-3 shrink-0 opacity-50" />
                  </a>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="inline-block text-[10px] font-medium text-muted-foreground uppercase">
                      {isImg ? "Image Attachment" : `${ext} Document`}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(index);
                    }}
                    disabled={disabled || isUploading}
                    title="Remove attachment"
                    className="h-8 w-8 rounded-lg shrink-0 flex items-center justify-center text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export const FileAttachmentsInput = ExpenseAttachmentsInput;
