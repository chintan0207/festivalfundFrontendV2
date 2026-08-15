import { Share2, ExternalLink, Copy } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppButton } from "./AppButton";

interface PublicVerificationShareProps {
  /** Primary lookup identifier. Highest priority when building the share link. */
  lookupKey?: string | null;
  phone?: string | null;
  email?: string | null;
  align?: "start" | "end";
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    textarea.remove();
    return ok;
  }
}

/**
 * Org-facing button that produces a public `/contributor-lookup` link for a
 * contributor. Link priority: lookupKey (contributor key) > phone > email.
 */
export function PublicVerificationShare({
  lookupKey,
  phone,
  email,
  align = "end",
}: PublicVerificationShareProps) {
  const key = lookupKey?.trim();
  const phoneValue = phone?.trim();
  const emailValue = email?.trim();

  const params = new URLSearchParams();
  if (key) params.set("key", key);
  else if (phoneValue) params.set("phone", phoneValue);
  else if (emailValue) params.set("email", emailValue);
  const query = params.toString();
  const url = query ? `${window.location.origin}/contributor-lookup?${query}` : null;

  if (!url) return null;

  const openVerificationPage = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const copyLink = async () => {
    const ok = await copyText(url);
    if (ok) toast.success("Verification link copied");
    else toast.error("Could not copy the link");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <AppButton
          type="button"
          variant="outline"
          leftIcon={<Share2 className="h-3.5 w-3.5" />}
          className="h-8 text-xs rounded-full"
          aria-label="Share verification link"
          title="Share verification link"
        >
          <span className="hidden sm:inline">Share</span>
        </AppButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-48 rounded-xl p-1.5">
        <DropdownMenuItem
          onSelect={openVerificationPage}
          className="text-xs font-medium px-2.5 py-2 rounded-lg cursor-pointer"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open verification page
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={copyLink}
          className="text-xs font-medium px-2.5 py-2 rounded-lg cursor-pointer"
        >
          <Copy className="h-3.5 w-3.5" />
          Copy link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}