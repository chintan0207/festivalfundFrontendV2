import { useEffect, useState, useCallback, useRef } from "react";
import { Plus, Download } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { useExpenseApiStore } from "@/api/expense/expense.store";
import { useExpenses, useUpdateExpenseStatus } from "@/api/expense/useExpenses";
import { useFestivalApiStore } from "@/api/festival/festival.store";
import { useReportPdfExport } from "@/api/report/useReports";
import { useDebounce } from "@/hooks/useDebounce";
import { useIsOrgAdmin } from "@/hooks/useIsOrgAdmin";
import { getModuleTheme } from "@/theme/colors";
import { PageHeader } from "@/components/common/PageHeader";
import { PageFilterToolbar } from "@/components/common/PageFilterToolbar";
import { DataTablePagination } from "@/components/common/DataTablePagination";
import { PageContainer } from "@/components/common/PageContainer";
import { ViewToggleButton } from "@/components/common/ViewToggleButton";
import { AppButton } from "@/components/common/AppButton";
import { AppBadge } from "@/components/common/AppBadge";
import { ExpenseTable } from "./components/list/ExpenseTable";
import { ExpenseMobileCards } from "./components/list/ExpenseMobileCards";
import { ExpenseKPIs } from "./components/list/ExpenseKPIs";
import { ExpenseCategoryCard } from "./components/list/ExpenseCategoryCard";
import { ExpenseDialogs } from "./components/dialogs/ExpenseDialogs";
import { useExpenseDialogs } from "./useExpenseDialogs";
import {
  expenseCategoryLabel,
  expenseCategoryMeta,
  expenseStatusLabel,
} from "./lib/expenseMeta";
import type { ExpenseListItem, ExpenseStatus } from "@/types/Types";

export default function ExpensesPage() {
  const theme = getModuleTheme("expenses");
  const navigate = useNavigate();
  // Store
  const page = useExpenseApiStore((s) => s.page);
  const limit = useExpenseApiStore((s) => s.limit);
  const search = useExpenseApiStore((s) => s.search);
  const sortField = useExpenseApiStore((s) => s.sortField);
  const sortOrder = useExpenseApiStore((s) => s.sortOrder);
  const category = useExpenseApiStore((s) => s.category);
  const status = useExpenseApiStore((s) => s.status);
  const total = useExpenseApiStore((s) => s.total);
  const totalPages = useExpenseApiStore((s) => s.totalPages);
  const expenses = useExpenseApiStore((s) => s.expenses);
  const statusCounts = useExpenseApiStore((s) => s.statusCounts);
  const setPage = useExpenseApiStore((s) => s.setPage);
  const setLimit = useExpenseApiStore((s) => s.setLimit);
  const setSearch = useExpenseApiStore((s) => s.setSearch);
  const setSortField = useExpenseApiStore((s) => s.setSortField);
  const setSortOrder = useExpenseApiStore((s) => s.setSortOrder);
  const setCategory = useExpenseApiStore((s) => s.setCategory);
  const setStatus = useExpenseApiStore((s) => s.setStatus);
  const setStatusCounts = useExpenseApiStore((s) => s.setStatusCounts);
  const setStatusAmounts = useExpenseApiStore((s) => s.setStatusAmounts);
  const setCategoryTotals = useExpenseApiStore((s) => s.setCategoryTotals);
  const resetFilters = useExpenseApiStore((s) => s.resetFilters);

  // Festivals (single source of truth is the top navbar selector)
  const { activeFestivalId, activeFestival } = useFestivalApiStore();
  const festivalId = activeFestivalId || "";

  // Reset page-specific stale data when the selected festival changes
  const prevFestivalRef = useRef(activeFestivalId);
  useEffect(() => {
    if (prevFestivalRef.current !== activeFestivalId) {
      setPage(1);
      setStatusCounts({ total: 0, PENDING: 0, PAID: 0, CANCELLED: 0 });
      setStatusAmounts({ total: 0, PENDING: 0, PAID: 0, CANCELLED: 0 });
      setCategoryTotals({});
      prevFestivalRef.current = activeFestivalId;
    }
  }, [activeFestivalId, setPage, setStatusCounts, setStatusAmounts, setCategoryTotals]);

  // Local UI
  const [localSearch, setLocalSearch] = useState(search);
  const debouncedSearch = useDebounce(localSearch, 400);
  const [minimalView, setMinimalView] = useState(false);

  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  const isAdmin = useIsOrgAdmin();

  const dialogs = useExpenseDialogs({ themeGradient: theme.gradient });
  const { openAdd } = dialogs;

  // Open the add dialog from the mobile FAB
  useEffect(() => {
    if (!isAdmin) return;
    const handler = () => openAdd();
    window.addEventListener("ff:open-add-expenses", handler);
    return () => window.removeEventListener("ff:open-add-expenses", handler);
  }, [openAdd, isAdmin]);

  const handleResetAll = useCallback(() => {
    resetFilters();
    setLocalSearch("");
  }, [resetFilters]);

  const handleRowClick = useCallback(
    (expense: ExpenseListItem) => {
      navigate({
        to: "/dashboard/expenses/$expenseId",
        params: { expenseId: expense._id },
      });
    },
    [navigate],
  );

  // Query
  const queryParams = {
    page,
    limit,
    search: search || undefined,
    sortField,
    sortOrder,
    ...(status ? { status } : {}),
    ...(category ? { category } : {}),
    ...(festivalId ? { festivalId } : {}),
  };

  const { isLoading } = useExpenses(queryParams);

  // Status actions
  const updateStatusMutation = useUpdateExpenseStatus();
  const reportExport = useReportPdfExport();

  const handleStatusChange = useCallback(
    (id: string, status: ExpenseStatus, reason?: string) => {
      return updateStatusMutation.mutateAsync({ id, status, reason });
    },
    [updateStatusMutation],
  );

  const handleDownloadPdf = useCallback(() => {
    if (!festivalId) {
      toast.error("No festival selected. Please select a festival first.");
      return;
    }

    const filenameSlug = (activeFestival?.name || "festival")
      .replace(/[^a-z0-9-_]+/gi, "-")
      .replace(/-+/g, "-")
      .toLowerCase();

    reportExport.mutate({
      type: "expenses",
      festivalId,
      params: {
        ...(search.trim() ? { search: search.trim() } : {}),
        ...(status ? { status } : {}),
        ...(category ? { category } : {}),
        sortField,
        sortOrder,
      },
      fileName: `expenses-${filenameSlug}.pdf`,
    });
  }, [festivalId, activeFestival, search, status, category, sortField, sortOrder, reportExport]);

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

  // Active filters for toolbar
  const activeFilters = [];
  if (status) {
    activeFilters.push({
      id: "status",
      label: `Status: ${expenseStatusLabel(status)}`,
      onRemove: () => setStatus(""),
    });
  }
  if (category) {
    activeFilters.push({
      id: "category",
      label: `Category: ${expenseCategoryLabel(category)}`,
      onRemove: () => setCategory(""),
    });
  }

  return (
    <PageContainer variant="list">
      <PageHeader
        module="expenses"
        title="Expenses"
        description="Track vendor payouts, vouchers, and festival expenses"
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Expenses", to: "/dashboard/expenses" },
        ]}
        badge={<AppBadge className={theme.badgeColor}>{total} total</AppBadge>}
        actions={
          <>
            {festivalId && (
              <AppButton
                variant="outline"
                onClick={handleDownloadPdf}
                loading={reportExport.isPending}
                leftIcon={<Download className="h-4 w-4" />}
              >
                Export PDF
              </AppButton>
            )}
            {isAdmin && (
              <AppButton
                onClick={dialogs.openAdd}
                leftIcon={<Plus className="h-4 w-4" />}
                gradient={theme.gradient}
              >
                Add Expense
              </AppButton>
            )}
          </>
        }
      />

      <ExpenseKPIs />

      {/* Category strip (desktop full-width) / stacked card (mobile) */}
      <div className="hidden lg:block">
        <ExpenseCategoryCard variant="strip" />
      </div>
      <div className="lg:hidden">
        <ExpenseCategoryCard />
      </div>

      <PageFilterToolbar
        module="expenses"
        searchQuery={localSearch}
        onSearchChange={setLocalSearch}
        searchPlaceholder="Search by description, vendor, voucher, or invoice..."
        quickFilters={[
          {
            id: "category",
            label: "Category",
            value: category || "ALL",
            options: [
              { value: "ALL", label: "All Categories" },
              ...expenseCategoryMeta.map((m) => ({
                value: m.key,
                label: m.label,
              })),
            ],
            onChange: (val) => setCategory(val === "ALL" ? "" : val),
          },
        ]}
        pillGroups={[
          {
            id: "status",
            label: "Status",
            value: status || "ALL",
            options: [
              { value: "ALL", label: "All", count: statusCounts.total ?? total },
              { value: "PENDING", label: "Pending", count: statusCounts.PENDING ?? 0 },
              { value: "PAID", label: "Paid", count: statusCounts.PAID ?? 0 },
              {
                value: "CANCELLED",
                label: "Cancelled",
                count: statusCounts.CANCELLED ?? 0,
              },
            ],
            onChange: (val) => setStatus(val === "ALL" ? "" : val),
            variant: "module",
          },
        ]}
        sortOptions={[
          { id: "createdAt", label: "Created" },
          { id: "date", label: "Date" },
          { id: "amount", label: "Amount" },
          { id: "category", label: "Category" },
        ]}
        activeSort={sortField}
        sortDirection={sortOrder}
        onSortChange={handleSort}
        activeFilters={activeFilters}
        onResetAll={handleResetAll}
        minimal={minimalView}
        searchRightActions={
          <ViewToggleButton
            minimal={minimalView}
            onToggle={() => setMinimalView((v) => !v)}
          />
        }
      />

      {/* Mobile cards */}
      <ExpenseMobileCards
        expenses={expenses}
        isLoading={isLoading}
        minimal={minimalView}
        onRowClick={handleRowClick}
        onEdit={dialogs.openEdit}
        onDelete={dialogs.openDelete}
        onStatusChange={handleStatusChange}
        isStatusPending={updateStatusMutation.isPending}
      />

      {/* Desktop table */}
      <div className="hidden md:block">
        <ExpenseTable
          expenses={expenses}
          isLoading={isLoading}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          onRowClick={handleRowClick}
          onEdit={dialogs.openEdit}
          onDelete={dialogs.openDelete}
          onStatusChange={handleStatusChange}
          isStatusPending={updateStatusMutation.isPending}
        />
      </div>

      <DataTablePagination
        page={page}
        totalPages={totalPages}
        total={total}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
        module="expenses"
      />

      <ExpenseDialogs {...dialogs.dialogsProps} />
    </PageContainer>
  );
}
