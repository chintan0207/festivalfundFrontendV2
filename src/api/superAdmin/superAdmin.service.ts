import ApiClient from "../apiClient";

export interface PlatformDashboardStats {
  organizations: {
    total: number;
    active: number;
    suspended: number;
    newThisMonth: number;
    byPlan: Record<string, number>;
  };
  users: {
    total: number;
    active: number;
    byRole: Record<string, number>;
  };
  festivals: {
    total: number;
    active: number;
    upcoming: number;
    completed: number;
    archived: number;
  };
  financials: {
    totalContributionsCount: number;
    totalCollectedAmount: number;
    totalPendingAmount: number;
    totalExpensesCount: number;
    totalExpensesAmount: number;
    netPlatformBalance: number;
  };
  monthlyGrowth: Array<{ label: string; count: number }>;
  recentActivity: any[];
}

export interface SuperAdminOrg {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  description?: string;
  logoUrl?: string;
  plan: string;
  status: "ACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION";
  isActive: boolean;
  planExpiry?: string | null;
  suspensionReason?: string | null;
  registeredBy?: {
    _id: string;
    name: string;
    email: string;
    role: string;
    avatarUrl?: string;
  };
  subscriptionPlanId?: {
    _id: string;
    name: string;
    code: string;
    price: number;
  };
  userCount: number;
  festivalCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SuperAdminUser {
  _id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ORG_ADMIN" | "ORG_VIEWER";
  organizationId?: {
    _id: string;
    name: string;
    email?: string;
    logoUrl?: string;
    plan?: string;
    status?: string;
  } | null;
  phoneNumber?: string;
  avatarUrl?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SuperAdminFestival {
  _id: string;
  name: string;
  year: number;
  status: "UPCOMING" | "ACTIVE" | "COMPLETED" | "ARCHIVED";
  targetAmount?: number;
  category?: string;
  location?: string;
  description?: string;
  bannerUrl?: string;
  stats: {
    openingBalance: number;
    totalCollected: number;
    pendingAmount: number;
    totalExpenses: number;
    currentBalance: number;
    contributorsCount: number;
  };
  organizationId: {
    _id: string;
    name: string;
    email?: string;
    logoUrl?: string;
    plan?: string;
    status?: string;
  };
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

export interface SubscriptionPlanItem {
  _id: string;
  name: string;
  code: string;
  price: number;
  billingInterval: "MONTHLY" | "YEARLY" | "LIFETIME";
  currency: string;
  description?: string;
  features: string[];
  limits?: {
    festivalsPerYear: number;
    contributors: number;
  };
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  organizationCount?: number;
}

export interface SuperAdminAuditItem {
  id: string;
  action: string;
  entityType: string;
  entityName: string;
  module: string;
  title: string;
  subtitle: string;
  user: string;
  userRole?: string;
  status: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  date: {
    full: string;
    date: string;
    time: string;
  };
  oldValues?: any;
  newValues?: any;
  changedFields?: string[];
  metadata?: any;
  organizationId?: {
    _id: string;
    name: string;
  };
}

export const SuperAdminService = {
  getDashboardStats: async () => {
    const res = await ApiClient.get<{ data: PlatformDashboardStats }>("/super-admin/dashboard");
    return res.data.data;
  },

  getOrganizations: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    plan?: string;
    sortField?: string;
    sortOrder?: string;
  }) => {
    const res = await ApiClient.get<{
      data: {
        organizations: SuperAdminOrg[];
        pagination: { total: number; page: number; limit: number; totalPages: number };
      };
    }>("/super-admin/organizations", { params });
    return res.data.data;
  },

  getOrganizationDetails: async (id: string) => {
    const res = await ApiClient.get<{ data: any }>(`/super-admin/organizations/${id}`);
    return res.data.data;
  },

  updateOrganizationStatus: async (id: string, payload: { status: string; reason?: string }) => {
    const res = await ApiClient.patch(`/super-admin/organizations/${id}/status`, payload);
    return res.data;
  },

  updateOrganizationPlan: async (
    id: string,
    payload: { planCode: string; expiresAt?: string | null; notes?: string },
  ) => {
    const res = await ApiClient.patch(`/super-admin/organizations/${id}/plan`, payload);
    return res.data;
  },

  getUsers: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    organizationId?: string;
    status?: string;
    sortField?: string;
    sortOrder?: string;
  }) => {
    const res = await ApiClient.get<{
      data: {
        users: SuperAdminUser[];
        pagination: { total: number; page: number; limit: number; totalPages: number };
      };
    }>("/super-admin/users", { params });
    return res.data.data;
  },

  updateUser: async (
    id: string,
    payload: { name?: string; email?: string; role?: string; isActive?: boolean },
  ) => {
    const res = await ApiClient.patch(`/super-admin/users/${id}`, payload);
    return res.data;
  },

  getFestivals: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    organizationId?: string;
    year?: string;
    sortField?: string;
    sortOrder?: string;
  }) => {
    const res = await ApiClient.get<{
      data: {
        festivals: SuperAdminFestival[];
        pagination: { total: number; page: number; limit: number; totalPages: number };
      };
    }>("/super-admin/festivals", { params });
    return res.data.data;
  },

  getPlans: async () => {
    const res = await ApiClient.get<{ data: SubscriptionPlanItem[] }>("/super-admin/plans");
    return res.data.data;
  },

  createPlan: async (payload: Partial<SubscriptionPlanItem>) => {
    const res = await ApiClient.post("/super-admin/plans", payload);
    return res.data;
  },

  updatePlan: async (id: string, payload: Partial<SubscriptionPlanItem>) => {
    const res = await ApiClient.patch(`/super-admin/plans/${id}`, payload);
    return res.data;
  },

  getAuditLogs: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    module?: string;
    action?: string;
    severity?: string;
    organizationId?: string;
  }) => {
    const res = await ApiClient.get<{
      data: {
        logs: SuperAdminAuditItem[];
        pagination: { total: number; page: number; limit: number; totalPages: number };
      };
    }>("/super-admin/audit-logs", { params });
    return res.data.data;
  },

  getSettings: async () => {
    const res = await ApiClient.get<{ data: any[] }>("/super-admin/settings");
    return res.data.data;
  },

  updateSetting: async (payload: { key: string; value: any; category?: string; description?: string }) => {
    const res = await ApiClient.post("/super-admin/settings", payload);
    return res.data;
  },
};
