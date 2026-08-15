import { useEffect, useState, useCallback, useRef } from "react";
import { Plus, Download } from "lucide-react";
import { toast } from "sonner";
import { Outlet, useNavigate, useMatches } from "@tanstack/react-router";
import { useContributionApiStore } from "@/api/contribution/contribution.store";
import {
  useContributions,
  useUpdateContributionStatus,
  useDownloadContributionSlip,
} from "@/api/contribution/useContributions";
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
import { ContributionTable } from "./components/list/ContributionTable";
import { ContributionMobileCards } from "./components/list/ContributionMobileCards";
import { ContributionKPIs } from "./components/list/ContributionKPIs";
import { ContributionDialogs } from "./components/dialogs/ContributionDialogs";
import { useContributionDialogs } from "./useContributionDialogs";
import {
  contributionStatusLabel,
  contributionTypeLabel,
  contributionPaymentLabel,
} from "./lib/contributionMeta";
import { categoryLabel } from "@/lib/categoryMeta";
import type { ContributionListItem, ContributionStatus } from "@/types/Types";

export default function ContributionsPage() {
  const theme = getModuleTheme("contributions");
  // Store
  const page = useContributionApiStore((s) => s.page);
  const limit = useContributionApiStore((s) => s.limit);
  const search = useContributionApiStore((s) => s.search);
  const sortField = useContributionApiStore((s) => s.sortField);
  const sortOrder = useContributionApiStore((s) => s.sortOrder);
  const status = useContributionApiStore((s) => s.status);
  const category = useContributionApiStore((s) => s.category);
  const type = useContributionApiStore((s) => s.type);
  const paymentMode = useContributionApiStore((s) => s.paymentMode);
  const total = useContributionApiStore((s) => s.total);
  const totalPages = useContributionApiStore((s) => s.totalPages);
  const contributions = useContributionApiStore((s) => s.contributions);
  const statusCounts = useContributionApiStore((s) => s.statusCounts);
  const setPage = useContributionApiStore((s) => s.setPage);
  const setLimit = useContributionApiStore((s) => s.setLimit);
  const setSearch = useContributionApiStore((s) => s.setSearch);
  const setSortField = useContributionApiStore((s) => s.setSortField);
  const setSortOrder = useContributionApiStore((s) => s.setSortOrder);
  const setStatus = useContributionApiStore((s) => s.setStatus);
  const setCategory = useContributionApiStore((s) => s.setCategory);
  const setType = useContributionApiStore((s) => s.setType);
  const setPaymentMode = useContributionApiStore((s) => s.setPaymentMode);
  const resetFilters = useContributionApiStore((s) => s.resetFilters);

  const setStatusCounts = useContributionApiStore((s) => s.setStatusCounts);

  // Festivals (single source of truth is the top navbar selector)
  const { activeFestivalId, activeFestival } = useFestivalApiStore();
  const festivalId = activeFestivalId || "";

  // Reset page-specific stale data when the selected festival changes
  const prevFestivalRef = useRef(activeFestivalId);
  useEffect(() => {
    if (prevFestivalRef.current !== activeFestivalId) {
      setPage(1);
      setStatusCounts({ total: 0, DEPOSITED: 0, PENDING: 0, CANCELLED: 0 });
      prevFestivalRef.current = activeFestivalId;
    }
  }, [activeFestivalId, setPage, setStatusCounts]);

  // Local UI
  const [localSearch, setLocalSearch] = useState(search);
  const debouncedSearch = useDebounce(localSearch, 400);
  const [minimalView, setMinimalView] = useState(false);

  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  const navigate = useNavigate();
  const matches = useMatches();
  const isAdmin = useIsOrgAdmin();

  const dialogs = useContributionDialogs({ themeGradient: theme.gradient });
  const { openAdd } = dialogs;

  const reportExport = useReportPdfExport();

  const handleExport = useCallback(() => {
    if (!activeFestivalId) {
      toast.error("No festival selected. Please select a festival first.");
      return;
    }

    const filenameSlug = (activeFestival?.name || "festival")
      .replace(/[^a-z0-9-_]+/gi, "-")
      .replace(/-+/g, "-")
      .toLowerCase();

    reportExport.mutate({
      type: "contributions",
      festivalId: activeFestivalId,
      params: {
        ...(search.trim() ? { search: search.trim() } : {}),
        ...(status ? { status } : {}),
        ...(category ? { category } : {}),
        ...(type ? { type } : {}),
        ...(paymentMode ? { paymentMode } : {}),
        sortField,
        sortOrder,
      },
      fileName: `contributions-${filenameSlug}.pdf`,
    });
  }, [activeFestivalId, activeFestival, search, status, category, type, paymentMode, sortField, sortOrder, reportExport]);

  // Open the add dialog from the mobile FAB
  useEffect(() => {
    if (!isAdmin) return;
    const handler = () => openAdd();
    window.addEventListener("ff:open-add-contributions", handler);
    return () => window.removeEventListener("ff:open-add-contributions", handler);
  }, [openAdd, isAdmin]);

  const handleRowClick = useCallback(
    (contribution: ContributionListItem) => {
      navigate({
        to: "/dashboard/contributions/$contributionId",
        params: { contributionId: contribution._id },
      });
    },
    [navigate],
  );

  // Handle reset: clear both store and local state synchronously
  const handleResetAll = useCallback(() => {
    resetFilters();
    setLocalSearch("");
  }, [resetFilters]);

  // Query
  const queryParams = {
    page,
    limit,
    search: search || undefined,
    sortField,
    sortOrder,
    ...(status ? { status } : {}),
    ...(category ? { category } : {}),
    ...(type ? { type } : {}),
    ...(paymentMode ? { paymentMode } : {}),
    ...(festivalId ? { festivalId } : {}),
  };

  const { isLoading } = useContributions(queryParams);

  // Status + slip actions for mobile cards
  const updateStatusMutation = useUpdateContributionStatus();
  const downloadSlip = useDownloadContributionSlip();

  const handleStatusChange = useCallback(
    (id: string, status: ContributionStatus, reason?: string) => {
      return updateStatusMutation.mutateAsync({ id, status, reason });
    },
    [updateStatusMutation],
  );

  const handleDownloadSlip = useCallback(
    (id: string) => {
      downloadSlip.mutate(id);
    },
    [downloadSlip],
  );

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
      label: `Status: ${contributionStatusLabel(status)}`,
      onRemove: () => setStatus(""),
    });
  }
  if (category) {
    activeFilters.push({
      id: "category",
      label: `Category: ${categoryLabel(category)}`,
      onRemove: () => setCategory(""),
    });
  }
  if (type) {
    activeFilters.push({
      id: "type",
      label: `Type: ${contributionTypeLabel(type)}`,
      onRemove: () => setType(""),
    });
  }
  if (paymentMode) {
    activeFilters.push({
      id: "paymentMode",
      label: `Mode: ${contributionPaymentLabel(paymentMode)}`,
      onRemove: () => setPaymentMode(""),
    });
  }

  if (matches.some((m) => m.routeId === "/dashboard/contributions/$contributionId")) {
    return <Outlet />;
  }

  return (
    <PageContainer variant="list">
      <PageHeader
        module="contributions"
        title="Contributions"
        description="Track donor contributions, receipts, and festival balances"
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Contributions", to: "/dashboard/contributions" },
        ]}
        badge={<AppBadge className={theme.badgeColor}>{total} total</AppBadge>}
        actions={
          <>
            <AppButton
              className={theme.iconColor}
              variant="outline"
              onClick={handleExport}
              loading={reportExport.isPending}
              leftIcon={<Download className="h-4 w-4" />}
            >
              Export PDF
            </AppButton>
            {isAdmin && (
              <AppButton
                onClick={dialogs.openAdd}
                leftIcon={<Plus className="h-4 w-4" />}
                gradient={theme.gradient}
              >
                Add Contribution
              </AppButton>
            )}
          </>
        }
      />

      <ContributionKPIs themeGradient={theme.gradient} />

      <PageFilterToolbar
        module="contributions"
        searchQuery={localSearch}
        onSearchChange={setLocalSearch}
        searchPlaceholder="Search by code, name, phone, or item..."
        quickFilters={[
          {
            id: "category",
            label: "Category",
            value: category || "ALL",
            options: [
              { value: "ALL", label: "All Categories" },
              { value: "PARENT", label: "Parents" },
              { value: "BOY", label: "Boys" },
              { value: "GIRL", label: "Girls" },
            ],
            onChange: (val) => setCategory(val === "ALL" ? "" : val),
          },
          {
            id: "paymentMode",
            label: "Mode",
            value: paymentMode || "ALL",
            options: [
              { value: "ALL", label: "All Modes" },
              { value: "CASH", label: "Cash" },
              { value: "UPI", label: "UPI" },
            ],
            onChange: (val) => setPaymentMode(val === "ALL" ? "" : val),
          },
          {
            id: "type",
            label: "Type",
            value: type || "ALL",
            options: [
              { value: "ALL", label: "All Types" },
              { value: "MONEY", label: "Cash" },
              { value: "ITEM", label: "Item" },
            ],
            onChange: (val) => setType(val === "ALL" ? "" : val),
          },
        ]}
        pillGroups={[
          {
            id: "status",
            label: "Status",
            value: status || "ALL",
            options: [
              { value: "ALL", label: "All", count: statusCounts.total ?? total },
              { value: "DEPOSITED", label: "Deposited", count: statusCounts.DEPOSITED ?? 0 },
              { value: "PENDING", label: "Pending", count: statusCounts.PENDING ?? 0 },
              { value: "CANCELLED", label: "Cancelled", count: statusCounts.CANCELLED ?? 0 },
            ],
            onChange: (val) => setStatus(val === "ALL" ? "" : val),
            variant: "module",
          },
        ]}
        sortOptions={[
          { id: "createdAt", label: "Created" },
          { id: "name", label: "Name" },
          { id: "date", label: "Date" },
          { id: "amount", label: "Amount" },
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
      <ContributionMobileCards
        contributions={contributions}
        isLoading={isLoading}
        minimal={minimalView}
        onEdit={dialogs.openEdit}
        onDelete={dialogs.openDelete}
        onRowClick={handleRowClick}
        onStatusChange={handleStatusChange}
        onDownloadSlip={handleDownloadSlip}
        isStatusPending={updateStatusMutation.isPending}
        isSlipPending={downloadSlip.isPending}
      />

      {/* Desktop table */}
      <div className="hidden md:block">
        <ContributionTable
          contributions={contributions}
          isLoading={isLoading}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          onEdit={dialogs.openEdit}
          onDelete={dialogs.openDelete}
          onRowClick={handleRowClick}
          onStatusChange={handleStatusChange}
          onDownloadSlip={handleDownloadSlip}
          isStatusPending={updateStatusMutation.isPending}
          isSlipPending={downloadSlip.isPending}
        />
      </div>

      <DataTablePagination
        page={page}
        totalPages={totalPages}
        total={total}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
        module="contributions"
      />

      <ContributionDialogs {...dialogs.dialogsProps} />
    </PageContainer>
  );
}
