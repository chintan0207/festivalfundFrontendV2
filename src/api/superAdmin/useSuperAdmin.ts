import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SuperAdminService, type SubscriptionPlanItem } from "./superAdmin.service";
import { toast } from "sonner";

export const usePlatformDashboard = () => {
  return useQuery({
    queryKey: ["super-admin", "dashboard"],
    queryFn: SuperAdminService.getDashboardStats,
    refetchInterval: 30000,
  });
};

export const useSuperAdminOrgs = (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  plan?: string;
  sortField?: string;
  sortOrder?: string;
}) => {
  return useQuery({
    queryKey: ["super-admin", "organizations", params],
    queryFn: () => SuperAdminService.getOrganizations(params),
  });
};

export const useSuperAdminOrgDetails = (id?: string) => {
  return useQuery({
    queryKey: ["super-admin", "organization", id],
    queryFn: () => (id ? SuperAdminService.getOrganizationDetails(id) : null),
    enabled: !!id,
  });
};

export const useUpdateOrgStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, reason }: { id: string; status: string; reason?: string }) =>
      SuperAdminService.updateOrganizationStatus(id, { status, reason }),
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ["super-admin", "organizations"] });
      queryClient.invalidateQueries({ queryKey: ["super-admin", "dashboard"] });
      toast.success(`Organization ${status === "SUSPENDED" ? "suspended" : "activated"} successfully`);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update organization status");
    },
  });
};

export const useUpdateOrgPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      planCode,
      expiresAt,
      notes,
    }: {
      id: string;
      planCode: string;
      expiresAt?: string | null;
      notes?: string;
    }) => SuperAdminService.updateOrganizationPlan(id, { planCode, expiresAt, notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin", "organizations"] });
      toast.success("Organization plan updated successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update organization plan");
    },
  });
};

export const useSuperAdminUsers = (params: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  organizationId?: string;
  status?: string;
  sortField?: string;
  sortOrder?: string;
}) => {
  return useQuery({
    queryKey: ["super-admin", "users", params],
    queryFn: () => SuperAdminService.getUsers(params),
  });
};

export const useUpdateSuperAdminUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { name?: string; email?: string; role?: string; isActive?: boolean };
    }) => SuperAdminService.updateUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["super-admin", "dashboard"] });
      toast.success("User updated successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update user");
    },
  });
};

export const useSuperAdminFestivals = (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  organizationId?: string;
  year?: string;
  sortField?: string;
  sortOrder?: string;
}) => {
  return useQuery({
    queryKey: ["super-admin", "festivals", params],
    queryFn: () => SuperAdminService.getFestivals(params),
  });
};

export const useSuperAdminPlans = () => {
  return useQuery({
    queryKey: ["super-admin", "plans"],
    queryFn: SuperAdminService.getPlans,
  });
};

export const useCreatePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<SubscriptionPlanItem>) => SuperAdminService.createPlan(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin", "plans"] });
      toast.success("Plan created successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to create plan");
    },
  });
};

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<SubscriptionPlanItem> }) =>
      SuperAdminService.updatePlan(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin", "plans"] });
      toast.success("Plan updated successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update plan");
    },
  });
};

export const useSuperAdminAuditLogs = (params: {
  page?: number;
  limit?: number;
  search?: string;
  module?: string;
  action?: string;
  severity?: string;
  organizationId?: string;
}) => {
  return useQuery({
    queryKey: ["super-admin", "audit-logs", params],
    queryFn: () => SuperAdminService.getAuditLogs(params),
  });
};

export const useSuperAdminSettings = () => {
  return useQuery({
    queryKey: ["super-admin", "settings"],
    queryFn: SuperAdminService.getSettings,
  });
};

export const useUpdateSuperAdminSetting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { key: string; value: any; category?: string; description?: string }) =>
      SuperAdminService.updateSetting(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin", "settings"] });
      toast.success("Setting updated successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update setting");
    },
  });
};
