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

export interface DashboardTask {
  _id: string;
  title: string;
  description?: string;
  assignedTo?: string | { _id: string; name: string; email?: string };
  dueDate?: string;
  reminderAt?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "TODO" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  isCompleted?: boolean;
  relatedModule?: string;
  relatedEntityId?: string;
  createdBy?: string | { _id: string; name: string; email?: string };
  updatedBy?: string | { _id: string; name: string; email?: string };
  createdAt?: string;
  updatedAt?: string;
}

export interface NoteImage {
  url: string;
  key?: string;
  caption?: string;
}

export interface NoteChecklistItem {
  id?: string;
  text: string;
  isCompleted: boolean;
}

export interface DashboardNote {
  _id: string;
  title: string;
  content?: string;
  images?: NoteImage[];
  checklist?: NoteChecklistItem[];
  relatedModule?: string;
  relatedEntityId?: string;
  isPinned: boolean;
  createdBy?: string | { _id: string; name: string; email?: string };
  updatedBy?: string | { _id: string; name: string; email?: string };
  attachmentUrls?: string[];
  createdAt?: string;
  updatedAt?: string;
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
  tasks: DashboardTask[];
  notes: DashboardNote[];
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

  /** Fetch tasks for a festival */
  getTasks: async (festivalId: string): Promise<ApiResponse<DashboardTask[]>> => {
    const response = await ApiClient.get<ApiResponse<DashboardTask[]>>(`/festivals/tasks/${festivalId}`);
    return response.data;
  },

  /** Create a task for a festival */
  createTask: async (
    festivalId: string,
    payload: Partial<DashboardTask>,
  ): Promise<ApiResponse<DashboardTask>> => {
    const response = await ApiClient.post<ApiResponse<DashboardTask>>(
      `/festivals/tasks/${festivalId}`,
      payload,
    );
    return response.data;
  },

  /** Update a task */
  updateTask: async (
    festivalId: string,
    taskId: string,
    payload: Partial<DashboardTask>,
  ): Promise<ApiResponse<DashboardTask>> => {
    const response = await ApiClient.patch<ApiResponse<DashboardTask>>(
      `/festivals/tasks/${festivalId}/${taskId}`,
      payload,
    );
    return response.data;
  },

  /** Toggle task completed/reopen status */
  toggleTask: async (
    festivalId: string,
    taskId: string,
  ): Promise<ApiResponse<DashboardTask>> => {
    const response = await ApiClient.patch<ApiResponse<DashboardTask>>(
      `/festivals/tasks/${festivalId}/${taskId}/toggle`,
    );
    return response.data;
  },

  /** Mark task as completed */
  completeTask: async (
    festivalId: string,
    taskId: string,
  ): Promise<ApiResponse<DashboardTask>> => {
    const response = await ApiClient.patch<ApiResponse<DashboardTask>>(
      `/festivals/tasks/${festivalId}/${taskId}/complete`,
    );
    return response.data;
  },

  /** Mark task as cancelled */
  cancelTask: async (
    festivalId: string,
    taskId: string,
  ): Promise<ApiResponse<DashboardTask>> => {
    const response = await ApiClient.patch<ApiResponse<DashboardTask>>(
      `/festivals/tasks/${festivalId}/${taskId}/cancel`,
    );
    return response.data;
  },

  /** Fetch a single task by ID */
  getTaskById: async (
    festivalId: string,
    taskId: string,
  ): Promise<ApiResponse<DashboardTask>> => {
    const response = await ApiClient.get<ApiResponse<DashboardTask>>(
      `/festivals/tasks/${festivalId || "ALL"}/${taskId}`,
    );
    return response.data;
  },

  /** Delete a task */
  deleteTask: async (
    festivalId: string,
    taskId: string,
  ): Promise<ApiResponse<null>> => {
    const response = await ApiClient.delete<ApiResponse<null>>(
      `/festivals/tasks/${festivalId}/${taskId}`,
    );
    return response.data;
  },

  /** Fetch notes for a festival */
  getNotes: async (festivalId: string): Promise<ApiResponse<DashboardNote[]>> => {
    const response = await ApiClient.get<ApiResponse<DashboardNote[]>>(`/festivals/notes/${festivalId}`);
    return response.data;
  },

  /** Fetch a single note by ID */
  getNoteById: async (
    festivalId: string,
    noteId: string,
  ): Promise<ApiResponse<DashboardNote>> => {
    const response = await ApiClient.get<ApiResponse<DashboardNote>>(
      `/festivals/notes/${festivalId || "ALL"}/${noteId}`,
    );
    return response.data;
  },

  /** Create a note for a festival */
  createNote: async (
    festivalId: string,
    payload: {
      title: string;
      content?: string;
      images?: NoteImage[];
      checklist?: NoteChecklistItem[];
      relatedModule?: string;
      relatedEntityId?: string;
      attachmentUrls?: string[];
    },
  ): Promise<ApiResponse<DashboardNote>> => {
    const response = await ApiClient.post<ApiResponse<DashboardNote>>(
      `/festivals/notes/${festivalId}`,
      payload,
    );
    return response.data;
  },

  /** Update a note */
  updateNote: async (
    festivalId: string,
    noteId: string,
    payload: {
      title?: string;
      content?: string;
      images?: NoteImage[];
      checklist?: NoteChecklistItem[];
      relatedModule?: string;
      relatedEntityId?: string;
      attachmentUrls?: string[];
    },
  ): Promise<ApiResponse<DashboardNote>> => {
    const response = await ApiClient.patch<ApiResponse<DashboardNote>>(
      `/festivals/notes/${festivalId}/${noteId}`,
      payload,
    );
    return response.data;
  },

  /** Pin a note */
  pinNote: async (
    festivalId: string,
    noteId: string,
  ): Promise<ApiResponse<DashboardNote>> => {
    const response = await ApiClient.patch<ApiResponse<DashboardNote>>(
      `/festivals/notes/${festivalId}/${noteId}/pin`,
    );
    return response.data;
  },

  /** Unpin a note */
  unpinNote: async (
    festivalId: string,
    noteId: string,
  ): Promise<ApiResponse<DashboardNote>> => {
    const response = await ApiClient.patch<ApiResponse<DashboardNote>>(
      `/festivals/notes/${festivalId}/${noteId}/unpin`,
    );
    return response.data;
  },

  /** Delete a note */
  deleteNote: async (
    festivalId: string,
    noteId: string,
  ): Promise<ApiResponse<null>> => {
    const response = await ApiClient.delete<ApiResponse<null>>(
      `/festivals/notes/${festivalId}/${noteId}`,
    );
    return response.data;
  },
};
