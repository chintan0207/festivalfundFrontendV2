/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/api/auth/auth.store";
import { UploadService } from "@/api/upload/upload.service";
import type {
  AcceptInvitationPayload,
  CreateInvitationPayload,
} from "@/types/Types";
import {
  OrganizationService,
  type UpdateOrganizationPayload,
  type CreateOrgUserPayload,
  type UpdateOrgUserPayload,
} from "./organization.service";

export const ORGANIZATION_QUERY_KEYS = {
  detail: (orgId: string) => ["organization", orgId] as const,
  users: (orgId: string) => ["organization-users", orgId] as const,
  invitations: (orgId: string) => ["organization-invitations", orgId] as const,
};

export const useOrganization = (orgId: string) => {
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);

  return useQuery({
    queryKey: ORGANIZATION_QUERY_KEYS.detail(orgId),
    queryFn: async () => {
      const res = await OrganizationService.getOrganization(orgId);
      if (res.data && user) {
        setAuth({ user, organization: res.data });
      }
      return res.data;
    },
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateOrganization = (orgId: string) => {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (payload: UpdateOrganizationPayload) =>
      OrganizationService.updateOrganization(orgId, payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_QUERY_KEYS.detail(orgId) });
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      if (res.data) {
        setAuth({ user: user as any, organization: res.data });
      }
      toast.success(res.message || "Organization updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update organization");
    },
  });
};

export const useUploadOrgLogo = (orgId: string) => {
  const { mutateAsync: updateOrg } = useUpdateOrganization(orgId);

  return useMutation({
    mutationFn: async (file: File) => {
      const uploaded = await UploadService.uploadFile(file, "organizations");
      await updateOrg({ logoUrl: uploaded.url });
      return uploaded;
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to upload logo");
    },
  });
};

export const useOrgUsers = (orgId: string) => {
  return useQuery({
    queryKey: ORGANIZATION_QUERY_KEYS.users(orgId),
    queryFn: async () => {
      const res = await OrganizationService.getOrgUsers(orgId);
      return res.data;
    },
    enabled: !!orgId,
    staleTime: 30 * 1000,
  });
};

export const useCreateOrgUser = (orgId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrgUserPayload) =>
      OrganizationService.createOrgUser(orgId, payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_QUERY_KEYS.users(orgId) });
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_QUERY_KEYS.detail(orgId) });
      toast.success(res.message || "Team member added successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to add team member");
    },
  });
};

export const useUpdateOrgUser = (orgId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: UpdateOrgUserPayload }) =>
      OrganizationService.updateOrgUser(orgId, userId, payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_QUERY_KEYS.users(orgId) });
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_QUERY_KEYS.detail(orgId) });
      toast.success(res.message || "Team member updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update team member");
    },
  });
};

export const useDeleteOrgUser = (orgId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => OrganizationService.deleteOrgUser(orgId, userId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_QUERY_KEYS.users(orgId) });
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_QUERY_KEYS.detail(orgId) });
      toast.success(res.message || "Team member removed successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to remove team member");
    },
  });
};

export const useOrgInvitations = (orgId: string) => {
  return useQuery({
    queryKey: ORGANIZATION_QUERY_KEYS.invitations(orgId),
    queryFn: async () => {
      const res = await OrganizationService.getInvitations(orgId);
      return res.data;
    },
    enabled: !!orgId,
    staleTime: 30 * 1000,
  });
};

export const useCreateInvitation = (orgId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateInvitationPayload) =>
      OrganizationService.createInvitation(orgId, payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_QUERY_KEYS.invitations(orgId) });
      toast.success(res.message || "Invitation sent successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to send invitation");
    },
  });
};

export const useRevokeInvitation = (orgId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inviteId: string) => OrganizationService.revokeInvitation(orgId, inviteId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_QUERY_KEYS.invitations(orgId) });
      toast.success(res.message || "Invitation revoked");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to revoke invitation");
    },
  });
};

export const useResendInvitation = (orgId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inviteId: string) => OrganizationService.resendInvitation(orgId, inviteId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_QUERY_KEYS.invitations(orgId) });
      toast.success(res.message || "Invitation resent successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to resend invitation");
    },
  });
};

export const useVerifyInvitation = (token: string) => {
  return useQuery({
    queryKey: ["invitation-verify", token] as const,
    queryFn: async () => {
      const res = await OrganizationService.verifyInvitation(token);
      return res.data;
    },
    enabled: !!token,
    retry: false,
    staleTime: 0,
  });
};

export const useAcceptInvitation = () => {
  return useMutation({
    mutationFn: (payload: AcceptInvitationPayload) =>
      OrganizationService.acceptInvitation(payload),
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to accept invitation");
    },
  });
};