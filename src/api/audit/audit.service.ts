import ApiClient from "../apiClient";

export interface AuditLogItem {
  id: string;
  action: string;
  entityType: string;
  entityName?: string;
  module: string;
  type: string;
  targetType: string;
  targetId: string;
  code?: string;
  title: string;
  subtitle?: string;
  amount?: number;
  date: {
    date: string;
    time: string;
    full: string;
    iso: string;
  };
  status: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  user: string;
  userRole?: string;
  oldValues?: Record<string, any> | null;
  newValues?: Record<string, any> | null;
  changedFields?: string[];
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, any>;
}

export interface AuditLogQueryParams {
  orgId?: string;
  page?: number;
  limit?: number;
  sort?: string;
  module?: string;
  entityType?: string;
  action?: string;
  actorId?: string;
  severity?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  festivalId?: string;
}

export interface AuditLogResponse {
  logs: AuditLogItem[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
}

export const auditService = {
  getAuditLogs: async (params: AuditLogQueryParams = {}) => {
    const { orgId, ...queryParams } = params;
    const url = orgId ? `/audit-logs/${orgId}` : "/audit-logs";
    const response = await ApiClient.get(url, { params: queryParams });
    return response.data.data as AuditLogResponse;
  },

  getAuditLogDetail: async (id: string, orgId?: string) => {
    const url = orgId ? `/audit-logs/${orgId}/detail/${id}` : `/audit-logs/detail/${id}`;
    const response = await ApiClient.get(url);
    return response.data.data.log as AuditLogItem;
  },
};
