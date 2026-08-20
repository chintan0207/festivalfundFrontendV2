export const DB_NAME = "Festivalfund";

export const GlobalRoleEnum = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ORG_ADMIN: "ORG_ADMIN",
  ORG_VIEWER: "ORG_VIEWER",
};

export const AvailableGlobalRoles = Object.values(GlobalRoleEnum);

export const PlanEnum = {
  FREE: "FREE",
  STANDARD: "STANDARD",
  PREMIUM: "PREMIUM",
};

export const AvailablePlans = Object.values(PlanEnum);

export const ContributionStatusEnum = {
  DEPOSITED: "DEPOSITED",
  PENDING: "PENDING",
  CANCELLED: "CANCELLED",
};

export const AvailableContributionStatuses = Object.values(ContributionStatusEnum);

export const ContributionTypeEnum = {
  MONEY: "MONEY",
  ITEM: "ITEM",
};

export const AvailableContributionTypes = Object.values(ContributionTypeEnum);

export const PaymentMethodEnum = {
  CASH: "CASH",
  UPI: "UPI",
};

export const AvailablePaymentMethods = Object.values(PaymentMethodEnum);

export const ExpenseCategoryEnum = {
  FOOD: "FOOD",
  DECORATION: "DECORATION",
  SERVICES: "SERVICES",
  CULTURAL: "CULTURAL",
  OTHER: "OTHER",
};

export const AvailableExpenseCategories = Object.values(ExpenseCategoryEnum);

export const ContributorCategoryEnum = {
  PARENT: "PARENT",
  BOY: "BOY",
  GIRL: "GIRL",
};

export const AvailableContributorCategories = Object.values(ContributorCategoryEnum);
