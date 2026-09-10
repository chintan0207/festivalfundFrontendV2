import { useEffect, useState } from "react";
import { Mail, Send, CheckCircle2, Clock, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AppButton } from "@/components/common/AppButton";
import { AppInput } from "@/components/common/AppInput";
import { useSendContributionSlipEmail } from "@/api/contribution/useContributions";
import { contributionAmountValue } from "@/lib/contributionFormat";
import type { ContributionListItem } from "@/types/Types";

interface SendSlipEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contribution: ContributionListItem | null;
}

export function SendSlipEmailDialog({
  open,
  onOpenChange,
  contribution,
}: SendSlipEmailDialogProps) {
  const defaultEmail = contribution?.contributor?.email || "";
  const [email, setEmail] = useState(defaultEmail);
  const [emailError, setEmailError] = useState("");

  const sendSlipMutation = useSendContributionSlipEmail();

  useEffect(() => {
    if (open && contribution) {
      setEmail(contribution.contributor?.email || "");
      setEmailError("");
    }
  }, [open, contribution]);

  if (!contribution) return null;

  const isMoney = contribution.type === "MONEY";
  const amount = contributionAmountValue(contribution);
  const amountLabel = isMoney
    ? `₹${amount.toLocaleString("en-IN")}`
    : `${contribution.itemName || "Item"} × ${contribution.quantity || 1}`;

  const wasSent = Boolean(contribution.slipEmailSent);
  const sentAtFormatted = contribution.slipEmailSentAt
    ? new Date(contribution.slipEmailSentAt).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const validateEmail = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) {
      return "Recipient email is required";
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(trimmed)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const handleSend = () => {
    const err = validateEmail(email);
    if (err) {
      setEmailError(err);
      return;
    }

    sendSlipMutation.mutate(
      {
        id: contribution._id,
        email: email.trim().toLowerCase(),
        force: true,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Mail className="h-4 w-4" />
            </div>
            {wasSent ? "Resend Contribution Receipt" : "Email Contribution Receipt"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Deliver the official receipt slip with attached PDF directly to the contributor.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Summary Card */}
          <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <FileText className="h-3.5 w-3.5" />
                Receipt #{contribution.contributionCode}
              </span>
              <span className="font-semibold text-foreground">{amountLabel}</span>
            </div>
            <div className="flex items-center justify-between text-xs border-t border-border/50 pt-2">
              <span className="text-muted-foreground">Contributor:</span>
              <span className="font-medium text-foreground">
                {contribution.contributor?.name || "Anonymous Contributor"}
              </span>
            </div>
          </div>

          {/* Previous Delivery History Badge */}
          {wasSent ? (
            <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Previously Delivered</p>
                <p className="text-muted-foreground text-[11px] mt-0.5">
                  Sent to <strong className="text-foreground">{contribution.slipEmailRecipient || "contributor"}</strong> on {sentAtFormatted}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/20 p-2.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              <span>Receipt slip has not been emailed yet.</span>
            </div>
          )}

          {/* Email Input Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Recipient Email Address <span className="text-rose-500">*</span>
            </label>
            <AppInput
              type="email"
              placeholder="e.g. contributor@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
              leftIcon={<Mail className="h-4 w-4" />}
              aria-invalid={!!emailError}
              disabled={sendSlipMutation.isPending}
            />
            {emailError && (
              <p className="text-[11px] font-medium text-rose-500">{emailError}</p>
            )}
            <p className="text-[11px] text-muted-foreground">
              The contributor will receive an email with their verified contribution receipt and official PDF slip attached.
            </p>
          </div>
        </div>

        {/* Dialog Actions */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <AppButton
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={sendSlipMutation.isPending}
            className="h-9 text-xs"
          >
            Cancel
          </AppButton>
          <AppButton
            onClick={handleSend}
            loading={sendSlipMutation.isPending}
            leftIcon={<Send className="h-3.5 w-3.5" />}
            className="h-9 text-xs"
          >
            {wasSent ? "Resend Slip" : "Send Receipt Slip"}
          </AppButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
