import { useEffect, useState } from "react";
import { MessageSquare, Send, CheckCircle2, Clock, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AppButton } from "@/components/common/AppButton";
import { AppInput } from "@/components/common/AppInput";
import { useSendContributionSlipWhatsApp } from "@/api/contribution/useContributions";
import { contributionAmountValue } from "@/lib/contributionFormat";
import { isValidPhone, sanitizePhone } from "@/lib/phone";
import type { ContributionListItem } from "@/types/Types";

interface SendSlipWhatsAppDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contribution: ContributionListItem | null;
}

export function SendSlipWhatsAppDialog({
  open,
  onOpenChange,
  contribution,
}: SendSlipWhatsAppDialogProps) {
  const initialPhone = contribution?.contributor?.phoneNumber
    ? sanitizePhone(contribution.contributor.phoneNumber)
    : "";
  const [phone, setPhone] = useState(initialPhone);
  const [phoneError, setPhoneError] = useState("");

  const sendWhatsAppMutation = useSendContributionSlipWhatsApp();

  useEffect(() => {
    if (open && contribution) {
      setPhone(
        contribution.contributor?.phoneNumber
          ? sanitizePhone(contribution.contributor.phoneNumber)
          : "",
      );
      setPhoneError("");
    }
  }, [open, contribution]);

  if (!contribution) return null;

  const isMoney = contribution.type === "MONEY";
  const amount = contributionAmountValue(contribution);
  const amountLabel = isMoney
    ? `₹${amount.toLocaleString("en-IN")}`
    : `${contribution.itemName || "Item"} × ${contribution.quantity || 1}`;

  const wasSent = Boolean(contribution.slipWhatsAppSent);
  const sentAtFormatted = contribution.slipWhatsAppSentAt
    ? new Date(contribution.slipWhatsAppSentAt).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const handleSend = () => {
    const cleanPhone = sanitizePhone(phone);
    if (!cleanPhone) {
      setPhoneError("WhatsApp mobile number is required");
      return;
    }
    if (!isValidPhone(cleanPhone)) {
      setPhoneError("Please enter a valid 10-digit mobile number");
      return;
    }

    sendWhatsAppMutation.mutate(
      {
        id: contribution._id,
        phone: cleanPhone,
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
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <MessageSquare className="h-4 w-4" />
            </div>
            {wasSent ? "Resend Receipt via WhatsApp" : "Send Receipt via WhatsApp"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Deliver the verified contribution receipt PDF directly to the contributor's WhatsApp number.
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
                <p className="font-semibold">Previously Delivered on WhatsApp</p>
                <p className="text-muted-foreground text-[11px] mt-0.5">
                  Sent to <strong className="text-foreground">+{contribution.slipWhatsAppRecipient || "contributor"}</strong> on {sentAtFormatted}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/20 p-2.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              <span>Receipt slip has not been sent via WhatsApp yet.</span>
            </div>
          )}

          {/* Phone Input Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              WhatsApp Mobile Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-xs font-semibold text-muted-foreground select-none">
                +91
              </span>
              <AppInput
                type="tel"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => {
                  setPhone(sanitizePhone(e.target.value));
                  if (phoneError) setPhoneError("");
                }}
                className="pl-11"
                aria-invalid={!!phoneError}
                maxLength={10}
                disabled={sendWhatsAppMutation.isPending}
              />
            </div>
            {phoneError && (
              <p className="text-[11px] font-medium text-rose-500">{phoneError}</p>
            )}
            <p className="text-[11px] text-muted-foreground">
              The contributor will receive an instant WhatsApp message with their official PDF slip and receipt details.
            </p>
          </div>
        </div>

        {/* Dialog Actions */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <AppButton
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={sendWhatsAppMutation.isPending}
            className="h-9 text-xs"
          >
            Cancel
          </AppButton>
          <AppButton
            onClick={handleSend}
            loading={sendWhatsAppMutation.isPending}
            leftIcon={<Send className="h-3.5 w-3.5" />}
            className="h-9 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {wasSent ? "Resend to WhatsApp" : "Send to WhatsApp"}
          </AppButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
