import { gradientColors } from "@/theme/colors";
import {
  Calendar,
  Users,
  IndianRupee,
  Receipt,
  FileText,
  Building2,
  Shield,
  Search,
  UserCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Feature {
  title: string;
  description: string;
  color: string;
  icon: LucideIcon;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  currentPrice: number;
  regularPrice: number;
  currency: string;
  interval: string;
  currentStatus: "free" | "active";
  featured?: boolean;
  recommended?: boolean;
  cta: string;
  features: string[];
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

export interface Reason {
  title: string;
  description: string;
}

export interface Step {
  title: string;
  description: string;
}

export interface SecurityFeature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const features: Feature[] = [
  {
    title: "Festival Lifecycle Management",
    description:
      "Create, track, and archive festival campaigns with distinct budgets, timelines, and venues.",
    color: "#10b981",
    icon: Calendar,
  },
  {
    title: "Contributor Relationship Management",
    description:
      "Maintain a centralized contributor directory with key identity tracking, history, and auto-generated codes.",
    color: "#6366f1",
    icon: Users,
  },
  {
    title: "Collection & Receipt System",
    description:
      "Record cash and item contributions with auto-generated receipt numbers and downloadable PDF slips.",
    color: "#f59e0b",
    icon: IndianRupee,
  },
  {
    title: "Expense & Vendor Tracking",
    description:
      "Categorize festival expenditures with receipt upload, approval workflows, and net balance calculation.",
    color: "#06b6d4",
    icon: Receipt,
  },
  {
    title: "Financial Statements & Export",
    description:
      "Generate comprehensive PDF & CSV financial reports, collection summaries, and audit logs with one click.",
    color: "#8b5cf6",
    icon: FileText,
  },
  {
    title: "Multi-Tenant Organization Structure",
    description:
      "Role-based access control with SuperAdmin, OrgAdmin, and Treasurer privileges for complete isolation.",
    color: "#ef4444",
    icon: Building2,
  },
];

export const reasons: Reason[] = [
  {
    title: "Mobile-Friendly Design",
    description:
      "Works beautifully on smartphones and tablets. Add contributions, check reports, and manage expenses on the go.",
  },
  {
    title: "Instant PDF Receipts",
    description:
      "Generate professional contribution slips instantly. Download, print, or share with contributors right away.",
  },
  {
    title: "Public Contributor Lookup",
    description:
      "Contributors can look up their donation history across organizations using just their phone or email.",
  },
  {
    title: "Role-Based Access",
    description:
      "Granular permissions with Admin and Viewer roles. Keep your financial data secure and accessible to the right people.",
  },
];

export const steps: Step[] = [
  {
    title: "Register Organization",
    description:
      "Create your mandal or trust account in minutes with basic details. No technical setup needed.",
  },
  {
    title: "Choose Your Plan",
    description:
      "Start with the Free plan and upgrade as your organization grows. No credit card required.",
  },
  {
    title: "Create Festival",
    description:
      "Set up your first festival with a budget, dates, and expense categories.",
  },
  {
    title: "Start Collecting",
    description:
      "Begin recording contributions and expenses, generating receipts, and tracking your finances in real time.",
  },
];

export const pricingPlans: PricingPlan[] = [
  {
    id: "basic",
    name: "Basic",
    description: "Core FestivalFund functionality for small mandals and committees",
    currentPrice: 0,
    regularPrice: 99,
    currency: "INR",
    interval: "month",
    currentStatus: "free",
    recommended: false,
    featured: false,
    cta: "Get Started",
    features: [
      "Unlimited Festivals",
      "Contributor management",
      "Contributions & receipt generation",
      "Expense tracking & categories",
      "Notes & Tasks management",
      "Activity history & dashboard",
      "Basic reports & PDF export",
      "Search and filtering",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    description: "Everything in Basic plus advanced insights for growing organizations",
    currentPrice: 0,
    regularPrice: 299,
    currency: "INR",
    interval: "month",
    currentStatus: "free",
    recommended: true,
    featured: true,
    cta: "Get Started",
    features: [
      "Everything in Basic +",
      "Unlimited Festivals",
      "Advanced financial reports",
      "Advanced insights & analytics",
      "Enhanced interactive dashboard",
      "Full PDF & document export capabilities",
      "Enhanced activity & audit visibility",
      "Priority customer support",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    description: "Everything in Standard plus premium capabilities for large committees",
    currentPrice: 0,
    regularPrice: 399,
    currency: "INR",
    interval: "month",
    currentStatus: "free",
    recommended: false,
    featured: false,
    cta: "Get Started",
    features: [
      "Everything in Standard +",
      "Unlimited Festivals",
      "Advanced analytics suite",
      "Comprehensive multi-module reporting",
      "Advanced dashboard capabilities",
      "Extended export & archival capabilities",
      "Advanced organization administration",
      "Premium document & slip capabilities",
      "Dedicated 24/7 priority support",
    ],
  },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "FestivalFund made it so easy to track our Ganesh Utsav collections. The auto-numbering and receipt generation saved us hours of manual work.",
    author: "Kishan Patel",
    role: "Treasurer, Shri Ganesh Mandal",
  },
  {
    quote:
      "We used to manage everything in notebooks and spreadsheets. Now all our contributors, expenses, and reports are in one place.",
    author: "Sunita Sharma",
    role: "Secretary, Navratri Committee",
  },
  {
    quote:
      "The contributor lookup feature is brilliant — our donors can check their history across different festivals without calling us every time.",
    author: "Krishna Rao",
    role: "Coordinator, Seva Foundation",
  },
];

export const securityFeatures: SecurityFeature[] = [
  {
    title: "JWT Authentication",
    description: "Secure token-based authentication with automatic refresh and rotation",
    icon: Shield,
  },
  {
    title: "Role-Based Access",
    description: "Granular permissions for Admin, Viewer, and Super Admin roles",
    icon: UserCheck,
  },
  {
    title: "Data Isolation",
    description:
      "Complete separation of data between organizations at the database level",
    icon: Building2,
  },
  {
    title: "Private Contributor Lookup",
    description: "Encrypted lookup keys protect contributor privacy across organizations",
    icon: Search,
  },
];

export const iconGradients = gradientColors;
