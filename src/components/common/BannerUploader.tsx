import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
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

/** Image picker that uploads to the generic /uploads/single endpoint and emits the persisted URL. */
export function BannerUploader({
  value,
  onChange,
  label,
  hint,
  error,
  disabled,
  className,
  containerClassName,
}: BannerUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
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

  const display = preview || value;
  const busy = upload.isPending;

  return (
    <div className={cn("space-y-1.5 sm:space-y-2 w-full", containerClassName)}>
      {label && (
        <Label className="text-xs sm:text-sm font-semibold text-foreground">
          {label}
        </Label>
      )}

      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-dashed border-border/80 bg-muted/20",
          className,
        )}
      >
        {display ? (
          <div className="relative h-36 sm:h-40 w-full">
            <img
              src={display}
              alt="Festival banner"
              className="h-full w-full object-cover"
            />
            {!disabled && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 p-3">
                <AppButton
                  type="button"
                  size="sm"
                  variant="secondary"
                  leftIcon={!busy ? <Upload className="h-3.5 w-3.5" /> : undefined}
                  loading={busy}
                  disabled={busy}
                  onClick={() => inputRef.current?.click()}
                >
                  Replace
                </AppButton>
                <AppButton
                  type="button"
                  size="sm"
                  variant="secondary"
                  leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                  disabled={busy}
                  className="text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-950"
                  onClick={() => {
                    if (value) {
                      UploadService.deleteFile(value).catch(() => {});
                    }
                    onChange?.(null);
                  }}
                >
                  Remove
                </AppButton>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled || busy}
            className={cn(
              "flex h-36 sm:h-40 w-full flex-col items-center justify-center gap-2 text-muted-foreground transition-colors cursor-pointer",
              "hover:text-foreground hover:bg-muted/40 disabled:cursor-not-allowed disabled:opacity-60",
            )}
          >
            {busy ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <ImagePlus className="h-6 w-6" />
            )}
            <span className="text-xs font-medium">
              {busy ? "Uploading banner..." : "Click to upload banner image"}
            </span>
            <span className="text-[11px] text-muted-foreground/70">
              JPG, PNG, WebP · up to 5 MB
            </span>
          </button>
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