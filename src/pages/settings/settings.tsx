import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/api/auth/auth.store";
import {
  useCreateOrgUser,
  useDeleteOrgUser,
  useOrganization,
  useOrgUsers,
  useUpdateOrgUser,
  useUpdateOrganization,
  useUploadOrgLogo,
  useCreateInvitation,
  useOrgInvitations,
  useRevokeInvitation,
  useResendInvitation,
} from "@/api/organization/useOrganization";
import { AppButton } from "@/components/common/AppButton";
import { AppInput } from "@/components/common/AppInput";
import { AppTextArea } from "@/components/common/AppTextArea";
import { AppSelect } from "@/components/common/AppSelect";
import { AppBadge } from "@/components/common/AppBadge";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { CardListSkeleton } from "@/components/common/CardListSkeleton";
import {
  TeamMemberFormDialog,
  type TeamMemberFormValues,
  type TeamMemberFormMode,
} from "@/pages/settings/components/TeamMemberFormDialog";
import { roleStyles } from "@/pages/settings/settingsRoleStyles";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  Sliders,
  CreditCard,
  Users,
  CheckCircle,
  Image as ImageIcon,
  Trash2,
  Pencil,
  Plus,
  Crown,
  Hash,
  Loader2,
  Send,
  Ban,
  RefreshCw,
  Mail,
} from "lucide-react";
import { useFestivalApiStore } from "@/api/festival/festival.store";
import { useFestivals } from "@/api/festival/useFestivals";
import { getModuleTheme, gradientColors } from "@/theme/colors";
import { cn, initials } from "@/lib/utils";
import type { Invitation, User } from "@/types/Types";

const planStyles: Record<string, string> = {
  FREE: "bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-300/40",
  STANDARD: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/20",
  PREMIUM: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
};

function avatarGradient(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) % 995;
  }
  return gradientColors[hash % gradientColors.length];
}

export const SettingsPage = () => {
  const { user } = useAuthStore();
  const orgId = user?.organizationId ?? "";
  const theme = getModuleTheme("settings");

  const { data: orgData, isLoading: orgLoading } = useOrganization(orgId);
  const { data: members = [], isLoading: membersLoading } = useOrgUsers(orgId);
  const { data: invitations = [], isLoading: invitationsLoading } =
    useOrgInvitations(orgId);
  const pendingInvitations = invitations.filter((inv) => inv.status === "PENDING");

  const profileOrg = orgData as (typeof orgData & { users?: User[] }) | undefined;

  // Profile form state
  const [orgName, setOrgName] = useState("");
  const [orgEmail, setOrgEmail] = useState("");
  const [orgPhone, setOrgPhone] = useState("");
  const [orgAddress, setOrgAddress] = useState("");
  const [orgDescription, setOrgDescription] = useState("");
  const [orgWebsite, setOrgWebsite] = useState("");
  const [orgCurrency, setOrgCurrency] = useState("INR");
  const [isSaved, setIsSaved] = useState(false);

  const [logoUploading, setLogoUploading] = useState(false);
  const [memberModal, setMemberModal] = useState<{
    open: boolean;
    mode: TeamMemberFormMode | "edit";
    member?: User | null;
  }>({ open: false, mode: "invite", member: null });
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<Invitation | null>(null);

  // Festival context (unchanged behavior)
  const { data } = useFestivals();
  const festivals = data?.festivals ?? [];
  const { activeFestivalId, isAllFestivals, setActiveFestivalId, setActiveFestivalAll } =
    useFestivalApiStore();

  useEffect(() => {
    if (profileOrg) {
      setOrgName(profileOrg.name ?? "");
      setOrgEmail(profileOrg.email ?? "");
      setOrgPhone(profileOrg.phone ?? "");
      setOrgAddress(profileOrg.address ?? "");
      setOrgDescription(profileOrg.description ?? "");
      setOrgWebsite(profileOrg.website ?? "");
      setOrgCurrency(profileOrg.currency ?? "INR");
    }
  }, [profileOrg]);

  const { mutateAsync: saveProfile, isPending: savingProfile } =
    useUpdateOrganization(orgId);
  const { mutateAsync: createMember, isPending: creatingMember } =
    useCreateOrgUser(orgId);
  const { mutateAsync: saveMember, isPending: updatingMember } = useUpdateOrgUser(orgId);
  const { mutateAsync: removeMember, isPending: removingMember } =
    useDeleteOrgUser(orgId);
  const { mutateAsync: uploadLogo, isPending: uploadingLogo } = useUploadOrgLogo(orgId);
  const { mutateAsync: sendInvite, isPending: sendingInvite } =
    useCreateInvitation(orgId);
  const { mutateAsync: revokeInvite, isPending: revokingInvite } =
    useRevokeInvitation(orgId);
  const { mutateAsync: resendInvite, isPending: resendingInvite } =
    useResendInvitation(orgId);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await saveProfile({
      name: orgName,
      email: orgEmail,
      phone: orgPhone || undefined,
      address: orgAddress || undefined,
      description: orgDescription || undefined,
      website: orgWebsite || undefined,
      currency: orgCurrency,
    });
    if (res) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const handleLogoChange = async (file: File | undefined) => {
    if (!file) return;
    setLogoUploading(true);
    try {
      await uploadLogo(file);
    } finally {
      setLogoUploading(false);
    }
  };

  const handleCreateMember = async (values: TeamMemberFormValues) => {
    if (memberModal.mode === "invite") {
      await sendInvite({ name: values.name, email: values.email, role: values.role });
    } else {
      await createMember({
        name: values.name,
        email: values.email,
        password: values.password || "",
        role: values.role,
        phoneNumber: values.phoneNumber,
      });
    }
    setMemberModal({ open: false, mode: "invite", member: null });
  };

  const handleUpdateMember = async (values: TeamMemberFormValues) => {
    if (!memberModal.member) return;
    await saveMember({ userId: memberModal.member._id, payload: values });
    setMemberModal({ open: false, mode: "invite", member: null });
  };

  const handleDeleteMember = async () => {
    if (!deleteTarget) return;
    await removeMember(deleteTarget._id);
    setDeleteTarget(null);
  };

  const handleRevokeInvite = async () => {
    if (!revokeTarget) return;
    await revokeInvite(revokeTarget._id);
    setRevokeTarget(null);
  };

  const handleResendInvite = async (inv: Invitation) => {
    await resendInvite(inv._id);
  };

  const currentUserIs = (m: User) => user?._id === m._id;

  return (
    <div className="space-y-6 pb-40 md:pb-12 max-w-4xl px-2 sm:px-0">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Organization Settings
            </h1>
            {profileOrg && (
              <AppBadge
                size="sm"
                className={planStyles[profileOrg.plan] || planStyles.FREE}
                icon={<Crown className="h-3 w-3" />}
              >
                {profileOrg.plan}
              </AppBadge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Configure organization profile, default active festival, and team access.
          </p>
        </div>

        {isSaved && (
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
            <CheckCircle className="h-4 w-4" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      {orgLoading ? (
        <CardListSkeleton count={3} />
      ) : (
        <>
          {/* ORGANIZATION PROFILE CARD */}
          <form
            onSubmit={handleSaveProfile}
            className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4"
          >
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Building className={`h-5 w-5 ${theme.iconColor}`} />
              <h2 className="text-base font-bold text-foreground">
                Organization Details
              </h2>
            </div>

            {/* Logo */}
            <div className="flex items-center gap-4">
              <div
                className={`h-16 w-16 rounded-2xl ${theme.gradient} flex items-center justify-center text-white text-xl font-bold overflow-hidden shrink-0`}
              >
                {profileOrg?.logoUrl ? (
                  <img
                    src={profileOrg.logoUrl}
                    alt={profileOrg?.name || "logo"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials(profileOrg?.name || "SG")
                )}
              </div>
              <div className="space-y-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleLogoChange(e.target.files?.[0])}
                />
                <AppButton
                  type="button"
                  variant="outline"
                  size="sm"
                  leftIcon={
                    logoUploading || uploadingLogo ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ImageIcon className="h-4 w-4" />
                    )
                  }
                  disabled={logoUploading || uploadingLogo || !orgId}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {logoUploading || uploadingLogo ? "Uploading..." : "Upload Logo"}
                </AppButton>
                {profileOrg?.logoUrl && (
                  <AppButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => saveProfile({ logoUrl: "" })}
                  >
                    Remove Logo
                  </AppButton>
                )}
                <p className="text-2xs text-muted-foreground">PNG or JPG, max 2MB</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <AppInput
                id="orgName"
                label="Organization / Trust Name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                required
              />
              <AppInput
                id="orgEmail"
                label="Organization Email"
                type="email"
                value={orgEmail}
                onChange={(e) => setOrgEmail(e.target.value)}
              />
              <AppInput
                id="orgPhone"
                label="Phone"
                inputMode="numeric"
                maxLength={10}
                value={orgPhone}
                onChange={(e) => setOrgPhone(e.target.value.replace(/[^0-9]/g, ""))}
              />
              <AppInput
                id="orgWebsite"
                label="Website"
                type="url"
                value={orgWebsite}
                onChange={(e) => setOrgWebsite(e.target.value)}
              />
              <div className="md:col-span-2">
                <AppTextArea
                  id="orgAddress"
                  label="Address"
                  rows={2}
                  value={orgAddress}
                  onChange={(e) => setOrgAddress(e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <AppTextArea
                  id="orgDesc"
                  label="Description"
                  rows={2}
                  value={orgDescription}
                  onChange={(e) => setOrgDescription(e.target.value)}
                />
              </div>
              <AppInput
                id="orgCurrency"
                label="Base Currency"
                value={orgCurrency}
                onChange={(e) => setOrgCurrency(e.target.value.toUpperCase())}
              />
            </div>

            <div className="flex justify-end">
              <AppButton
                type="submit"
                size="lg"
                className="px-8 shadow-md"
                loading={savingProfile}
                gradient={theme.gradient}
              >
                Save Profile
              </AppButton>
            </div>
          </form>

          {/* PLAN & LIMITS CARD */}
          <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <CreditCard className={`h-5 w-5 ${theme.iconColor}`} />
              <h2 className="text-base font-bold text-foreground">Plan & Limits</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-muted/40 border border-border">
                <p className="text-2xs text-muted-foreground mb-1">Subscription Plan</p>
                <AppBadge size="sm" className={planStyles[profileOrg?.plan || "FREE"]}>
                  {profileOrg?.plan || "FREE"}
                </AppBadge>
              </div>
              <div className="p-4 rounded-xl bg-muted/40 border border-border">
                <p className="text-2xs text-muted-foreground mb-1">Festivals / Year</p>
                <p className="text-lg font-bold text-foreground">
                  {profileOrg?.limits?.festivalsPerYear ?? "—"}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-muted/40 border border-border">
                <p className="text-2xs text-muted-foreground mb-1">Contributor Limit</p>
                <p className="text-lg font-bold text-foreground">
                  {profileOrg?.limits?.contributors?.toLocaleString() ?? "—"}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-muted/40 border border-border">
                <p className="text-2xs text-muted-foreground mb-1">Plan Expiry</p>
                <p className="text-lg font-bold text-foreground">
                  {profileOrg?.planExpiry
                    ? new Date(profileOrg.planExpiry).toLocaleDateString()
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* DEFAULT FESTIVAL SELECTION */}
          <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Sliders className={`h-5 w-5 ${theme.iconColor}`} />
              <h2 className="text-base font-bold text-foreground">
                Active Festival Context
              </h2>
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
              This setting updates the active festival context across the entire
              application workspace.
            </p>
          </div>

          {/* RECEIPT & VOUCHER SEQUENCES (read-only) */}
          <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Hash className={`h-5 w-5 ${theme.iconColor}`} />
              <h2 className="text-base font-bold text-foreground">Document Numbering</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {(["contributor", "receipt", "expense", "festival"] as const).map((key) => (
                <div
                  key={key}
                  className="p-4 rounded-xl bg-muted/40 border border-border"
                >
                  <p className="text-2xs text-muted-foreground capitalize mb-1">
                    {key} Counter
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    {profileOrg?.sequences?.[key] ?? "0"}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-2xs text-muted-foreground">
              Auto-generated sequential counters (CTR / CON / EXP / FES) are managed by
              the system.
            </p>
          </div>

          {/* TEAM MEMBERS & ACCESS */}
          <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
            <div className="flex flex-col gap-3 border-b border-border pb-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Users className={`h-5 w-5 ${theme.iconColor} shrink-0`} />
                <h2 className="text-base font-bold text-foreground">
                  Team Members & Access
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-2 w-full sm:w-auto sm:flex">
                <AppButton
                  variant="outline"
                  className="w-full sm:w-auto"
                  leftIcon={<Send className="h-4 w-4" />}
                  onClick={() =>
                    setMemberModal({ open: true, mode: "invite", member: null })
                  }
                >
                  Invite Member
                </AppButton>
                <AppButton
                  className="w-full sm:w-auto"
                  leftIcon={<Plus className="h-4 w-4" />}
                  gradient={theme.gradient}
                  onClick={() =>
                    setMemberModal({ open: true, mode: "create", member: null })
                  }
                >
                  Create Member
                </AppButton>
              </div>
            </div>

            {/* PENDING INVITATIONS */}
            {pendingInvitations.length > 0 && (
              <div className="space-y-2">
                <p className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Pending Invitations
                </p>
                {invitationsLoading ? (
                  <div className="space-y-2">
                    <div className="h-12 animate-pulse rounded-xl bg-muted/40" />
                  </div>
                ) : (
                  pendingInvitations.map((inv) => (
                    <div
                      key={inv._id}
                      className="flex items-center justify-between p-3 rounded-xl bg-amber-500/5 border border-amber-500/20"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-8 w-8 rounded-full bg-amber-500/15 text-amber-600 font-bold flex items-center justify-center shrink-0">
                          <Mail className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-foreground truncate">{inv.name}</p>
                          <p className="text-2xs text-muted-foreground truncate">
                            {inv.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge
                          variant="outline"
                          className="text-2xs border-amber-500/30 text-amber-600"
                        >
                          Pending
                        </Badge>
                        <AppButton
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          title="Resend invite"
                          loading={resendingInvite}
                          onClick={() => handleResendInvite(inv)}
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                        </AppButton>
                        <AppButton
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          title="Revoke invite"
                          onClick={() => setRevokeTarget(inv)}
                        >
                          <Ban className="h-3.5 w-3.5" />
                        </AppButton>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {membersLoading ? (
              <div className="space-y-3">
                <div className="h-14 animate-pulse rounded-xl bg-muted/40" />
                <div className="h-14 animate-pulse rounded-xl bg-muted/40" />
              </div>
            ) : members.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">
                No team members yet. Add the first member to get started.
              </p>
            ) : (
              <div className="space-y-3 text-xs">
                {members.map((m) => (
                  <div
                    key={m._id}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          "h-8 w-8 rounded-full font-bold flex items-center justify-center shrink-0 text-white",
                          avatarGradient(m.name),
                        )}
                      >
                        {initials(m.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-foreground truncate">{m.name}</p>
                        <p className="text-2xs text-muted-foreground truncate">
                          {m.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-2xs",
                          roleStyles[m.role] || roleStyles.ORG_VIEWER,
                        )}
                      >
                        {m.role.replace("_", " ")}
                      </Badge>
                      {!m.isActive && (
                        <Badge
                          variant="outline"
                          className="text-2xs border-rose-500/30 text-rose-500"
                        >
                          Inactive
                        </Badge>
                      )}
                      <div className="flex gap-1">
                        <AppButton
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            setMemberModal({ open: true, mode: "edit", member: m })
                          }
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </AppButton>
                        {!currentUserIs(m) && (
                          <AppButton
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive"
                            onClick={() => setDeleteTarget(m)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </AppButton>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Team member modal */}
      {memberModal.open && (
        <TeamMemberFormDialog
          key={memberModal.mode === "edit" ? memberModal.member?._id : "new"}
          mode={memberModal.mode === "edit" ? "create" : memberModal.mode}
          member={memberModal.member}
          loading={sendingInvite || creatingMember || updatingMember}
          gradient={theme.gradient}
          onClose={() => setMemberModal({ open: false, mode: "invite", member: null })}
          onSubmit={memberModal.mode === "edit" ? handleUpdateMember : handleCreateMember}
        />
      )}

      {/* Remove member confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Remove Team Member"
        description={`Remove ${deleteTarget?.name} from this organization? They will lose access to the workspace.`}
        confirmLabel="Remove"
        variant="danger"
        icon={<Trash2 className="h-5 w-5" />}
        loading={removingMember}
        onConfirm={handleDeleteMember}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Revoke invitation confirmation */}
      <ConfirmDialog
        open={!!revokeTarget}
        title="Revoke Invitation"
        description={`Revoke the invitation sent to ${revokeTarget?.email}? They will no longer be able to accept it.`}
        confirmLabel="Revoke"
        variant="danger"
        icon={<Ban className="h-5 w-5" />}
        loading={revokingInvite}
        onConfirm={handleRevokeInvite}
        onCancel={() => setRevokeTarget(null)}
      />
    </div>
  );
};

export default SettingsPage;
