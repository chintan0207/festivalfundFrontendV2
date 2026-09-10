import { useState } from "react";
import { PageContainer } from "@/components/common/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { PageFilterToolbar, type FilterTab, type QuickFilterGroup } from "@/components/common/PageFilterToolbar";
import { DataTable, type Column } from "@/components/common/DataTable";
import { DataTablePagination } from "@/components/common/DataTablePagination";
import { AppBadge } from "@/components/common/AppBadge";
import { AppButton } from "@/components/common/AppButton";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { FormDialog } from "@/components/common/FormDialog";
import { AppSelect } from "@/components/common/AppSelect";
import { AppTextArea } from "@/components/common/AppTextArea";
import {
  useSuperAdminOrgs,
  useSuperAdminOrgDetails,
  useUpdateOrgStatus,
  useUpdateOrgPlan,
} from "@/api/superAdmin/useSuperAdmin";
import type { SuperAdminOrg } from "@/api/superAdmin/superAdmin.service";
import {
  Calendar,
  Users,
  Eye,
  ShieldBan,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { initials, formatINR } from "@/lib/utils";

export const SuperAdminOrganizationsPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [plan, setPlan] = useState("ALL");

  // Selected organization for action modals
  const [selectedOrgForDetails, setSelectedOrgForDetails] = useState<string | null>(null);
  const [suspendTarget, setSuspendTarget] = useState<SuperAdminOrg | null>(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [planTarget, setPlanTarget] = useState<SuperAdminOrg | null>(null);
  const [newPlanCode, setNewPlanCode] = useState("FREE");
  const [planNotes, setPlanNotes] = useState("");

  const { data, isLoading } = useSuperAdminOrgs({
    page,
    limit,
    search,
    status,
    plan,
  });

  const { data: orgDetailData, isLoading: isDetailLoading } =
    useSuperAdminOrgDetails(selectedOrgForDetails || undefined);

  const updateStatusMutation = useUpdateOrgStatus();
  const updatePlanMutation = useUpdateOrgPlan();

  const organizations = data?.organizations || [];
  const pagination = data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 };

  const filterTabs: FilterTab[] = [
    { id: "ALL", label: "All Mandals" },
    { id: "ACTIVE", label: "Active" },
    { id: "SUSPENDED", label: "Suspended" },
  ];

  const quickFilterGroups: QuickFilterGroup[] = [
    {
      id: "plan",
      label: "Subscription Plan",
      value: plan,
      options: [
        { value: "ALL", label: "All Plans" },
        { value: "FREE", label: "Basic / Free" },
        { value: "STANDARD", label: "Standard" },
        { value: "PREMIUM", label: "Premium" },
      ],
      onChange: (val) => {
        setPlan(val);
        setPage(1);
      },
    },
  ];

  const handleConfirmStatusToggle = async () => {
    if (!suspendTarget) return;
    const targetStatus = suspendTarget.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";
    await updateStatusMutation.mutateAsync({
      id: suspendTarget._id,
      status: targetStatus,
      reason: suspendReason,
    });
    setSuspendTarget(null);
    setSuspendReason("");
  };

  const handleConfirmPlanChange = async () => {
    if (!planTarget) return;
    await updatePlanMutation.mutateAsync({
      id: planTarget._id,
      planCode: newPlanCode,
      notes: planNotes,
    });
    setPlanTarget(null);
    setPlanNotes("");
  };

  const columns: Column<SuperAdminOrg>[] = [
    {
      id: "organization",
      label: "Organization / Trust",
      className: "font-semibold min-w-[200px]",
      render: (org) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0 overflow-hidden border border-primary/20">
            {org.logoUrl ? (
              <img src={org.logoUrl} alt={org.name} className="h-full w-full object-cover" />
            ) : (
              initials(org.name || "FF")
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span
              className="text-foreground font-semibold truncate hover:text-primary transition-colors cursor-pointer"
              onClick={() => setSelectedOrgForDetails(org._id)}
            >
              {org.name}
            </span>
            <span className="text-2xs text-muted-foreground truncate">{org.email || org.phone || "No contact"}</span>
          </div>
        </div>
      ),
    },
    {
      id: "plan",
      label: "Plan",
      className: "w-28 text-center",
      render: (org) => (
        <AppBadge
          size="sm"
          className={
            org.plan === "PREMIUM"
              ? "bg-amber-500/15 text-amber-600 border-amber-500/30 font-bold"
              : org.plan === "STANDARD"
                ? "bg-sky-500/15 text-sky-600 border-sky-500/30 font-semibold"
                : "bg-muted text-muted-foreground font-medium"
          }
        >
          {org.plan || "FREE"}
        </AppBadge>
      ),
    },
    {
      id: "status",
      label: "Status",
      className: "w-28 text-center",
      render: (org) => (
        <AppBadge
          size="sm"
          className={
            org.status === "SUSPENDED" || !org.isActive
              ? "bg-rose-500/15 text-rose-600 border-rose-500/30 font-semibold"
              : "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 font-semibold"
          }
        >
          {org.status === "SUSPENDED" || !org.isActive ? "Suspended" : "Active"}
        </AppBadge>
      ),
    },
    {
      id: "activity",
      label: "Workspaces",
      className: "w-36 text-center text-muted-foreground",
      render: (org) => (
        <div className="flex items-center justify-center gap-3 text-2xs">
          <span className="inline-flex items-center gap-1 font-semibold text-foreground">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            {org.festivalCount || 0}
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-foreground">
            <Users className="h-3.5 w-3.5 text-indigo-500" />
            {org.userCount || 0}
          </span>
        </div>
      ),
    },
    {
      id: "registered",
      label: "Created",
      className: "w-28 text-muted-foreground text-2xs whitespace-nowrap",
      render: (org) =>
        new Date(org.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    {
      id: "actions",
      label: "Actions",
      className: "w-32 text-right",
      render: (org) => (
        <div className="flex items-center justify-end gap-1.5">
          <AppButton
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title="View Details"
            onClick={() => setSelectedOrgForDetails(org._id)}
          >
            <Eye className="h-4 w-4" />
          </AppButton>
          <AppButton
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-sky-500 hover:text-sky-600"
            title="Manage Plan"
            onClick={() => {
              setPlanTarget(org);
              setNewPlanCode(org.plan || "FREE");
            }}
          >
            <CreditCard className="h-4 w-4" />
          </AppButton>
          <AppButton
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 ${
              org.status === "SUSPENDED" ? "text-emerald-500 hover:text-emerald-600" : "text-rose-500 hover:text-rose-600"
            }`}
            title={org.status === "SUSPENDED" ? "Activate Organization" : "Suspend Organization"}
            onClick={() => setSuspendTarget(org)}
          >
            {org.status === "SUSPENDED" ? (
              <ShieldCheck className="h-4 w-4" />
            ) : (
              <ShieldBan className="h-4 w-4" />
            )}
          </AppButton>
        </div>
      ),
    },
  ];

  return (
    <PageContainer variant="list">
      <PageHeader
        title="Organizations Directory"
        description="Oversee, inspect, and manage tenant organizations, subscription plans, and account lifecycles."
        module="organizations"
        badge={`${pagination.total} Mandals`}
      />

      <PageFilterToolbar
        module="organizations"
        searchPlaceholder="Search mandals by name, email, phone..."
        searchQuery={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        tabs={filterTabs}
        activeTab={status}
        onTabChange={(tab) => {
          setStatus(tab);
          setPage(1);
        }}
        quickFilters={quickFilterGroups}
        onResetAll={() => {
          setSearch("");
          setStatus("ALL");
          setPlan("ALL");
          setPage(1);
        }}
      />

      <DataTable
        columns={columns}
        data={organizations}
        keyExtractor={(item) => item._id}
        isLoading={isLoading}
        emptyTitle="No organizations found"
        emptyDescription="Try adjusting your search criteria or filters."
        module="organizations"
      />

      {pagination.totalPages > 1 && (
        <DataTablePagination
          page={page}
          totalPages={pagination.totalPages}
          limit={limit}
          total={pagination.total}
          onPageChange={setPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
          module="organizations"
        />
      )}

      {/* SUSPEND / ACTIVATE CONFIRM DIALOG */}
      <ConfirmDialog
        open={!!suspendTarget}
        onCancel={() => {
          setSuspendTarget(null);
          setSuspendReason("");
        }}
        title={
          suspendTarget?.status === "SUSPENDED"
            ? `Activate "${suspendTarget?.name}"?`
            : `Suspend "${suspendTarget?.name}"?`
        }
        description={
          <div className="space-y-3">
            <p>
              {suspendTarget?.status === "SUSPENDED"
                ? "Reactivating this mandal will restore full access for its members and administrators immediately."
                : "Suspending will block all organization members from logging in and accessing dashboards until reactivated."}
            </p>
            {suspendTarget?.status !== "SUSPENDED" && (
              <div className="pt-2">
                <AppTextArea
                  id="suspendReason"
                  label="Reason for Suspension (recorded in audit logs)"
                  placeholder="e.g. Terms violation, requested by mandal trustee, non-payment..."
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  rows={2}
                />
              </div>
            )}
          </div>
        }
        confirmLabel={
          suspendTarget?.status === "SUSPENDED" ? "Confirm Activation" : "Confirm Suspension"
        }
        variant={suspendTarget?.status === "SUSPENDED" ? "default" : "danger"}
        loading={updateStatusMutation.isPending}
        onConfirm={handleConfirmStatusToggle}
      />

      {/* PLAN ASSIGNMENT DIALOG */}
      <FormDialog
        open={!!planTarget}
        onClose={() => setPlanTarget(null)}
        title={`Change Plan for "${planTarget?.name}"`}
        description="Update the subscription tier or grant complimentary lifetime privileges."
        onSubmit={(e) => {
          e.preventDefault();
          handleConfirmPlanChange();
        }}
        submitLabel="Save Subscription"
        loading={updatePlanMutation.isPending}
      >
        <div className="space-y-4 text-xs">
          <AppSelect
            id="planSelect"
            label="Target Plan"
            value={newPlanCode}
            onChange={(val) => setNewPlanCode(val)}
            options={[
              { value: "FREE", label: "Basic (Free)" },
              { value: "STANDARD", label: "Standard Tier (₹299/mo)" },
              { value: "PREMIUM", label: "Premium Tier (₹399/mo)" },
            ]}
          />
          <AppTextArea
            id="planNotes"
            label="Internal Notes"
            placeholder="e.g. Granted promotional launch access, approved non-profit discount..."
            value={planNotes}
            onChange={(e) => setPlanNotes(e.target.value)}
            rows={2}
          />
        </div>
      </FormDialog>

      {/* ORGANIZATION DETAIL MODAL */}
      {selectedOrgForDetails && (
        <FormDialog
          open={!!selectedOrgForDetails}
          onClose={() => setSelectedOrgForDetails(null)}
          title={orgDetailData?.organization?.name || "Organization Overview"}
          description="Detailed inspection and health metrics"
          contentClassName="max-w-2xl"
          submitLabel="Close"
          cancelLabel="Dismiss"
          onSubmit={(e) => {
            e.preventDefault();
            setSelectedOrgForDetails(null);
          }}
        >
          {isDetailLoading ? (
            <div className="py-12 text-center text-muted-foreground text-xs">
              Loading organization details...
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-muted/40 border border-border">
                  <span className="text-2xs text-muted-foreground block">Festivals</span>
                  <span className="text-base font-bold text-foreground">
                    {orgDetailData?.stats?.totalFestivals || 0}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-muted/40 border border-border">
                  <span className="text-2xs text-muted-foreground block">Contributors</span>
                  <span className="text-base font-bold text-foreground">
                    {orgDetailData?.stats?.totalContributors || 0}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-muted/40 border border-border">
                  <span className="text-2xs text-muted-foreground block">Collected</span>
                  <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{formatINR(orgDetailData?.stats?.totalCollected || 0)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-muted/40 border border-border">
                  <span className="text-2xs text-muted-foreground block">Expenses</span>
                  <span className="text-base font-bold text-rose-600 dark:text-rose-400">
                    ₹{formatINR(orgDetailData?.stats?.totalExpenses || 0)}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 p-3 rounded-xl bg-muted/30 border border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Admin Email:</span>
                  <span className="font-semibold">{orgDetailData?.organization?.email || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contact Phone:</span>
                  <span className="font-semibold">{orgDetailData?.organization?.phone || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Plan:</span>
                  <AppBadge size="sm">{orgDetailData?.organization?.plan || "FREE"}</AppBadge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created On:</span>
                  <span>{new Date(orgDetailData?.organization?.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-foreground mb-2">Team Members ({orgDetailData?.members?.length || 0})</h4>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {orgDetailData?.members?.map((m: any) => (
                    <div key={m._id} className="flex items-center justify-between p-2 rounded-lg bg-card border border-border/60">
                      <div>
                        <span className="font-semibold block">{m.name}</span>
                        <span className="text-2xs text-muted-foreground">{m.email}</span>
                      </div>
                      <AppBadge size="sm" variant="outline">{m.role}</AppBadge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </FormDialog>
      )}
    </PageContainer>
  );
};

export default SuperAdminOrganizationsPage;
