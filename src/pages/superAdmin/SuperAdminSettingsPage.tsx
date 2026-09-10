import { useState, useEffect } from "react";
import { PageContainer } from "@/components/common/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { AppCard } from "@/components/common/AppCard";
import { AppButton } from "@/components/common/AppButton";
import { AppInput } from "@/components/common/AppInput";
import { AppTextArea } from "@/components/common/AppTextArea";
import {
  useSuperAdminSettings,
  useUpdateSuperAdminSetting,
} from "@/api/superAdmin/useSuperAdmin";
import { Settings, Bell, Wrench } from "lucide-react";

export const SuperAdminSettingsPage = () => {
  const { data: settings = [] } = useSuperAdminSettings();
  const updateSettingMutation = useUpdateSuperAdminSetting();

  const [supportEmail, setSupportEmail] = useState("support@festivalfund.in");
  const [announcement, setAnnouncement] = useState("");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowSignups, setAllowSignups] = useState(true);

  useEffect(() => {
    if (settings.length > 0) {
      const emailSetting = settings.find((s: any) => s.key === "support_email");
      if (emailSetting) setSupportEmail(emailSetting.value);

      const annSetting = settings.find((s: any) => s.key === "platform_announcement");
      if (annSetting) setAnnouncement(annSetting.value || "");

      const maintSetting = settings.find((s: any) => s.key === "maintenance_mode");
      if (maintSetting) setMaintenanceMode(Boolean(maintSetting.value));

      const signupSetting = settings.find((s: any) => s.key === "allow_signups");
      if (signupSetting) setAllowSignups(Boolean(signupSetting.value));
    }
  }, [settings]);

  const handleSaveSetting = async (key: string, value: any, description: string) => {
    await updateSettingMutation.mutateAsync({
      key,
      value,
      description,
    });
  };

  return (
    <PageContainer variant="list">
      <PageHeader
        title="Platform Settings"
        description="Configure system-wide parameters, maintenance toggles, and global announcements."
        module="settings"
      />

      <div className="max-w-3xl space-y-4">
        {/* PLATFORM CONTACT & SUPPORT */}
        <AppCard
          icon={<Settings className="h-4 w-4 text-primary" />}
          title="Contact & Identity"
          subtitle="Primary platform support contact displayed on receipts and invitations"
          compact
        >
          <div className="space-y-3 text-xs">
            <AppInput
              id="supportEmail"
              label="Primary Platform Support Email"
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              hint="Shown in help centers, notification footers, and invitation emails."
            />
            <div className="flex justify-end pt-1">
              <AppButton
                size="sm"
                loading={updateSettingMutation.isPending}
                onClick={() =>
                  handleSaveSetting("support_email", supportEmail, "Primary platform support email")
                }
              >
                Save Contact
              </AppButton>
            </div>
          </div>
        </AppCard>

        {/* GLOBAL ANNOUNCEMENT BANNER */}
        <AppCard
          icon={<Bell className="h-4 w-4 text-amber-500" />}
          title="Global Platform Announcement"
          subtitle="Broadcast announcement message shown across all tenant dashboards"
          compact
        >
          <div className="space-y-3 text-xs">
            <AppTextArea
              id="announcement"
              label="Broadcast Banner Text"
              placeholder="e.g. Scheduled system upgrade this Sunday between 2:00 AM - 4:00 AM IST..."
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              rows={2}
              hint="Leave blank to disable the announcement bar across all tenant dashboards."
            />
            <div className="flex justify-end gap-2 pt-1">
              {announcement && (
                <AppButton
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setAnnouncement("");
                    handleSaveSetting("platform_announcement", "", "Cleared broadcast banner");
                  }}
                >
                  Clear Banner
                </AppButton>
              )}
              <AppButton
                size="sm"
                loading={updateSettingMutation.isPending}
                onClick={() =>
                  handleSaveSetting(
                    "platform_announcement",
                    announcement,
                    "Updated broadcast announcement banner",
                  )
                }
              >
                Publish Announcement
              </AppButton>
            </div>
          </div>
        </AppCard>

        {/* AVAILABILITY & MAINTENANCE */}
        <AppCard
          icon={<Wrench className="h-4 w-4 text-rose-500" />}
          title="System Governance"
          subtitle="Platform registration controls and global maintenance mode"
          compact
        >
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border">
              <div>
                <span className="font-semibold block text-foreground">Allow New Mandal Registrations</span>
                <span className="text-2xs text-muted-foreground">
                  When disabled, the public `/signup` route displays an invitation-only message.
                </span>
              </div>
              <AppButton
                type="button"
                variant={allowSignups ? "outline" : "destructive"}
                size="sm"
                onClick={() => {
                  const next = !allowSignups;
                  setAllowSignups(next);
                  handleSaveSetting("allow_signups", next, "Toggled new organization registrations");
                }}
              >
                {allowSignups ? "Open" : "Paused"}
              </AppButton>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border">
              <div>
                <span className="font-semibold block text-foreground">Maintenance Mode</span>
                <span className="text-2xs text-muted-foreground">
                  Locks tenant dashboards for non-super-admins during database maintenance.
                </span>
              </div>
              <AppButton
                type="button"
                variant={maintenanceMode ? "destructive" : "outline"}
                size="sm"
                onClick={() => {
                  const next = !maintenanceMode;
                  setMaintenanceMode(next);
                  handleSaveSetting("maintenance_mode", next, "Toggled platform maintenance mode");
                }}
              >
                {maintenanceMode ? "Enabled" : "Disabled"}
              </AppButton>
            </div>
          </div>
        </AppCard>
      </div>
    </PageContainer>
  );
};

export default SuperAdminSettingsPage;
