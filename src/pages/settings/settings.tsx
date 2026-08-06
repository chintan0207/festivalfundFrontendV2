import { useState } from "react";
import { useFestivalApiStore } from "@/api/festival/festival.store";
import { useFestivals } from "@/api/festival/useFestivals";
import { AppButton } from "@/components/common/AppButton";
import { AppSelect } from "@/components/common/AppSelect";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Building,
  Sliders,
  CreditCard,
  Users,
  CheckCircle,
} from "lucide-react";

export const SettingsPage = () => {
  const { data: festivals = [] } = useFestivals();
  const { activeFestivalId, isAllFestivals, setActiveFestivalId, setActiveFestivalAll } =
    useFestivalApiStore();

  const [orgName, setOrgName] = useState("Shri Ganesh Temple Trust");
  const [currency, setCurrency] = useState("INR (₹)");
  const [receiptPrefix, setReceiptPrefix] = useState("REC-2026-");
  const [voucherPrefix, setVoucherPrefix] = useState("EXP-2026-");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Organization Settings
            </h1>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              Pro Plan
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Configure organization profile, default active festival, receipt numbering, and team roles.
          </p>
        </div>

        {isSaved && (
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
            <CheckCircle className="h-4 w-4" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ORGANIZATION PROFILE CARD */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Building className="h-5 w-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">Organization Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="grid gap-1.5">
              <Label htmlFor="orgName">Organization / Trust Name</Label>
              <Input
                id="orgName"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="curr">Base Currency</Label>
              <Input id="curr" value={currency} onChange={(e) => setCurrency(e.target.value)} />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="plan">Subscription Plan</Label>
              <Input id="plan" value="PRO PLAN — 10 Festivals / Year" disabled className="bg-muted/50" />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="reg">Registration / Trust ID</Label>
              <Input id="reg" value="TRUST-2024-8849" disabled className="bg-muted/50" />
            </div>
          </div>
        </div>

        {/* DEFAULT FESTIVAL SELECTION */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Sliders className="h-5 w-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">Active Festival Context</h2>
          </div>

          <div className="space-y-3 text-xs">
            <AppSelect
              id="activeSelect"
              label="Select Default Active Festival"
              value={isAllFestivals ? "ALL" : activeFestivalId || ""}
              onChange={(val) => {
                if (val === "ALL") {
                  setActiveFestivalAll();
                } else {
                  setActiveFestivalId(val);
                }
              }}
              options={[
                { value: "ALL", label: "All Festivals (Combined Overview)" },
                ...festivals.map((f) => ({
                  value: f._id,
                  label: `${f.name} (${f.year}) — ${f.status}`,
                })),
              ]}
            />
            </div>
            <p className="text-2xs text-muted-foreground">
              This setting updates the active festival context across the entire application workspace.
            </p>
          </div>

        {/* RECEIPT NUMBERING PREFIXES */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <CreditCard className="h-5 w-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">Receipt & Voucher Configuration</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="grid gap-1.5">
              <Label htmlFor="rPref">Contribution Receipt Prefix</Label>
              <Input
                id="rPref"
                value={receiptPrefix}
                onChange={(e) => setReceiptPrefix(e.target.value)}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="vPref">Expense Voucher Prefix</Label>
              <Input
                id="vPref"
                value={voucherPrefix}
                onChange={(e) => setVoucherPrefix(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* TEAM MEMBERS & ACCESS CONTROL */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-base font-bold text-foreground">Team Members & Access</h2>
            </div>
            <Badge variant="outline" className="text-2xs">
              2 Active Admins
            </Badge>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center">
                  R
                </div>
                <div>
                  <p className="font-bold text-foreground">Rajesh Patel</p>
                  <p className="text-2xs text-muted-foreground">admin@festivalfund.org</p>
                </div>
              </div>
              <Badge className="bg-primary text-primary-foreground text-2xs">Org Admin</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-500/20 text-emerald-600 font-bold flex items-center justify-center">
                  A
                </div>
                <div>
                  <p className="font-bold text-foreground">Anit Sharma</p>
                  <p className="text-2xs text-muted-foreground">treasurer@festivalfund.org</p>
                </div>
              </div>
              <Badge variant="outline" className="text-2xs border-emerald-500/30 text-emerald-600">
                Treasurer
              </Badge>
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end">
          <AppButton type="submit" size="lg" className="rounded-xl px-8 shadow-md">
            Save Preferences
          </AppButton>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
