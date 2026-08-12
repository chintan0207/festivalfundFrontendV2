import { useEffect, useRef, useState } from "react";
import { ExternalLink, ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { cn, getFileUrl } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { AppButton } from "./AppButton";
import { useUploadFile } from "@/api/upload/useUpload";
import { UploadService } from "@/api/upload/upload.service";

export interface BannerUploaderProps {
  value?: string | null;
  onChange?: (url: string | null) => void;
  label?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
}

/** Image picker that uploads to the generic /upload/single endpoint and emits the persisted URL. */
export function BannerUploader({
  value,
  onChange,
  label = "Banner Image",
  hint,
  error,
  disabled,
  className,
  containerClassName,
}: BannerUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const upload = useUploadFile();

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = (file?: File | null) => {
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      toast.error(`File "${file.name}" exceeds the maximum allowed size of 3 MB.`);
      return;
    }
    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    upload.mutate(
      { file, folder: "festivals" },
      {
        onSuccess: (result) => {
          setPreview(null);
          onChange?.(result.url);
        },
        onError: () => setPreview(null),
      },
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !upload.isPending) {
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
    if (!disabled && !upload.isPending && e.dataTransfer.files?.[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const display = preview || value;
  const busy = upload.isPending;
  const resolvedDisplay = display ? getFileUrl(display) : null;

  return (
    <div className={cn("space-y-2.5 w-full", containerClassName)}>
      {/* Label */}
      {label && (
        <Label className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-1.5">
          <div className="p-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 dark:bg-amber-500/20">
            <ImagePlus className="h-3.5 w-3.5" />
          </div>
          <span>{label}</span>
        </Label>
      )}

      {/* Upload Zone or Preview */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative overflow-hidden rounded-2xl border-2 transition-all",
          display ? "border-border/70 bg-card" : "border-dashed",
          isDragOver
            ? "border-amber-500 bg-amber-500/10 dark:bg-amber-500/20 scale-[0.99]"
            : !display &&
                "border-border/70 hover:border-amber-500/50 bg-muted/15 hover:bg-muted/30 dark:bg-muted/10",
          className,
        )}
      >
        {resolvedDisplay ? (
          <div className="relative h-40 sm:h-48 w-full group">
            <img
              src={resolvedDisplay}
              alt="Festival banner preview"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3">
              <AppButton
                type="button"
                size="sm"
                variant="secondary"
                leftIcon={!busy ? <Upload className="h-3.5 w-3.5" /> : undefined}
                loading={busy}
                disabled={disabled || busy}
                onClick={() => inputRef.current?.click()}
                className="bg-white/90 text-zinc-900 hover:bg-white dark:bg-zinc-900/90 dark:text-zinc-100 dark:hover:bg-zinc-900"
              >
                Replace Banner
              </AppButton>
              <a
                href={resolvedDisplay}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 h-8 px-3 rounded-lg text-xs font-semibold bg-white/90 text-zinc-900 hover:bg-white dark:bg-zinc-900/90 dark:text-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                View
              </a>
              {!disabled && (
                <AppButton
                  type="button"
                  size="sm"
                  variant="secondary"
                  leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                  disabled={busy}
                  className="bg-rose-500/90 text-white hover:bg-rose-600 border-none"
                  onClick={() => {
                    if (value) {
                      UploadService.deleteFile(value).catch(() => {});
                    }
                    setPreview(null);
                    onChange?.(null);
                  }}
                >
                  Remove
                </AppButton>
              )}
            </div>
          </div>
        ) : (
          <div
            onClick={() => !disabled && !busy && inputRef.current?.click()}
            className={cn(
              "flex h-40 sm:h-44 w-full flex-col items-center justify-center gap-2 text-center p-4 cursor-pointer transition-colors",
              (disabled || busy) && "opacity-60 cursor-not-allowed",
            )}
          >
            {busy ? (
              <div className="flex flex-col items-center gap-2">
                <div className="p-2.5 rounded-full bg-amber-500/10 text-amber-500 animate-spin">
                  <Loader2 className="h-6 w-6" />
                </div>
                <p className="text-xs font-semibold text-foreground">
                  Uploading banner image...
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5">
                <div className="p-2.5 rounded-xl bg-muted/60 text-muted-foreground group-hover:bg-amber-500/10 group-hover:text-amber-500 transition-colors">
                  <Upload className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-foreground">
                    <span className="text-amber-600 dark:text-amber-400 hover:underline">
                      Click to upload banner
                    </span>{" "}
                    or drag & drop
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    JPG, PNG, WebP, SVG · up to 3 MB
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        className="hidden"
        disabled={disabled || busy}
        onChange={(e) => {
          handleFileChange(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {error ? (
        <p className="text-[11px] sm:text-xs font-medium text-destructive leading-tight">
          {error}
        </p>
      ) : hint ? (
        <p className="text-[11px] sm:text-xs text-muted-foreground leading-tight">
          {hint}
        </p>
      ) : null}
    </div>
  );
}