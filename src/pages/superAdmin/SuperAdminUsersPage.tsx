import { useState } from "react";
import { PageContainer } from "@/components/common/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { PageFilterToolbar, type FilterTab } from "@/components/common/PageFilterToolbar";
import { DataTable, type Column } from "@/components/common/DataTable";
import { DataTablePagination } from "@/components/common/DataTablePagination";
import { AppBadge } from "@/components/common/AppBadge";
import { AppButton } from "@/components/common/AppButton";
import { FormDialog } from "@/components/common/FormDialog";
import { AppInput } from "@/components/common/AppInput";
import { AppSelect } from "@/components/common/AppSelect";
import { useSuperAdminUsers, useUpdateSuperAdminUser } from "@/api/superAdmin/useSuperAdmin";
import type { SuperAdminUser } from "@/api/superAdmin/superAdmin.service";
import { UserCheck, UserX, Pencil, Building2 } from "lucide-react";
import { initials } from "@/lib/utils";

export const SuperAdminUsersPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("ALL");

  const [editTarget, setEditTarget] = useState<SuperAdminUser | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<"SUPER_ADMIN" | "ORG_ADMIN" | "ORG_VIEWER">("ORG_ADMIN");
  const [editIsActive, setEditIsActive] = useState(true);

  const { data, isLoading } = useSuperAdminUsers({
    page,
    limit,
    search,
    role,
  });

  const updateUserMutation = useUpdateSuperAdminUser();

  const users = data?.users || [];
  const pagination = data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 };

  const filterTabs: FilterTab[] = [
    { id: "ALL", label: "All Users" },
    { id: "ORG_ADMIN", label: "Org Admins" },
    { id: "ORG_VIEWER", label: "Viewers" },
    { id: "SUPER_ADMIN", label: "Super Admins" },
  ];

  const handleOpenEdit = (user: SuperAdminUser) => {
    setEditTarget(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditIsActive(user.isActive);
  };

  const handleSaveUser = async () => {
    if (!editTarget) return;
    await updateUserMutation.mutateAsync({
      id: editTarget._id,
      payload: {
        name: editName,
        email: editEmail,
        role: editRole,
        isActive: editIsActive,
      },
    });
    setEditTarget(null);
  };

  const columns: Column<SuperAdminUser>[] = [
    {
      id: "user",
      label: "User",
      className: "font-semibold min-w-[200px]",
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/15 text-primary font-bold flex items-center justify-center text-xs shrink-0 border border-primary/20 overflow-hidden">
            {u.avatarUrl ? (
              <img src={u.avatarUrl} alt={u.name} className="h-full w-full object-cover" />
            ) : (
              initials(u.name || "U")
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-foreground font-semibold truncate">{u.name}</span>
            <span className="text-2xs text-muted-foreground truncate">{u.email}</span>
          </div>
        </div>
      ),
    },
    {
      id: "organization",
      label: "Organization / Trust",
      className: "min-w-[160px]",
      render: (u) =>
        u.organizationId ? (
          <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
            <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="truncate max-w-[150px]">{u.organizationId.name}</span>
          </div>
        ) : (
          <span className="text-2xs text-muted-foreground italic">Platform (Global)</span>
        ),
    },
    {
      id: "role",
      label: "Role",
      className: "w-32 text-center",
      render: (u) => (
        <AppBadge
          size="sm"
          className={
            u.role === "SUPER_ADMIN"
              ? "bg-rose-500/15 text-rose-600 border-rose-500/30 font-bold"
              : u.role === "ORG_ADMIN"
                ? "bg-indigo-500/15 text-indigo-600 border-indigo-500/30 font-semibold"
                : "bg-muted text-muted-foreground"
          }
        >
          {u.role === "SUPER_ADMIN"
            ? "Super Admin"
            : u.role === "ORG_ADMIN"
              ? "Org Admin"
              : "Viewer"}
        </AppBadge>
      ),
    },
    {
      id: "status",
      label: "Status",
      className: "w-24 text-center",
      render: (u) => (
        <AppBadge
          size="sm"
          className={
            u.isActive
              ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 font-semibold"
              : "bg-rose-500/15 text-rose-600 border-rose-500/30 font-semibold"
          }
        >
          {u.isActive ? "Active" : "Locked"}
        </AppBadge>
      ),
    },
    {
      id: "joined",
      label: "Joined",
      className: "w-28 text-muted-foreground text-2xs whitespace-nowrap",
      render: (u) =>
        new Date(u.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    {
      id: "actions",
      label: "Actions",
      className: "w-24 text-right",
      render: (u) => (
        <AppButton
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          onClick={() => handleOpenEdit(u)}
          title="Edit User"
        >
          <Pencil className="h-3.5 w-3.5" />
        </AppButton>
      ),
    },
  ];

  return (
    <PageContainer variant="list">
      <PageHeader
        title="Global Users Registry"
        description="Search, inspect, and manage accounts and access privileges across all mandal organizations."
        module="users"
        badge={`${pagination.total} Users`}
      />

      <PageFilterToolbar
        module="users"
        searchPlaceholder="Search users by name, email, phone..."
        searchQuery={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        tabs={filterTabs}
        activeTab={role}
        onTabChange={(tab) => {
          setRole(tab);
          setPage(1);
        }}
        onResetAll={() => {
          setSearch("");
          setRole("ALL");
          setPage(1);
        }}
      />

      <DataTable
        columns={columns}
        data={users}
        keyExtractor={(u) => u._id}
        isLoading={isLoading}
        emptyTitle="No users found"
        emptyDescription="No users match the current search filters."
        module="users"
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
          module="users"
        />
      )}

      {/* EDIT USER DIALOG */}
      <FormDialog
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title={`Edit User: ${editTarget?.name}`}
        description="Update user identity, role, or account lock status."
        onSubmit={(e) => {
          e.preventDefault();
          handleSaveUser();
        }}
        submitLabel="Save Changes"
        loading={updateUserMutation.isPending}
      >
        <div className="space-y-4 text-xs">
          <AppInput
            id="editName"
            label="Full Name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            required
          />
          <AppInput
            id="editEmail"
            label="Email Address"
            type="email"
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
            required
          />
          <AppSelect
            id="editRole"
            label="Platform / Org Role"
            value={editRole}
            onChange={(val) => setEditRole(val as any)}
            options={[
              { value: "ORG_VIEWER", label: "Organization Viewer (Read-only)" },
              { value: "ORG_ADMIN", label: "Organization Admin (Full Org Manager)" },
              { value: "SUPER_ADMIN", label: "Platform Super Admin" },
            ]}
          />
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border">
            <div>
              <span className="font-semibold block text-foreground">Account Status</span>
              <span className="text-2xs text-muted-foreground">
                Locked accounts cannot sign in or perform any actions.
              </span>
            </div>
            <AppButton
              type="button"
              variant={editIsActive ? "outline" : "destructive"}
              size="sm"
              onClick={() => setEditIsActive(!editIsActive)}
            >
              {editIsActive ? (
                <>
                  <UserCheck className="h-3.5 w-3.5 mr-1 text-emerald-500" /> Active
                </>
              ) : (
                <>
                  <UserX className="h-3.5 w-3.5 mr-1" /> Locked
                </>
              )}
            </AppButton>
          </div>
        </div>
      </FormDialog>
    </PageContainer>
  );
};

export default SuperAdminUsersPage;
