export type UserRole = "SUPER_ADMIN" | "ORG_ADMIN" | "ORG_VIEWER";

export type User = {
  _id: string;
  organizationId: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phoneNumber?: string | null;
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
  phone?: string;
  email: string;
  description: string;
  website: string;
  registeredBy: string | null;
  plan: "FREE" | "STANDARD" | "PREMIUM";
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
  planExpiry?: string;
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

export type UpdateProfilePayload = {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
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

export type FestivalStatus = "UPCOMING" | "ACTIVE" | "COMPLETED" | "ARCHIVED";

export type FestivalStats = {
  openingBalance: number;
  totalCollected: number;
  pendingAmount: number;
  totalExpenses: number;
  currentBalance: number;
  contributorsCount?: number;
  itemCount?: number;
};

export type Festival = {
  _id: string;
  organizationId: string;
  name: string;
  year: number;
  status: FestivalStatus;
  targetAmount?: number;
  category?: string;
  location?: string;
  description?: string;
  bannerUrl?: string;
  stats: FestivalStats;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  isDeleted: boolean;
  deletedBy?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type FestivalStatusCounts = {
  total: number;
  UPCOMING: number;
  ACTIVE: number;
  COMPLETED: number;
  ARCHIVED: number;
};

export type FestivalFacets = {
  years: number[];
  locations: string[];
};

export type CreateFestivalPayload = {
  name: string;
  year: number;
  openingBalance?: number;
  organizationId?: string;
  status?: FestivalStatus;
  targetAmount?: number;
  category?: string;
  location?: string;
  description?: string;
  bannerUrl?: string;
  startDate?: string | Date;
  endDate?: string | Date;
};

export type UpdateFestivalPayload = {
  name?: string;
  year?: number;
  openingBalance?: number;
  organizationId?: string;
  status?: FestivalStatus;
  targetAmount?: number;
  category?: string;
  location?: string;
  description?: string;
  bannerUrl?: string;
  startDate?: string | Date;
  endDate?: string | Date;
};


// Contributor Types
export type ContributorCategory = "PARENT" | "BOY" | "GIRL" | string;

export type Contributor = {
  _id: string;
  organizationId: string;
  globalContributorKey?: string;
  contributorCode: string;
  name: string;
  phoneNumber?: string | null;
  email?: string | null;
  address?: string | null;
  category: ContributorCategory;
  isActive: boolean;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateContributorPayload = {
  name: string;
  phoneNumber?: string | null;
  email?: string | null;
  address?: string | null;
  category?: ContributorCategory;
  notes?: string | null;
};

export type UpdateContributorPayload = {
  name?: string;
  phoneNumber?: string | null;
  email?: string | null;
  address?: string | null;
  category?: ContributorCategory;
  notes?: string | null;
};

// Contribution Types
export type ContributionType = "MONEY" | "ITEM";
export type ContributionStatus = "PENDING" | "DEPOSITED" | "CANCELLED";
export type PaymentMode = "CASH" | "UPI" | "BANK_TRANSFER" | "CHEQUE" | "OTHER";

// Expense Types
export type ExpenseStatus = "PENDING" | "PAID" | "CANCELLED";
export type ExpenseCategory = "FOOD" | "DECORATION" | "SERVICES" | "CULTURAL" | "OTHER";

export type ExpenseStatusHistoryEntry = {
  from?: ExpenseStatus | null;
  to: ExpenseStatus;
  changedBy?: string;
  reason?: string;
  at?: string;
};

export type Expense = {
  _id: string;
  organizationId: string;
  festivalId: Festival | string;
  category: ExpenseCategory;
  amount: number;
  description?: string;
  status: ExpenseStatus;
  date: string;
  vendorName?: string;
  invoiceNumber?: string;
  paymentMode: PaymentMode;
  recordedBy?: User | string;
  expenseCode: string;
  attachments?: string[];
  statusHistory?: ExpenseStatusHistoryEntry[];
  isBalanceApplied: boolean;
  isDeleted: boolean;
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateExpensePayload = {
  festivalId: string;
  category: ExpenseCategory;
  amount: number;
  description?: string;
  date?: string | Date;
  vendorName?: string;
  invoiceNumber?: string;
  paymentMode?: PaymentMode;
  attachments?: string[];
  status?: ExpenseStatus;
};

export type UpdateExpensePayload = {
  festivalId?: string;
  category?: ExpenseCategory;
  amount?: number;
  description?: string;
  date?: string | Date;
  vendorName?: string;
  invoiceNumber?: string;
  paymentMode?: PaymentMode;
  attachments?: string[];
};

export type ExpenseListItem = {
  _id: string;
  expenseCode: string;
  category: ExpenseCategory;
  amount: number;
  description?: string;
  date: string;
  vendorName?: string;
  invoiceNumber?: string;
  paymentMode: PaymentMode;
  status: ExpenseStatus;
  attachments?: string[];
  isBalanceApplied: boolean;
  createdAt?: string;
  updatedAt?: string;
  recordedBy?: { _id: string; name?: string };
  festival?: { _id: string; name?: string; year?: number };
};

export type ExpenseStatusCounts = {
  total: number;
  PENDING: number;
  PAID: number;
  CANCELLED: number;
};

export type ExpenseStatusAmounts = {
  total: number;
  PENDING: number;
  PAID: number;
  CANCELLED: number;
};

export type ExpenseCategoryTotals = Record<ExpenseCategory | string, number>;

export type ExpenseListData = {
  expenses: ExpenseListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  statusCounts: ExpenseStatusCounts;
  statusAmounts: ExpenseStatusAmounts;
  categoryTotals: ExpenseCategoryTotals;
};

export type ContributionStatusHistoryEntry = {
  from?: ContributionStatus | null;
  to: ContributionStatus;
  changedBy?: string;
  reason?: string;
  at?: string;
};

export type Contribution = {
  _id: string;
  organizationId: string;
  contributorId: Contributor | string;
  festivalId: Festival | string;
  type: ContributionType;
  status: ContributionStatus;
  date: string;
  amount?: number;
  itemName?: string;
  quantity?: number;
  estimatedValue?: number;
  slipPath?: string;
  recordedBy?: User | string;
  contributionCode: string;
  paymentMode: PaymentMode;
  isBalanceApplied: boolean;
  isDeleted: boolean;
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateContributionPayload = {
  contributorId?: string;
  name?: string;
  phoneNumber?: string | null;
  email?: string | null;
  address?: string | null;
  category?: ContributorCategory;
  festivalId: string;
  type: ContributionType;
  status?: ContributionStatus;
  date?: string | Date;
  amount?: number;
  itemName?: string;
  quantity?: number;
  estimatedValue?: number;
  slipPath?: string;
  recordedBy?: string;
  paymentMode?: PaymentMode;
  isBalanceApplied?: boolean;
};

export type UpdateContributionPayload = {
  type?: ContributionType;
  status?: ContributionStatus;
  date?: string | Date;
  amount?: number;
  itemName?: string;
  quantity?: number;
  estimatedValue?: number;
  slipPath?: string;
  paymentMode?: PaymentMode;
  isBalanceApplied?: boolean;
};

export type ContributionListItem = {
  _id: string;
  contributionCode: string;
  type: ContributionType;
  status: ContributionStatus;
  paymentMode: PaymentMode;
  date: string;
  amount?: number;
  itemName?: string;
  quantity?: number;
  estimatedValue?: number;
  isBalanceApplied: boolean;
  slipPath?: string;
  statusHistory?: ContributionStatusHistoryEntry[];
  createdAt?: string;
  updatedAt?: string;
  contributor?: {
    _id: string;
    contributorCode?: string;
    name?: string;
    category?: ContributorCategory;
    phoneNumber?: string;
  };
  festival?: {
    _id: string;
    name?: string;
    year?: number;
  };
};

export type InvitationStatus = "PENDING" | "ACCEPTED" | "EXPIRED" | "REVOKED";

export type Invitation = {
  _id: string;
  organizationId: string;
  email: string;
  name: string;
  role: UserRole;
  invitedBy: string;
  status: InvitationStatus;
  expiresAt: string;
  acceptedAt?: string;
  revokedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateInvitationPayload = {
  email: string;
  name: string;
  role: UserRole;
};

export type InvitationVerification = {
  token: string;
  email: string;
  name: string;
  role: UserRole;
  organization: {
    _id: string;
    name: string;
    logoUrl?: string;
  } | null;
};

export type AcceptInvitationPayload = {
  token: string;
  name?: string;
  password?: string;
};


