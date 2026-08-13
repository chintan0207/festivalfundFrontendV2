/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useFestivalStore } from "@/store/festivalStore";
import { useFestivalApiStore } from "@/api/festival/festival.store";
import { useFestivals } from "@/api/festival/useFestivals";
import {
  useContributions,
  useUpdateContributionStatus,
  useDownloadContributionSlip,
} from "@/api/contribution/useContributions";
import { useExpenses, useUpdateExpenseStatus } from "@/api/expense/useExpenses";
import { useContributors, useDownloadContributorsPdf } from "@/api/contributor/useContributors";
import { useFestivalStats } from "@/api/report/useReports";

import { PageContainer } from "@/components/common/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { PageFilterToolbar, type InlinePillGroup, type QuickFilterGroup, type SortOption } from "@/components/common/PageFilterToolbar";
import { AppButton } from "@/components/common/AppButton";
import { getModuleTheme } from "@/theme/colors";
import { cn } from "@/lib/utils";

import {
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  Users,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

import { ReportKpiCards } from "./components/ReportKpiCards";
import { ReportCharts } from "./components/ReportCharts";
import { AuditLogTab } from "./components/AuditLogTab";
import { CategoryBreakdownStrip } from "./components/ExpenseCategoryCard";
import { FestivalDetailsCard } from "./components/FestivalDetailsCard";

import { ContributionTable } from "@/pages/contributions/components/list/ContributionTable";
import { ExpenseTable } from "@/pages/expenses/components/list/ExpenseTable";
import { ContributorTable } from "@/pages/contributors/components/list/ContributorTable";

import {
  generateFestivalReportPdf,
  generateFilteredContributionsPdf,
  generateFilteredExpensesPdf,
} from "@/utils/pdfReportGenerator";
import { exportToCsv } from "@/utils/excelCsvReportExporter";
import type { ContributionListItem, ExpenseListItem, ExpenseStatus, Contributor } from "@/types/Types";

type ReportTab =
  | "summary"
  | "contributions"
  | "expenses"
  | "contributors"
  | "analytics"
  | "audit";

type SortField = "date" | "amount" | "name" | "status";
type SortOrder = "asc" | "desc";

interface TabItemConfig {
  id: ReportTab;
  label: string;
  icon: React.ReactNode;
  activeClass: string;
}

export const ReportsPage = () => {
  const navigate = useNavigate();
  const theme = getModuleTheme("reports");

  // Local & Store fallback state
  const {
    festivals: storeFestivals,
    contributions: storeContributions,
    expenses: storeExpenses,
    contributors: storeContributors,
  } = useFestivalStore();

  // Single source of truth: active festival id lives in the shared API store (topbar selector)
  const { activeFestivalId } = useFestivalApiStore();

  // Dynamic API queries & mutations
  const { data: apiFestivalsData } = useFestivals();
  const { data: apiContributionsData, isLoading: isLoadingContributions } = useContributions();
  const { data: apiExpensesData, isLoading: isLoadingExpenses } = useExpenses();
  const { data: apiContributorsData, isLoading: isLoadingContributors } = useContributors();
  const downloadContributorsPdf = useDownloadContributorsPdf();
  const updateContributionStatus = useUpdateContributionStatus();
  const downloadContributionSlip = useDownloadContributionSlip();
  const updateExpenseStatus = useUpdateExpenseStatus();

  const festivals = useMemo(() => {
    if (apiFestivalsData?.festivals && apiFestivalsData.festivals.length > 0) {
      return apiFestivalsData.festivals.map((f) => ({
        id: f._id,
        name: f.name,
        year: f.year || 2025,
        startDate: typeof f.startDate === "string" ? f.startDate : "",
        endDate: typeof f.endDate === "string" ? f.endDate : "",
        targetAmount: f.targetAmount || 0,
        stats: {
          openingBalance: f.stats?.openingBalance || 25000,
          totalCollected: f.stats?.totalCollected || 0,
          pendingAmount: f.stats?.pendingAmount || 0,
          totalExpenses: f.stats?.totalExpenses || 0,
          currentBalance: f.stats?.currentBalance || 0,
        },
        status: (f.status || "ACTIVE") as any,
        location: f.location || "",
        category: f.category || "",
        contributorsCount: f.stats?.contributorsCount || 0,
        description: f.description || "",
      }));
    }
    return storeFestivals;
  }, [apiFestivalsData, storeFestivals]);

  const contributions = useMemo(() => {
    if (apiContributionsData?.contributions && apiContributionsData.contributions.length > 0) {
      return apiContributionsData.contributions.map((c) => ({
        id: c._id,
        _id: c._id,
        contributionCode: c.contributionCode || "",
        receiptNo: c.contributionCode || c._id.slice(-6),
        festivalId: c.festival?._id || "",
        contributorId: c.contributor?._id || "",
        contributorName: c.contributor?.name || "Contributor",
        contributorPhone: c.contributor?.phoneNumber || "",
        contributorCategory: (c.contributor?.category || "PARENT") as any,
        type: (c.type === "ITEM" ? "ITEM" : "MONEY") as any,
        amount: c.amount || 0,
        paymentMode: (c.paymentMode === "UPI" ? "UPI" : "CASH") as any,
        status: (c.status === "PENDING" ? "PENDING" : c.status === "CANCELLED" ? "CANCELLED" : "DEPOSITED") as any,
        date: c.date ? c.date.slice(0, 10) : "",
        notes: "",
      }));
    }
    return storeContributions;
  }, [apiContributionsData, storeContributions]);

  const expenses = useMemo(() => {
    if (apiExpensesData?.expenses && apiExpensesData.expenses.length > 0) {
      return apiExpensesData.expenses.map((e) => ({
        id: e._id,
        _id: e._id,
        expenseCode: e.expenseCode || "",
        voucherNo: e.expenseCode || e._id.slice(-6),
        festivalId: e.festival?._id || "",
        title: e.description || e.vendorName || "Expense",
        category: (e.category || "OTHER") as any,
        amount: e.amount || 0,
        paidTo: e.vendorName || "Vendor",
        paymentMode: (e.paymentMode === "UPI" ? "UPI" : "CASH") as any,
        date: e.date ? e.date.slice(0, 10) : "",
        status: (e.status || "Approved") as any,
        notes: e.description,
      }));
    }
    return storeExpenses;
  }, [apiExpensesData, storeExpenses]);

  const contributors = useMemo(() => {
    if (apiContributorsData?.contributors && apiContributorsData.contributors.length > 0) {
      return apiContributorsData.contributors.map((c) => ({
        id: c._id,
        _id: c._id,
        festivalId: "",
        contributorCode: c.contributorCode || "",
        name: c.name || "",
        phone: c.phoneNumber || "",
        email: c.email || "",
        category: (c.category || "PARENT") as any,
        totalContributed: 0,
        status: (c.isActive ? "Active" : "Pending") as any,
        locality: c.notes || "",
      }));
    }
    return storeContributors;
  }, [apiContributorsData, storeContributors]);

  // Tab State
  const [activeTab, setActiveTab] = useState<ReportTab>("summary");

  // Default Select One Specific Festival (Topbar activeFestivalId is the single source of truth)
  const effectiveFestivalId = activeFestivalId || "";
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [contributorCategoryFilter, setContributorCategoryFilter] = useState<string>("ALL");
  const [paymentModeFilter, setPaymentModeFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [datePreset, setDatePreset] = useState<string>("ALL");

  // Table Sorting State
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Active Festival Object
  const activeFest = useMemo(() => {
    return festivals.find((f) => f.id === effectiveFestivalId) || festivals[0];
  }, [festivals, effectiveFestivalId]);

  const handleResetFilters = () => {
    setStatusFilter("ALL");
    setCategoryFilter("ALL");
    setContributorCategoryFilter("ALL");
    setPaymentModeFilter("ALL");
    setSearchQuery("");
    setDatePreset("ALL");
  };

  const { data: apiStatsData } = useFestivalStats(activeFest?.id || "");

  // 1. FILTERING LOGIC
  const filteredContributions = useMemo(() => {
    return contributions.filter((c) => {
      if (effectiveFestivalId && c.festivalId && c.festivalId !== effectiveFestivalId) return false;
      if (statusFilter !== "ALL" && c.status !== statusFilter) return false;
      if (paymentModeFilter !== "ALL" && c.paymentMode !== paymentModeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = c.contributorName?.toLowerCase().includes(q);
        const receiptMatch = c.receiptNo?.toLowerCase().includes(q);
        const codeMatch = c.contributionCode?.toLowerCase().includes(q);
        if (!nameMatch && !receiptMatch && !codeMatch) return false;
      }
      if (c.date) {
        const itemDate = new Date(c.date);
        const now = new Date();
        if (datePreset === "TODAY") {
          if (itemDate.toDateString() !== now.toDateString()) return false;
        } else if (datePreset === "THIS_WEEK") {
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (itemDate < sevenDaysAgo) return false;
        } else if (datePreset === "THIS_MONTH") {
          if (itemDate.getMonth() !== now.getMonth() || itemDate.getFullYear() !== now.getFullYear())
            return false;
        }
      }
      return true;
    });
  }, [contributions, effectiveFestivalId, statusFilter, paymentModeFilter, searchQuery, datePreset]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      if (effectiveFestivalId && e.festivalId && e.festivalId !== effectiveFestivalId) return false;
      if (categoryFilter !== "ALL" && e.category !== categoryFilter) return false;
      if (paymentModeFilter !== "ALL" && e.paymentMode !== paymentModeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = e.title?.toLowerCase().includes(q);
        const voucherMatch = e.voucherNo?.toLowerCase().includes(q);
        const payeeMatch = e.paidTo?.toLowerCase().includes(q);
        const descMatch = e.notes?.toLowerCase().includes(q);
        if (!titleMatch && !voucherMatch && !payeeMatch && !descMatch) return false;
      }
      if (e.date) {
        const itemDate = new Date(e.date);
        const now = new Date();
        if (datePreset === "TODAY") {
          if (itemDate.toDateString() !== now.toDateString()) return false;
        } else if (datePreset === "THIS_WEEK") {
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (itemDate < sevenDaysAgo) return false;
        } else if (datePreset === "THIS_MONTH") {
          if (itemDate.getMonth() !== now.getMonth() || itemDate.getFullYear() !== now.getFullYear())
            return false;
        }
      }
      return true;
    });
  }, [expenses, effectiveFestivalId, categoryFilter, paymentModeFilter, searchQuery, datePreset]);

  const filteredContributors = useMemo(() => {
    return contributors.filter((c) => {
      if (contributorCategoryFilter !== "ALL" && c.category !== contributorCategoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = c.name?.toLowerCase().includes(q);
        const codeMatch = c.contributorCode?.toLowerCase().includes(q);
        const phoneMatch = c.phone?.toLowerCase().includes(q);
        if (!nameMatch && !codeMatch && !phoneMatch) return false;
      }
      return true;
    });
  }, [contributors, contributorCategoryFilter, searchQuery]);

  // 2. FINANCIAL STATS & METRICS CALCULATIONS (EXACT MATCH FOR STANDALONE MODULE KPIS)
  const openingBalance = apiStatsData?.openingBalance ?? (activeFest?.stats?.openingBalance || 25000);
  const totalCollected = filteredContributions.reduce(
    (acc, c) => acc + (c.status === "DEPOSITED" ? c.amount : 0),
    0
  );
  const pendingAmount = filteredContributions.reduce(
    (acc, c) => acc + (c.status === "PENDING" ? c.amount : 0),
    0
  );
  const totalSpent = filteredExpenses.reduce((acc, e) => acc + e.amount, 0);
  const currentBalance = openingBalance + totalCollected - totalSpent;
  const transactionCount = filteredContributions.length + filteredExpenses.length;
  const contributorCount = new Set(filteredContributions.map((c) => c.contributorId).filter(Boolean)).size;

  const itemContributionsCount = filteredContributions.filter((c) => c.type === "ITEM").length;
  const pendingExpenseAmount = filteredExpenses
    .filter((e) => e.status === "PENDING" || e.status === "Pending")
    .reduce((a, b) => a + b.amount, 0);
  const paidExpenseAmount = filteredExpenses
    .filter((e) => e.status === "PAID" || e.status === "Approved" || e.status === "Deposited")
    .reduce((a, b) => a + b.amount, 0);
  const cancelledExpensesCount = filteredExpenses.filter((e) => e.status === "CANCELLED" || e.status === "Cancelled").length;

  const parentContributorsCount = contributors.filter((c) => c.category === "PARENT").length;
  const boyContributorsCount = contributors.filter((c) => c.category === "BOY").length;
  const girlContributorsCount = contributors.filter((c) => c.category === "GIRL").length;

  const categoryTotals = {
    FOOD: filteredExpenses.filter((e) => e.category === "FOOD").reduce((a, b) => a + b.amount, 0),
    DECORATION: filteredExpenses.filter((e) => e.category === "DECORATION").reduce((a, b) => a + b.amount, 0),
    SERVICES: filteredExpenses.filter((e) => e.category === "SERVICES").reduce((a, b) => a + b.amount, 0),
    CULTURAL: filteredExpenses.filter((e) => e.category === "CULTURAL").reduce((a, b) => a + b.amount, 0),
    OTHER: filteredExpenses.filter((e) => e.category === "OTHER").reduce((a, b) => a + b.amount, 0),
  };

  // 3. ADAPTIVE TABLE LIST MAPPINGS
  const tableContributions: ContributionListItem[] = useMemo(() => {
    if (apiContributionsData?.contributions && apiContributionsData.contributions.length > 0) {
      return filteredContributions.map((c) => {
        const itemObj = c as any;
        const orig = apiContributionsData.contributions.find((raw: any) => raw._id === itemObj.id || raw._id === itemObj._id);
        if (orig) return orig;
        return {
          _id: itemObj.id || itemObj._id,
          contributionCode: c.receiptNo || c.contributionCode || "",
          type: c.type || "MONEY",
          status: c.status || "DEPOSITED",
          paymentMode: c.paymentMode || "CASH",
          date: c.date,
          amount: c.amount,
          isBalanceApplied: false,
          contributor: {
            _id: c.contributorId || "",
            name: c.contributorName,
            category: c.contributorCategory,
            phoneNumber: c.contributorPhone,
          },
          festival: {
            _id: c.festivalId || "",
            name: activeFest?.name,
          },
        } as ContributionListItem;
      });
    }
    return filteredContributions.map((c) => {
      const itemObj = c as any;
      return {
        _id: itemObj.id || itemObj._id,
        contributionCode: c.receiptNo || c.contributionCode || "",
        type: c.type || "MONEY",
        status: c.status || "DEPOSITED",
        paymentMode: c.paymentMode || "CASH",
        date: c.date,
        amount: c.amount,
        isBalanceApplied: false,
        contributor: {
          _id: c.contributorId || "",
          name: c.contributorName,
          category: c.contributorCategory,
          phoneNumber: c.contributorPhone,
        },
        festival: {
          _id: c.festivalId || "",
          name: activeFest?.name,
        },
      } as ContributionListItem;
    });
  }, [apiContributionsData, filteredContributions, activeFest]);

  const tableExpenses: ExpenseListItem[] = useMemo(() => {
    if (apiExpensesData?.expenses && apiExpensesData.expenses.length > 0) {
      return filteredExpenses.map((e) => {
        const itemObj = e as any;
        const orig = apiExpensesData.expenses.find((raw: any) => raw._id === itemObj.id || raw._id === itemObj._id);
        if (orig) return orig;
        return {
          _id: itemObj.id || itemObj._id,
          expenseCode: e.voucherNo || e.expenseCode || "",
          category: e.category || "OTHER",
          amount: e.amount,
          description: e.title || e.notes,
          date: e.date,
          vendorName: e.paidTo,
          paymentMode: e.paymentMode || "CASH",
          status: (e.status === "Approved" || e.status === "PAID" ? "PAID" : e.status === "CANCELLED" ? "CANCELLED" : "PENDING") as ExpenseStatus,
          isBalanceApplied: false,
          festival: {
            _id: e.festivalId || "",
            name: activeFest?.name,
          },
        } as ExpenseListItem;
      });
    }
    return filteredExpenses.map((e) => {
      const itemObj = e as any;
      return {
        _id: itemObj.id || itemObj._id,
        expenseCode: e.voucherNo || e.expenseCode || "",
        category: e.category || "OTHER",
        amount: e.amount,
        description: e.title || e.notes,
        date: e.date,
        vendorName: e.paidTo,
        paymentMode: e.paymentMode || "CASH",
        status: (e.status === "Approved" || e.status === "PAID" ? "PAID" : e.status === "CANCELLED" ? "CANCELLED" : "PENDING") as ExpenseStatus,
        isBalanceApplied: false,
        festival: {
          _id: e.festivalId || "",
          name: activeFest?.name,
        },
      } as ExpenseListItem;
    });
  }, [apiExpensesData, filteredExpenses, activeFest]);

  const tableContributors: Contributor[] = useMemo(() => {
    if (apiContributorsData?.contributors && apiContributorsData.contributors.length > 0) {
      return filteredContributors.map((c) => {
        const itemObj = c as any;
        const orig = apiContributorsData.contributors.find((raw: any) => raw._id === itemObj.id || raw._id === itemObj._id);
        if (orig) return orig;
        return {
          _id: itemObj.id || itemObj._id,
          organizationId: "",
          contributorCode: c.contributorCode || "",
          name: c.name,
          phoneNumber: c.phone,
          email: c.email,
          category: c.category || "PARENT",
          isActive: c.status === "Active",
          createdAt: new Date().toISOString(),
        } as Contributor;
      });
    }
    return filteredContributors.map((c) => {
      const itemObj = c as any;
      return {
        _id: itemObj.id || itemObj._id,
        organizationId: "",
        contributorCode: c.contributorCode || "",
        name: c.name,
        phoneNumber: c.phone,
        email: c.email,
        category: c.category || "PARENT",
        isActive: c.status === "Active",
        createdAt: new Date().toISOString(),
      } as Contributor;
    });
  }, [apiContributorsData, filteredContributors]);

  // 4. DRILL DOWN HANDLERS
  const handleCategoryDrillDown = (categoryKey: "FOOD" | "DECORATION" | "SERVICES" | "CULTURAL" | "OTHER" | string) => {
    setCategoryFilter(categoryKey);
    setActiveTab("expenses");
  };

  // 5. EXPORT HANDLERS
  const handleExportPdf = () => {
    generateFestivalReportPdf({
      festival: activeFest,
      contributions: filteredContributions,
      expenses: filteredExpenses,
      openingBalance,
      totalCollected,
      pendingAmount,
      totalSpent,
      currentBalance,
      categoryTotals,
      filteredDateLabel: searchQuery || statusFilter !== "ALL" || categoryFilter !== "ALL"
        ? `Search: "${searchQuery}" | Status: ${statusFilter} | Category: ${categoryFilter}`
        : undefined,
    });
  };

  const handleExportFilteredContributionsPdf = () => {
    generateFilteredContributionsPdf({
      festivalName: activeFest?.name || "Festival",
      items: filteredContributions,
      filterLabel: searchQuery || statusFilter !== "ALL"
        ? `Search: "${searchQuery}" | Status: ${statusFilter}`
        : "All Contributions",
      totalAmount: totalCollected,
    });
  };

  const handleExportFilteredExpensesPdf = () => {
    generateFilteredExpensesPdf({
      festivalName: activeFest?.name || "Festival",
      items: filteredExpenses,
      filterLabel: searchQuery || categoryFilter !== "ALL"
        ? `Search: "${searchQuery}" | Category: ${categoryFilter}`
        : "All Expenses",
      totalAmount: totalSpent,
    });
  };

  const handleExportCsv = () => {
    if (activeTab === "expenses") {
      exportToCsv("Festival_Expenses_Report", filteredExpenses, [
        { header: "Voucher #", accessor: (e) => e.voucherNo },
        { header: "Title", accessor: (e) => e.title },
        { header: "Category", accessor: (e) => e.category },
        { header: "Paid To", accessor: (e) => e.paidTo },
        { header: "Amount (INR)", accessor: (e) => e.amount },
        { header: "Date", accessor: (e) => e.date },
      ]);
    } else if (activeTab === "contributions") {
      exportToCsv("Festival_Contributions_Report", filteredContributions, [
        { header: "Receipt #", accessor: (c) => c.receiptNo },
        { header: "Contributor", accessor: (c) => c.contributorName },
        { header: "Amount (INR)", accessor: (c) => c.amount },
        { header: "Payment Mode", accessor: (c) => c.paymentMode || "CASH" },
        { header: "Date", accessor: (c) => c.date },
        { header: "Status", accessor: (c) => c.status },
      ]);
    } else {
      exportToCsv("Festival_Financial_Summary", [
        { Metric: "Opening Balance", Amount: openingBalance },
        { Metric: "Total Collected", Amount: totalCollected },
        { Metric: "Pending Pledges", Amount: pendingAmount },
        { Metric: "Total Spent", Amount: totalSpent },
        { Metric: "Current Net Balance", Amount: currentBalance },
      ], [
        { header: "Financial Metric", accessor: (row) => row.Metric },
        { header: "Amount (INR)", accessor: (row) => row.Amount },
      ]);
    }
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  // 6. DYNAMIC TAB-AWARE PAGEFILTERTOOLBAR CONFIGURATION & THEME
  const toolbarModule = useMemo(() => {
    if (activeTab === "contributions") return "contributions";
    if (activeTab === "expenses") return "expenses";
    if (activeTab === "contributors") return "contributors";
    if (activeTab === "analytics") return "analytics";
    if (activeTab === "audit") return "audit-logs";
    return "reports";
  }, [activeTab]);

  const searchPlaceholder =
    activeTab === "contributions"
      ? "Search receipt #, contributor name..."
      : activeTab === "expenses"
        ? "Search voucher #, title, payee..."
        : activeTab === "contributors"
          ? "Search contributor code, name, phone..."
          : "Search festival reports...";

  const pillGroups: InlinePillGroup[] = useMemo(() => {
    if (activeTab === "contributions") {
      return [
        {
          id: "status_pills",
          label: "Status",
          value: statusFilter,
          options: [
            { value: "ALL", label: "All Statuses", count: contributions.length },
            { value: "DEPOSITED", label: "Deposited", count: contributions.filter((c) => c.status === "DEPOSITED").length },
            { value: "PENDING", label: "Pending", count: contributions.filter((c) => c.status === "PENDING").length },
            { value: "CANCELLED", label: "Cancelled", count: contributions.filter((c) => c.status === "CANCELLED").length },
          ],
          onChange: setStatusFilter,
          variant: "purple",
        },
      ];
    } else if (activeTab === "expenses") {
      return [
        {
          id: "category_pills",
          label: "Category",
          value: categoryFilter,
          options: [
            { value: "ALL", label: "All Categories", count: expenses.length },
            { value: "FOOD", label: "Food & Prasad", count: expenses.filter((e) => e.category === "FOOD").length },
            { value: "DECORATION", label: "Stage & Decoration", count: expenses.filter((e) => e.category === "DECORATION").length },
            { value: "SERVICES", label: "Sound & Services", count: expenses.filter((e) => e.category === "SERVICES").length },
            { value: "CULTURAL", label: "Cultural", count: expenses.filter((e) => e.category === "CULTURAL").length },
            { value: "OTHER", label: "Other", count: expenses.filter((e) => e.category === "OTHER").length },
          ],
          onChange: setCategoryFilter,
          variant: "rose",
        },
      ];
    } else if (activeTab === "contributors") {
      return [
        {
          id: "contributor_category_pills",
          label: "Category",
          value: contributorCategoryFilter,
          options: [
            { value: "ALL", label: "All Categories", count: contributors.length },
            { value: "PARENT", label: "Parents", count: contributors.filter((c) => c.category === "PARENT").length },
            { value: "BOY", label: "Boys", count: contributors.filter((c) => c.category === "BOY").length },
            { value: "GIRL", label: "Girls", count: contributors.filter((c) => c.category === "GIRL").length },
          ],
          onChange: setContributorCategoryFilter,
          variant: "emerald",
        },
      ];
    }
    return [];
  }, [activeTab, statusFilter, categoryFilter, contributorCategoryFilter, contributions, expenses, contributors]);

  const quickFilters: QuickFilterGroup[] = useMemo(() => {
    return [
      {
        id: "date_preset",
        label: "Date Range",
        value: datePreset,
        options: [
          { value: "ALL", label: "All Time" },
          { value: "TODAY", label: "Today" },
          { value: "THIS_WEEK", label: "This Week" },
          { value: "THIS_MONTH", label: "This Month" },
        ],
        onChange: setDatePreset,
      },
      ...(activeTab === "contributions" || activeTab === "expenses"
        ? [
            {
              id: "payment_mode",
              label: "Payment Channel",
              value: paymentModeFilter,
              options: [
                { value: "ALL", label: "All Channels" },
                { value: "CASH", label: "Cash" },
                { value: "UPI", label: "UPI / QR" },
              ],
              onChange: setPaymentModeFilter,
            },
          ]
        : []),
    ];
  }, [datePreset, paymentModeFilter, activeTab]);

  const sortOptions: SortOption[] = useMemo(() => {
    return [
      { id: "date", label: "Date" },
      { id: "amount", label: "Amount" },
      { id: "name", label: "Name" },
    ];
  }, []);

  const reportTabsConfig: TabItemConfig[] = useMemo(
    () => [
      {
        id: "summary",
        label: "Festival Summary",
        icon: <FileText className="h-4 w-4" />,
        activeClass: "bg-gradient-to-r from-sky-500 to-blue-600 text-white border-blue-600 shadow-md font-extrabold scale-[1.02]",
      },
      {
        id: "contributions",
        label: `Contributions (${filteredContributions.length})`,
        icon: <TrendingUp className="h-4 w-4" />,
        activeClass: "bg-gradient-to-r from-violet-500 to-purple-600 text-white border-purple-600 shadow-md font-extrabold scale-[1.02]",
      },
      {
        id: "expenses",
        label: `Expenses (${filteredExpenses.length})`,
        icon: <TrendingDown className="h-4 w-4" />,
        activeClass: "bg-gradient-to-r from-rose-500 to-red-600 text-white border-red-600 shadow-md font-extrabold scale-[1.02]",
      },
      {
        id: "contributors",
        label: "Contributors",
        icon: <Users className="h-4 w-4" />,
        activeClass: "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-emerald-600 shadow-md font-extrabold scale-[1.02]",
      },
      {
        id: "analytics",
        label: "Analytics Dashboard",
        icon: <BarChart3 className="h-4 w-4" />,
        activeClass: "bg-gradient-to-r from-red-500 to-orange-600 text-white border-orange-600 shadow-md font-extrabold scale-[1.02]",
      },
      {
        id: "audit",
        label: "Audit Log",
        icon: <ShieldCheck className="h-4 w-4" />,
        activeClass: "bg-gradient-to-r from-slate-600 to-zinc-700 text-white border-slate-600 shadow-md font-extrabold scale-[1.02]",
      },
    ],
    [filteredContributions.length, filteredExpenses.length]
  );

  return (
    <PageContainer variant="list">
      {/* 1. PAGE HEADER COMPONENT FOLLOWING SYSTEM MODULE DESIGN */}
      <PageHeader
        title="Reports & Analytics"
        description="Comprehensive multi-dimensional financial reports & auditor-ready exports"
        module="reports"
        breadcrumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Reports" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <AppButton
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
              leftIcon={<Download className="h-4 w-4 text-emerald-600" />}
            >
              Export CSV
            </AppButton>

            <AppButton
              variant="default"
              size="sm"
              onClick={handleExportPdf}
              leftIcon={<Download className="h-4 w-4" />}
              className={cn("text-white font-bold shadow-md", theme.gradient)}
            >
              Export Complete Report (PDF)
            </AppButton>
          </div>
        }
      />

      {/* 2. RESPONSIVE HORIZONTAL SCROLLABLE TAB NAVIGATION (6 CORE TABS WITH RICH MODULE THEME GRADIENTS) */}
      <div className="p-2 rounded-2xl bg-card border border-border/80 shadow-xs overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max text-xs font-bold">
          {reportTabsConfig.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? tab.activeClass
                  : "bg-transparent text-foreground border-transparent hover:bg-muted"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. DYNAMIC TAB-AWARE PAGEFILTERTOOLBAR (EXPLICITLY HIDDEN ON FESTIVAL SUMMARY TAB) */}
      {activeTab !== "summary" && (
        <PageFilterToolbar
          module={toolbarModule}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder={searchPlaceholder}
          pillGroups={pillGroups}
          quickFilters={quickFilters}
          sortOptions={sortOptions}
          activeSort={sortField}
          sortDirection={sortOrder}
          onSortChange={(sortId) => toggleSort(sortId as SortField)}
          onResetAll={handleResetFilters}
        />
      )}

      {/* 4. CONTEXT-SPECIFIC TAB KPI METRIC CARDS (EXACTLY MATCHES STANDALONE MODULE KPIS) */}
      <ReportKpiCards
        activeTab={activeTab}
        openingBalance={openingBalance}
        totalCollected={totalCollected}
        totalSpent={totalSpent}
        currentBalance={currentBalance}
        pendingAmount={pendingAmount}
        transactionCount={transactionCount}
        contributorCount={contributorCount}
        itemContributionsCount={itemContributionsCount}
        pendingExpenseAmount={pendingExpenseAmount}
        paidExpenseAmount={paidExpenseAmount}
        cancelledExpensesCount={cancelledExpensesCount}
        totalContributorsRegistered={contributors.length}
        parentContributorsCount={parentContributorsCount}
        boyContributorsCount={boyContributorsCount}
        girlContributorsCount={girlContributorsCount}
      />

      {/* 5. TAB CONTENT RENDERING */}

      {/* TAB 1: FESTIVAL SUMMARY VIEW */}
      {activeTab === "summary" && (
        <div className="space-y-6">
          {/* FESTIVAL DETAILS OVERVIEW CARD */}
          <FestivalDetailsCard
            festival={activeFest}
            totalCollected={totalCollected}
            totalSpent={totalSpent}
            currentBalance={currentBalance}
          />

          {/* EXPENSE CATEGORY BREAKDOWN STRIP (MATCHES EXPENSES PAGE BREAKDOWN CARD EXACTLY) */}
          <CategoryBreakdownStrip
            categoryTotals={categoryTotals}
            totalSpent={totalSpent}
            onSelectCategory={handleCategoryDrillDown}
          />
        </div>
      )}

      {/* TAB 2: DETAILED CONTRIBUTIONS REPORT WITH STANDALONE CONTRIBUTION TABLE & FILTERED PDF EXPORT */}
      {activeTab === "contributions" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-purple-600">
              <TrendingUp className="h-5 w-5" />
              <h2 className="text-base font-bold text-foreground">Detailed Contributions Ledger</h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-2xs text-muted-foreground font-semibold">
                Showing {filteredContributions.length} records
              </span>

              <AppButton
                variant="outline"
                size="sm"
                onClick={handleExportFilteredContributionsPdf}
                leftIcon={<Download className="h-3.5 w-3.5 text-purple-600" />}
              >
                Export Filtered PDF
              </AppButton>
            </div>
          </div>

          <ContributionTable
            contributions={tableContributions}
            isLoading={isLoadingContributions}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={(field) => toggleSort(field as SortField)}
            onEdit={(c) => navigate({ to: "/dashboard/contributions/$contributionId", params: { contributionId: c._id } })}
            onDelete={() => {}}
            onRowClick={(c) => navigate({ to: "/dashboard/contributions/$contributionId", params: { contributionId: c._id } })}
            onStatusChange={(id, status, reason) => updateContributionStatus.mutateAsync({ id, status, reason })}
            onDownloadSlip={(id) => downloadContributionSlip.mutate(id)}
          />
        </div>
      )}

      {/* TAB 3: DETAILED EXPENSES REPORT WITH STANDALONE EXPENSE TABLE & FILTERED PDF EXPORT */}
      {activeTab === "expenses" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-rose-500">
              <TrendingDown className="h-5 w-5" />
              <h2 className="text-base font-bold text-foreground">Detailed Expenses Ledger</h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-2xs text-muted-foreground font-semibold">
                Showing {filteredExpenses.length} records
              </span>

              <AppButton
                variant="outline"
                size="sm"
                onClick={handleExportFilteredExpensesPdf}
                leftIcon={<Download className="h-3.5 w-3.5 text-rose-600" />}
              >
                Export Filtered PDF
              </AppButton>
            </div>
          </div>

          <ExpenseTable
            expenses={tableExpenses}
            isLoading={isLoadingExpenses}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={(field) => toggleSort(field as SortField)}
            onRowClick={(e) => navigate({ to: "/dashboard/expenses/$expenseId", params: { expenseId: e._id } })}
            onEdit={(e) => navigate({ to: "/dashboard/expenses/$expenseId", params: { expenseId: e._id } })}
            onDelete={() => {}}
            onStatusChange={(id, status, reason) => updateExpenseStatus.mutateAsync({ id, status, reason })}
          />
        </div>
      )}

      {/* TAB 4: CONTRIBUTORS DIRECTORY SUMMARY WITH STANDALONE CONTRIBUTOR TABLE & EXPORT */}
      {activeTab === "contributors" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-emerald-600">
              <Users className="h-5 w-5" />
              <h2 className="text-base font-bold text-foreground">Contributors Directory Summary</h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-2xs text-muted-foreground font-semibold">
                Total {filteredContributors.length} registered contributors
              </span>

              <AppButton
                variant="outline"
                size="sm"
                onClick={() => downloadContributorsPdf.mutate()}
                leftIcon={<Download className="h-3.5 w-3.5 text-emerald-600" />}
              >
                Export Contributors PDF
              </AppButton>
            </div>
          </div>

          <ContributorTable
            contributors={tableContributors}
            isLoading={isLoadingContributors}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={(field) => toggleSort(field as SortField)}
            onEdit={(c) => navigate({ to: "/dashboard/contributors/$contributorId", params: { contributorId: c._id } })}
            onDelete={() => {}}
            onRowClick={(c) => navigate({ to: "/dashboard/contributors/$contributorId", params: { contributorId: c._id } })}
          />
        </div>
      )}

      {/* TAB 5: ANALYTICS DASHBOARD TAB */}
      {activeTab === "analytics" && (
        <ReportCharts
          contributions={filteredContributions}
          expenses={filteredExpenses}
          onSelectCategory={handleCategoryDrillDown}
        />
      )}

      {/* TAB 6: AUDIT LOG TAB */}
      {activeTab === "audit" && (
        <AuditLogTab contributions={filteredContributions} expenses={filteredExpenses} />
      )}
    </PageContainer>
  );
};

export default ReportsPage;
