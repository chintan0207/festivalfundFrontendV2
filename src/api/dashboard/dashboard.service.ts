import type {
  ContributionStatus,
  ContributionType,
  ExpenseCategory,
  ExpenseStatus,
  PaymentMode,
} from "@/types/Types";
import ApiClient from "../apiClient";

export type ApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
};

export interface DashboardTrend {
  value: number;
  previous: number;
  pct: number | null;
}

export interface DashboardTrends {
  income: DashboardTrend;
  expense: DashboardTrend;
}

export interface DashboardStatusBucket {
  total: number;
  count: number;
}

export interface DashboardContributionRecent {
  _id: string;
  contributionCode: string;
  type: ContributionType;
  status: ContributionStatus;
  paymentMode: PaymentMode;
  date: string;
  amount: number;
  itemName?: string;
  quantity?: number | null;
  estimatedValue?: number;
  contributor: {
    name: string;
    category: string;
    phoneNumber?: string;
  } | null;
}

export interface DashboardExpenseRecent {
  _id: string;
  expenseCode: string;
  category: ExpenseCategory | string;
  amount: number;
  date: string;
  status: ExpenseStatus;
  description?: string;
  vendorName?: string;
  paymentMode: PaymentMode;
}

export type DashboardActivityType =
  | "CONTRIBUTION"
  | "CONTRIBUTION_STATUS"
  | "EXPENSE"
  | "EXPENSE_STATUS"
  | "CONTRIBUTOR";

export interface DashboardActivityEvent {
  id: string;
  type: DashboardActivityType;
  /** Entity the event belongs to — used to deep-link from activity/notifications. */
  targetType?: "contribution" | "expense" | "contributor";
  targetId?: string;
  code: string;
  title: string;
  subtitle: string;
  amount: number;
  date: string;
  status: string;
  user?: string;
}

export interface DashboardData {
  festival: {
    _id: string;
    name: string;
    year: number;
    status: string;
    targetAmount: number;
    category?: string;
    location?: string;
    description?: string;
    bannerUrl?: string;
    startDate: string | null;
    endDate: string | null;
    createdAt: string | null;
  };
  stats: {
    openingBalance: number;
    totalCollected: number;
    pendingAmount: number;
    totalExpenses: number;
    currentBalance: number;
    contributorsCount: number;
    itemCount: number;
    categoryTotals: Record<string, number>;
  };
  contributions: {
    totalCount: number;
    statusCounts: {
      total: DashboardStatusBucket;
      DEPOSITED: DashboardStatusBucket;
      PENDING: DashboardStatusBucket;
      CANCELLED: DashboardStatusBucket;
    };
    byType: {
      total: DashboardStatusBucket;
      MONEY: DashboardStatusBucket;
      ITEM: DashboardStatusBucket;
    };
    byPaymentMode: {
      paymentMode: PaymentMode;
      total: number;
      count: number;
    }[];
    byContributorCategory: {
      category: string;
      total: number;
      count: number;
    }[];
    timeSeries: { date: string; income: number; count: number }[];
    topContributors: {
      contributorId: string;
      name: string;
      category: string;
      total: number;
      count: number;
    }[];
    recent: DashboardContributionRecent[];
  };
  expenses: {
    totalCount: number;
    statusCounts: {
      total: DashboardStatusBucket;
      PAID: DashboardStatusBucket;
      PENDING: DashboardStatusBucket;
      CANCELLED: DashboardStatusBucket;
    };
    byCategory: {
      category: ExpenseCategory | string;
      total: number;
      count: number;
    }[];
    timeSeries: { date: string; expense: number; count: number }[];
    recent: DashboardExpenseRecent[];
  };
  activity: DashboardActivityEvent[];
  /** Total number of activity events for the festival before pagination slicing. */
  activityTotal: number;
  trends: DashboardTrends;
}

export const DashboardService = {
  getDashboard: async (festivalId: string): Promise<ApiResponse<DashboardData>> => {
    const response = await ApiClient.get<ApiResponse<DashboardData>>("/dashboard", {
      params: { festivalId },
    });
    return response.data;
  },

  /** Paginated, complete-festival activity feed used by Reports → Audit Log. */
  getActivity: async (
    festivalId: string,
    { limit, offset }: { limit: number; offset: number },
  ): Promise<ApiResponse<DashboardData>> => {
    const response = await ApiClient.get<ApiResponse<DashboardData>>("/dashboard", {
      params: {
        festivalId,
        activityFull: true,
        activityLimit: limit,
        activityOffset: offset,
      },
    });
    return response.data;
  },
};
