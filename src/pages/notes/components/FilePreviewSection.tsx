import { useState } from "react";
import {
  FileText,
  ExternalLink,
  Download,
  X,
  Image as ImageIcon,
  FileCheck,
  Eye,
} from "lucide-react";
import { getFileUrl, looksLikeImage, looksLikePdf, getFileNameFromUrl } from "@/lib/utils";

interface FilePreviewSectionProps {
  urls: string[];
  onRemoveUrl?: (url: string) => void;
  isEditing?: boolean;
}

export function FilePreviewSection({
  urls = [],
  onRemoveUrl,
  isEditing = false,
}: FilePreviewSectionProps) {
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  if (!urls || urls.length === 0) return null;

  const uniqueUrls = Array.from(new Set(urls)).filter(Boolean);

  const images = uniqueUrls.filter((url) => looksLikeImage(url));
  const pdfs = uniqueUrls.filter((url) => looksLikePdf(url));
  const otherFiles = uniqueUrls.filter(
    (url) => !looksLikeImage(url) && !looksLikePdf(url),
  );

  return (
    <div className="space-y-5 pt-3">
      {/* 1. Photos & Images Section */}
      {images.length > 0 && (
        <div className="space-y-2.5">
          <h4 className="text-xs font-semibold text-foreground flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ImageIcon className="h-4 w-4 text-primary" /> Photos ({images.length})
            </span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {images.map((url, idx) => {
              const resolved = getFileUrl(url);
              const fileName = getFileNameFromUrl(url, `Photo ${idx + 1}`);
              return (
                <div
                  key={idx}
                  className="relative group h-28 sm:h-32 rounded-2xl overflow-hidden border border-border/70 bg-muted cursor-pointer hover:shadow-md transition-all"
                  onClick={() => !isEditing && setLightboxUrl(resolved)}
                >
                  <img
                    src={resolved}
                    alt={fileName}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {!isEditing && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1">
                      <Eye className="h-4 w-4" /> Expand
                    </div>
                  )}
                  {isEditing && onRemoveUrl && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveUrl(url);
                      }}
                      className="absolute top-1.5 right-1.5 bg-black/70 text-white rounded-full p-1 hover:bg-rose-600 transition-colors cursor-pointer"
                      title="Remove image"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. PDF Previewers Section */}
      {pdfs.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-rose-500" /> Files & PDF Preview ({pdfs.length})
          </h4>

          <div className="space-y-3">
            {pdfs.map((url, idx) => {
              const resolved = getFileUrl(url);
              const fileName = getFileNameFromUrl(url, `Document_${idx + 1}.pdf`);

              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border/80 bg-card p-3 sm:p-4 shadow-2xs space-y-2.5 relative group"
                >
                  {/* Remove button in Edit mode */}
                  {isEditing && onRemoveUrl && (
                    <button
                      type="button"
                      onClick={() => onRemoveUrl(url)}
                      className="absolute top-3 right-3 bg-rose-500/10 text-rose-600 hover:bg-rose-600 hover:text-white p-1.5 rounded-lg transition-colors cursor-pointer z-10"
                      title="Remove PDF"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}

                  {/* Inline Embedded PDF Viewport */}
                  <div className="relative w-full h-56 sm:h-80 rounded-xl overflow-hidden border border-border/60 bg-muted/30 flex flex-col items-center justify-center">
                    <object
                      data={resolved}
                      type="application/pdf"
                      className="w-full h-full rounded-xl"
                    >
                      <iframe
                        src={resolved}
                        title={fileName}
                        className="w-full h-full border-none rounded-xl"
                      >
                        <div className="p-4 text-center text-xs text-muted-foreground space-y-2">
                          <FileText className="h-8 w-8 text-rose-500 mx-auto" />
                          <p>Inline PDF preview unavailable directly in this browser.</p>
                          <a
                            href={resolved}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary font-semibold hover:underline"
                          >
                            <ExternalLink className="h-3.5 w-3.5" /> Open PDF Document
                          </a>
                        </div>
                      </iframe>
                    </object>
                  </div>

                  {/* PDF Document Metadata & Actions Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-border/50 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-7 w-7 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                        <FileText className="h-4 w-4" />
                      </div>
                      <span className="font-semibold text-foreground truncate max-w-xs" title={fileName}>
                        {fileName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={resolved}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl border border-border/80 bg-background text-foreground hover:bg-muted/60 transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5 text-primary" /> Open
                      </a>
                      <a
                        href={resolved}
                        download={fileName}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        <Download className="h-3.5 w-3.5" /> Download
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Other File Attachments Section */}
      {otherFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <FileCheck className="h-4 w-4 text-primary" /> Other Attachments ({otherFiles.length})
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {otherFiles.map((url, idx) => {
              const resolved = getFileUrl(url);
              const fileName = getFileNameFromUrl(url, `File_${idx + 1}`);
              const ext = fileName.split(".").pop()?.toUpperCase() || "DOC";

              return (
                <div
                  key={idx}
                  className="rounded-xl border border-border/70 bg-card p-3 flex items-center justify-between gap-3 text-xs shadow-2xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-[10px]">
                      {ext}
                    </div>
                    <span className="font-medium text-foreground truncate" title={fileName}>
                      {fileName}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <a
                      href={resolved}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="Open file"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <a
                      href={resolved}
                      download={fileName}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                      title="Download file"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </a>
                    {isEditing && onRemoveUrl && (
                      <button
                        type="button"
                        onClick={() => onRemoveUrl(url)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove file"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setLightboxUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl">
            <img src={lightboxUrl} alt="Enlarged photo view" className="max-h-[85vh] w-auto object-contain rounded-2xl" />
            <button
              type="button"
              onClick={() => setLightboxUrl(null)}
              className="absolute top-3 right-3 bg-black/70 text-white rounded-full p-2 hover:bg-rose-600 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
