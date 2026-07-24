export type UserRole = "SUPER_ADMIN" | "ORG_ADMIN" | "MEMBER";

export type User = {
  _id: string;
  organizationId: string;
  name: string;
  email: string;
  role: UserRole;
  isDeleted: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Organization = {
  _id: string;
  name: string;
  logoUrl: string;
  address: string;
  email: string;
  description: string;
  website: string;
  registeredBy: string | null;
  plan: "FREE" | "PRO" | "ENTERPRISE";
  limits: {
    festivalsPerYear: number;
    contributors: number;
  };
  sequences: {
    contributor: number;
    expense: number;
    receipt: number;
    festival: number;
  };
  currency: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  loggedInUser: User;
  organization?: Organization;
};

export type SignupPayload = {
  name: string;
  email: string;
  adminPassword: string;
  adminName: string;
  phone: string;
  address?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  token: string;
  password: string;
  newPassword?: string;
};
