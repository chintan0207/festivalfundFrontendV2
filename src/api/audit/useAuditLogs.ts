import { useQuery } from "@tanstack/react-query";
import { auditService } from "./audit.service";
import type { AuditLogQueryParams } from "./audit.service";

export const AUDIT_LOGS_QUERY_KEY = ["audit-logs"];

export function useAuditLogs(params: AuditLogQueryParams = {}) {
  return useQuery({
    queryKey: [...AUDIT_LOGS_QUERY_KEY, params],
    queryFn: () => auditService.getAuditLogs(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useAuditLogDetail(id: string, orgId?: string) {
  return useQuery({
    queryKey: [...AUDIT_LOGS_QUERY_KEY, "detail", id],
    queryFn: () => auditService.getAuditLogDetail(id, orgId),
    enabled: Boolean(id),
  });
}
