import { useEffect, useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { useContributorApiStore } from "@/api/contributor/contributor.store";
import {
  useContributors,
  useCreateContributor,
  useUpdateContributor,
  useSoftDeleteContributor,
} from "@/api/hooks/useContributors";
import { useDebounce } from "@/hooks/useDebounce";
import { getModuleTheme } from "@/theme/colors";
import { PageHeader } from "@/components/common/PageHeader";
import { PageFilterToolbar } from "@/components/common/PageFilterToolbar";
import { DataTablePagination } from "@/components/common/DataTablePagination";
import { AppButton } from "@/components/common/AppButton";
import { AppBadge } from "@/components/common/AppBadge";
import { ContributorKPIs } from "./components/ContributorKPIs";
import { ContributorTable } from "./components/ContributorTable";
import { ContributorMobileCards } from "./components/ContributorMobileCards";
import { ContributorDialogs, type ContributorFormData } from "./components/ContributorDialogs";
import type { Contributor } from "@/types/Types";

const defaultForm: ContributorFormData = {
  name: "",
  phoneNumber: "",
  email: "",
  address: "",
  category: "PARENT",
};

export default function ContributorsPage() {
  const theme = getModuleTheme("contributors");

  // Store
  const page = useContributorApiStore((s) => s.page);
  const limit = useContributorApiStore((s) => s.limit);
  const search = useContributorApiStore((s) => s.search);
  const sortField = useContributorApiStore((s) => s.sortField);
  const sortOrder = useContributorApiStore((s) => s.sortOrder);
  const category = useContributorApiStore((s) => s.category);
  const isActive = useContributorApiStore((s) => s.isActive);
  const total = useContributorApiStore((s) => s.total);
  const totalPages = useContributorApiStore((s) => s.totalPages);
  const contributors = useContributorApiStore((s) => s.contributors);
  const setPage = useContributorApiStore((s) => s.setPage);
  const setLimit = useContributorApiStore((s) => s.setLimit);
  const setSearch = useContributorApiStore((s) => s.setSearch);
  const setSortField = useContributorApiStore((s) => s.setSortField);
  const setSortOrder = useContributorApiStore((s) => s.setSortOrder);
  const setCategory = useContributorApiStore((s) => s.setCategory);
  const setIsActive = useContributorApiStore((s) => s.setIsActive);
  const setSelectedContributor = useContributorApiStore((s) => s.setSelectedContributor);
  const resetFilters = useContributorApiStore((s) => s.resetFilters);

  // Local UI
  const [localSearch, setLocalSearch] = useState(search);
  const debouncedSearch = useDebounce(localSearch, 400);
  const [form, setForm] = useState<ContributorFormData>(defaultForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  // Query
  const queryParams = {
    page,
    limit,
    search: search || undefined,
    sortField,
    sortOrder,
    ...(category ? { category } : {}),
    ...(isActive ? { isActive } : {}),
  };

  const { isLoading } = useContributors(queryParams);
  const createMutation = useCreateContributor();
  const updateMutation = useUpdateContributor();
  const deleteMutation = useSoftDeleteContributor();

  // Handlers
  const handleSort = useCallback(
    (field: string) => {
      if (sortField === field) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortField(field);
        setSortOrder("desc");
      }
    },
    [sortField, sortOrder, setSortField, setSortOrder],
  );

  const handleCreate = useCallback(() => {
    createMutation.mutate(form, {
      onSuccess: () => {
        setIsAddOpen(false);
        setForm(defaultForm);
      },
    });
  }, [createMutation, form]);

  const handleEdit = useCallback((contributor: Contributor) => {
    setEditId(contributor._id);
    setForm({
      name: contributor.name,
      phoneNumber: contributor.phoneNumber || "",
      email: contributor.email || "",
      address: contributor.address || "",
      category: contributor.category,
    });
    setIsEditOpen(true);
  }, []);

  const handleUpdate = useCallback(() => {
    if (!editId) return;
    updateMutation.mutate(
      { contributorId: editId, payload: form },
      {
        onSuccess: () => {
          setIsEditOpen(false);
          setEditId(null);
          setForm(defaultForm);
        },
      },
    );
  }, [editId, form, updateMutation]);

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        setIsDeleteOpen(false);
        setDeleteId(null);
      },
    });
  }, [deleteId, deleteMutation]);

  // Active filters for toolbar
  const activeFilters = [];
  if (category) {
    const labels: Record<string, string> = { PARENT: "Parents", BOY: "Boys", GIRL: "Girls" };
    activeFilters.push({
      id: "category",
      label: `Category: ${labels[category] || category}`,
      onRemove: () => setCategory(""),
    });
  }
  if (isActive && isActive !== "true") {
    activeFilters.push({
      id: "isActive",
      label: `Status: ${isActive === "true" ? "Active" : "Inactive"}`,
      onRemove: () => setIsActive("true"),
    });
  }

  return (
    <div className="space-y-5 pb-28 md:pb-10 max-w-[1400px] mx-auto px-1 sm:px-0">
      <PageHeader
        module="contributors"
        title="Contributors"
        description="Manage donor profiles across Parents, Boys, and Girls categories"
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Contributors", to: "/dashboard/contributors" },
        ]}
        badge={<AppBadge className={theme.badgeColor}>{total} total</AppBadge>}
        actions={
          <AppButton
            onClick={() => {
              setForm(defaultForm);
              setIsAddOpen(true);
            }}
            leftIcon={<Plus className="h-4 w-4" />}
            gradient={theme.gradient}
          >
            Add Contributor
          </AppButton>
        }
      />

      <ContributorKPIs total={total} contributors={contributors} />

      <PageFilterToolbar
        module="contributors"
        searchQuery={localSearch}
        onSearchChange={setLocalSearch}
        searchPlaceholder="Search by name, phone, email, or code..."
        pillGroups={[
          {
            id: "category",
            label: "Category",
            value: category || "ALL",
            options: [
              { value: "ALL", label: "All" },
              { value: "PARENT", label: "Parents", count: contributors.filter((c) => c.category === "PARENT").length },
              { value: "BOY", label: "Boys", count: contributors.filter((c) => c.category === "BOY").length },
              { value: "GIRL", label: "Girls", count: contributors.filter((c) => c.category === "GIRL").length },
            ],
            onChange: (val) => setCategory(val === "ALL" ? "" : val),
            variant: "module",
          },
          {
            id: "status",
            label: "Status",
            value: isActive,
            options: [
              { value: "true", label: "Active" },
              { value: "false", label: "Inactive" },
              { value: "", label: "All" },
            ],
            onChange: (val) => setIsActive(val),
            variant: "module",
          },
        ]}
        sortOptions={[
          { id: "createdAt", label: "Created" },
          { id: "name", label: "Name" },
          { id: "updatedAt", label: "Updated" },
        ]}
        activeSort={sortField}
        sortDirection={sortOrder}
        onSortChange={handleSort}
        activeFilters={activeFilters}
        onResetAll={resetFilters}
      />

      {/* Mobile cards */}
      <ContributorMobileCards
        contributors={contributors}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={(id) => {
          setDeleteId(id);
          setIsDeleteOpen(true);
        }}
        onRowClick={setSelectedContributor}
      />

      {/* Desktop table */}
      <div className="hidden md:block">
        <ContributorTable
          contributors={contributors}
          isLoading={isLoading}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          onEdit={handleEdit}
          onDelete={(id) => {
            setDeleteId(id);
            setIsDeleteOpen(true);
          }}
          onRowClick={setSelectedContributor}
        />
      </div>

      <DataTablePagination
        page={page}
        totalPages={totalPages}
        total={total}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
        module="contributors"
      />

      <ContributorDialogs
        isAddOpen={isAddOpen}
        isEditOpen={isEditOpen}
        isDeleteOpen={isDeleteOpen}
        form={form}
        isCreating={createMutation.isPending}
        isUpdating={updateMutation.isPending}
        isDeleting={deleteMutation.isPending}
        themeGradient={theme.gradient}
        onAddClose={() => setIsAddOpen(false)}
        onEditClose={() => {
          setIsEditOpen(false);
          setEditId(null);
        }}
        onDeleteClose={() => {
          setIsDeleteOpen(false);
          setDeleteId(null);
        }}
        onFormChange={(field, value) => setForm((prev) => ({ ...prev, [field]: value }))}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDeleteConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
