import { FileText, Paperclip } from "lucide-react";
import { cn, getFileUrl } from "@/lib/utils";
import type { Expense } from "@/types/Types";

const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp", ".avif"];

function looksLikeImage(url: string): boolean {
  try {
    const path = new URL(url, "http://localhost").pathname.toLowerCase();
    return IMAGE_EXT.some((ext) => path.endsWith(ext));
  } catch {
    return /\.(jpe?g|png|gif|webp|svg|bmp|avif)([?#].*)?$/i.test(url);
  }
}

export function ExpenseAttachments({ expense }: { expense: Expense }) {
  const attachments = expense.attachments ?? [];

  if (attachments.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-card border border-border/80 shadow-sm">
      <div className="flex items-center gap-2 border-b border-border/60 px-3.5 sm:px-5 py-3">
        <Paperclip className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-sm font-bold text-foreground">
          Attachments ({attachments.length})
        </h2>
      </div>

      <div className="p-3.5 sm:p-5 grid grid-cols-2 min-[460px]:grid-cols-3 sm:grid-cols-4 gap-3">
        {attachments.map((url, index) => {
          const resolvedUrl = getFileUrl(url);
          const isImg = looksLikeImage(resolvedUrl);

          return isImg ? (
            <a
              key={index}
              href={resolvedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group relative aspect-square rounded-xl overflow-hidden border border-border/80 bg-muted/30",
                "hover:shadow-md hover:border-primary/40 transition-all",
              )}
              title={url}
            >
              <img
                src={resolvedUrl}
                alt={`Attachment ${index + 1}`}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2 pb-1 pt-4 text-[10px] font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity truncate">
                Open
              </span>
            </a>
          ) : (
            <a
              key={index}
              href={resolvedUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={url}
              className={cn(
                "flex items-center gap-2 rounded-xl border border-border/80 bg-muted/30 px-3 py-2.5",
                "hover:shadow-md hover:border-primary/40 transition-all",
              )}
            >
              <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="min-w-0 flex-1 truncate text-xs font-medium text-foreground">
                {url.split("/").pop() || "File"}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
