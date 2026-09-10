import { useState } from "react";
import { PageContainer } from "@/components/common/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { AppBadge } from "@/components/common/AppBadge";
import { AppButton } from "@/components/common/AppButton";
import { FormDialog } from "@/components/common/FormDialog";
import { AppInput } from "@/components/common/AppInput";
import { AppSelect } from "@/components/common/AppSelect";
import { AppTextArea } from "@/components/common/AppTextArea";
import {
  useSuperAdminPlans,
  useCreatePlan,
  useUpdatePlan,
} from "@/api/superAdmin/useSuperAdmin";
import type { SubscriptionPlanItem } from "@/api/superAdmin/superAdmin.service";
import { Plus, CreditCard, Pencil } from "lucide-react";

export const SuperAdminPlansPage = () => {
  const { data: plans = [], isLoading } = useSuperAdminPlans();
  const createPlanMutation = useCreatePlan();
  const updatePlanMutation = useUpdatePlan();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlanItem | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [price, setPrice] = useState(0);
  const [billingInterval, setBillingInterval] = useState<"MONTHLY" | "YEARLY" | "LIFETIME">("MONTHLY");
  const [description, setDescription] = useState("");
  const [festivalsPerYear, setFestivalsPerYear] = useState(999999);
  const [contributorsLimit, setContributorsLimit] = useState(999999);
  const [isActive, setIsActive] = useState(true);

  const handleOpenCreate = () => {
    setEditingPlan(null);
    setName("");
    setCode("");
    setPrice(0);
    setBillingInterval("MONTHLY");
    setDescription("");
    setFestivalsPerYear(999999);
    setContributorsLimit(999999);
    setIsActive(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (plan: SubscriptionPlanItem) => {
    setEditingPlan(plan);
    setName(plan.name);
    setCode(plan.code);
    setPrice(plan.price);
    setBillingInterval(plan.billingInterval);
    setDescription(plan.description || "");
    setFestivalsPerYear(plan.limits?.festivalsPerYear ?? 999999);
    setContributorsLimit(plan.limits?.contributors ?? 999999);
    setIsActive(plan.isActive);
    setModalOpen(true);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const payload = {
      name,
      code,
      price: Number(price),
      billingInterval,
      description,
      limits: {
        festivalsPerYear: Number(festivalsPerYear),
        contributors: Number(contributorsLimit),
      },
      isActive,
    };

    if (editingPlan) {
      await updatePlanMutation.mutateAsync({ id: editingPlan._id, payload });
    } else {
      await createPlanMutation.mutateAsync(payload);
    }
    setModalOpen(false);
  };

  const columns: Column<SubscriptionPlanItem>[] = [
    {
      id: "name",
      label: "Plan Name",
      className: "font-bold min-w-[180px]",
      render: (p) => (
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
            <CreditCard className="h-4 w-4" />
          </div>
          <div>
            <span className="text-foreground font-semibold block">{p.name}</span>
            <span className="text-2xs text-muted-foreground font-mono">{p.code}</span>
          </div>
        </div>
      ),
    },
    {
      id: "price",
      label: "Price",
      className: "w-32 font-bold tabular-nums",
      render: (p) => (
        <span>
          {p.price === 0 ? "Free" : `₹${p.price}`}
          <span className="text-2xs text-muted-foreground font-normal"> / {p.billingInterval.toLowerCase()}</span>
        </span>
      ),
    },
    {
      id: "limits",
      label: "Limits",
      className: "w-40 text-xs text-muted-foreground",
      render: (p) => (
        <div className="flex flex-col text-2xs">
          <span>Festivals: {p.limits?.festivalsPerYear === 999999 ? "Unlimited" : p.limits?.festivalsPerYear}</span>
          <span>Contributors: {p.limits?.contributors === 999999 ? "Unlimited" : p.limits?.contributors}</span>
        </div>
      ),
    },
    {
      id: "tenants",
      label: "Organizations",
      className: "w-28 text-center",
      render: (p) => (
        <AppBadge size="sm" variant="secondary" className="font-semibold">
          {p.organizationCount || 0} Mandals
        </AppBadge>
      ),
    },
    {
      id: "status",
      label: "Status",
      className: "w-24 text-center",
      render: (p) => (
        <AppBadge
          size="sm"
          className={
            p.isActive
              ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 font-semibold"
              : "bg-muted text-muted-foreground font-medium"
          }
        >
          {p.isActive ? "Active" : "Archived"}
        </AppBadge>
      ),
    },
    {
      id: "actions",
      label: "Actions",
      className: "w-20 text-right",
      render: (p) => (
        <AppButton
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          onClick={() => handleOpenEdit(p)}
          title="Edit Plan"
        >
          <Pencil className="h-3.5 w-3.5" />
        </AppButton>
      ),
    },
  ];

  return (
    <PageContainer variant="list">
      <PageHeader
        title="Subscription Plans"
        description="Configure pricing tiers, annual festival allowances, and subscription benefits for mandals."
        module="billing"
        badge={`${plans.length} Configured`}
        actions={
          <AppButton
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={handleOpenCreate}
          >
            New Plan
          </AppButton>
        }
      />

      <DataTable
        columns={columns}
        data={plans}
        keyExtractor={(p) => p._id}
        isLoading={isLoading}
        emptyTitle="No plans configured"
        module="billing"
      />

      {/* CREATE / EDIT PLAN FORM DIALOG */}
      <FormDialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPlan ? `Edit Plan: ${editingPlan.name}` : "Create Subscription Plan"}
        description="Configure pricing and feature limits for platform subscribers."
        onSubmit={handleSave}
        submitLabel={editingPlan ? "Update Plan" : "Create Plan"}
        loading={createPlanMutation.isPending || updatePlanMutation.isPending}
      >
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <AppInput
              id="planName"
              label="Plan Name"
              placeholder="e.g. Standard"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <AppInput
              id="planCode"
              label="Unique Code"
              placeholder="e.g. STANDARD"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              disabled={!!editingPlan}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <AppInput
              id="planPrice"
              label="Price (₹ INR)"
              type="number"
              min={0}
              value={String(price)}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
            />
            <AppSelect
              id="billingInterval"
              label="Billing Interval"
              value={billingInterval}
              onChange={(val) => setBillingInterval(val as any)}
              options={[
                { value: "MONTHLY", label: "Monthly" },
                { value: "YEARLY", label: "Yearly" },
                { value: "LIFETIME", label: "Lifetime Access" },
              ]}
            />
          </div>

          <AppTextArea
            id="planDesc"
            label="Plan Description"
            placeholder="Brief summary of who this plan is tailored for..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />

          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border">
            <div>
              <span className="font-semibold block text-foreground">Active for New Signups</span>
              <span className="text-2xs text-muted-foreground">Inactive plans cannot be chosen by new organizations.</span>
            </div>
            <AppButton
              type="button"
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => setIsActive(!isActive)}
            >
              {isActive ? "Active" : "Archived"}
            </AppButton>
          </div>
        </div>
      </FormDialog>
    </PageContainer>
  );
};

export default SuperAdminPlansPage;
