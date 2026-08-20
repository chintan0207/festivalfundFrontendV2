import type {
  AcceptInvitationPayload,
  CreateInvitationPayload,
  Invitation,
  InvitationVerification,
  Organization,
  User,
  UserRole,
} from "@/types/Types";
import ApiClient from "../apiClient";

export type ApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
};

export type OrganizationDetail = Organization & {
  users?: TeamMember[];
};

export type TeamMember = User;

export type UpdateOrganizationPayload = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  currency?: string;
  timezone?: string;
  isActive?: boolean;
};

export type CreateOrgUserPayload = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phoneNumber?: string | null;
};

export type UpdateOrgUserPayload = {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  phoneNumber?: string | null;
  isActive?: boolean;
};

export const OrganizationService = {
  getOrganization: async (orgId: string) => {
    const response = await ApiClient.get<ApiResponse<OrganizationDetail>>(
      `/organizations/${orgId}`,
    );
    return response.data;
  },

  updateOrganization: async (orgId: string, payload: UpdateOrganizationPayload) => {
    const response = await ApiClient.patch<ApiResponse<Organization>>(
      `/organizations/${orgId}`,
      payload,
    );
    return response.data;
  },

  getOrgUsers: async (orgId: string) => {
    const response = await ApiClient.get<ApiResponse<TeamMember[]>>(`/organizations/${orgId}/users`);
    return response.data;
  },

  createOrgUser: async (orgId: string, payload: CreateOrgUserPayload) => {
    const response = await ApiClient.post<ApiResponse<TeamMember>>(
      `/organizations/${orgId}/users`,
      payload,
    );
    return response.data;
  },

  updateOrgUser: async (orgId: string, userId: string, payload: UpdateOrgUserPayload) => {
    const response = await ApiClient.patch<ApiResponse<TeamMember>>(
      `/organizations/${orgId}/users/${userId}`,
      payload,
    );
    return response.data;
  },

  deleteOrgUser: async (orgId: string, userId: string) => {
    const response = await ApiClient.delete<ApiResponse<null>>(
      `/organizations/${orgId}/users/${userId}`,
    );
    return response.data;
  },

  createInvitation: async (orgId: string, payload: CreateInvitationPayload) => {
    const response = await ApiClient.post<ApiResponse<Invitation>>(
      `/organizations/${orgId}/invitations`,
      payload,
    );
    return response.data;
  },

  getInvitations: async (orgId: string) => {
    const response = await ApiClient.get<ApiResponse<Invitation[]>>(
      `/organizations/${orgId}/invitations`,
    );
    return response.data;
  },

  revokeInvitation: async (orgId: string, inviteId: string) => {
    const response = await ApiClient.delete<ApiResponse<Invitation>>(
      `/organizations/${orgId}/invitations/${inviteId}`,
    );
    return response.data;
  },

  resendInvitation: async (orgId: string, inviteId: string) => {
    const response = await ApiClient.post<ApiResponse<Invitation>>(
      `/organizations/${orgId}/invitations/${inviteId}/resend`,
    );
    return response.data;
  },

  verifyInvitation: async (token: string) => {
    const response = await ApiClient.get<ApiResponse<InvitationVerification>>(
      `/invitations/verify?token=${encodeURIComponent(token)}`,
    );
    return response.data;
  },

  acceptInvitation: async (payload: AcceptInvitationPayload) => {
    const response = await ApiClient.post<ApiResponse<AuthResponseLike>>(
      "/invitations/accept",
      payload,
    );
    return response.data;
  },
};

type AuthResponseLike = {
  accessToken: string;
  refreshToken: string;
  loggedInUser: User;
  organization?: Organization;
};