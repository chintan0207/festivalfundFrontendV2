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
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Feature {
  title: string;
  description: string;
  color: string;
  icon: LucideIcon;
}

export interface PricingPlan {
  name: string;
  description: string;
  price: string;
  cta: string;
  featured: boolean;
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

export interface KPI {
  label: string;
  value: string;
  change: string;
  spark: number[];
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface CategoryDataPoint extends ChartDataPoint {
  color: string;
}

export const monthlyData: ChartDataPoint[] = [
  { label: "Jan", value: 45 },
  { label: "Feb", value: 52 },
  { label: "Mar", value: 48 },
  { label: "Apr", value: 61 },
  { label: "May", value: 55 },
  { label: "Jun", value: 67 },
  { label: "Jul", value: 72 },
  { label: "Aug", value: 65 },
  { label: "Sep", value: 78 },
  { label: "Oct", value: 85 },
  { label: "Nov", value: 92 },
  { label: "Dec", value: 88 },
];

export const categoryData: CategoryDataPoint[] = [
  { label: "Donations", value: 45, color: "#10b981" },
  { label: "Sponsorships", value: 25, color: "#6366f1" },
  { label: "Pooja", value: 20, color: "#06b6d4" },
  { label: "Other", value: 10, color: "#f59e0b" },
];

export const kpiData: KPI[] = [
  {
    label: "Today's Collection",
    value: "₹1.2L",
    change: "+12%",
    spark: [20, 35, 30, 45, 40, 55, 60],
  },
  {
    label: "Monthly Collection",
    value: "₹18.5L",
    change: "+8%",
    spark: [30, 28, 35, 40, 38, 45, 50],
  },
  {
    label: "Expenses",
    value: "₹4.2L",
    change: "-3%",
    spark: [40, 35, 30, 25, 20, 18, 15],
  },
  {
    label: "Contributors",
    value: "1,247",
    change: "+24",
    spark: [10, 15, 20, 25, 30, 35, 40],
  },
];

export const features: Feature[] = [
  {
    title: "Festival Management",
    description:
      "Create and manage festivals with budgets, timelines, and real-time progress tracking across your organization.",
    color: "#10b981",
    icon: Calendar,
  },
  {
    title: "Contributor Profiles",
    description:
      "Maintain detailed profiles with auto-generated codes, categories, contribution history, and contact information.",
    color: "#6366f1",
    icon: Users,
  },
  {
    title: "Contribution Tracking",
    description:
      "Record cash and in-kind donations with status workflow, multiple payment modes, and automatic receipt generation.",
    color: "#f59e0b",
    icon: IndianRupee,
  },
  {
    title: "Expense Management",
    description:
      "Track categorized expenses — Mahaprasad, Decoration, Mandap, Sound, and more — with payment tracking.",
    color: "#06b6d4",
    icon: Receipt,
  },
  {
    title: "PDF Receipts & Reports",
    description:
      "Generate professional contribution slips and comprehensive festival financial reports with one click.",
    color: "#8b5cf6",
    icon: FileText,
  },
  {
    title: "Multi-Organization",
    description:
      "Serve multiple mandals, trusts, and committees from a single platform with complete data isolation.",
    color: "#ef4444",
    icon: Building2,
  },
];

export const reasons: Reason[] = [
  {
    title: "Complete Transparency",
    description:
      "Every contribution and expense is tracked, logged, and reportable. Build trust with your community through clear financial records.",
  },
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
    name: "Starter",
    description: "For small mandals",
    price: "Free",
    cta: "Get Started",
    featured: false,
    features: [
      "Up to 100 contributors",
      "1 festival per year",
      "Basic reports",
      "Email support",
      "Receipt generation",
    ],
  },
  {
    name: "Standard",
    description: "For growing organizations",
    price: "₹999",
    cta: "Start Free Trial",
    featured: true,
    features: [
      "Unlimited contributors",
      "Unlimited festivals",
      "Advanced reports",
      "Priority support",
      "Contribution slip PDFs",
      "Expense reports",
    ],
  },
  {
    name: "Premium",
    description: "For large organizations",
    price: "₹2,999",
    cta: "Contact Sales",
    featured: false,
    features: [
      "Everything in Standard",
      "Multi-organization view",
      "Dedicated support",
      "SLA guarantee",
      "Priority feature access",
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

export interface FestivalMetric {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  trend?: string;
  trendUp?: boolean;
}

export const festivalSummary: FestivalMetric[] = [
  {
    label: "Total Collected",
    value: "₹18.5L",
    icon: IndianRupee,
    color: "#10b981",
    trend: "+12%",
    trendUp: true,
  },
  {
    label: "Total Expenses",
    value: "₹4.2L",
    icon: Receipt,
    color: "#ef4444",
    trend: "-3%",
    trendUp: false,
  },
  {
    label: "Current Balance",
    value: "₹14.3L",
    icon: Wallet,
    color: "#6366f1",
    trendUp: true,
  },
  {
    label: "Active Contributors",
    value: "1,247",
    icon: Users,
    color: "#f59e0b",
    trend: "+24",
    trendUp: true,
  },
];

export const tenantOrgs = [
  "Shri Ganesh Mandal",
  "Navyuvak Mandal",
  "Seva Society",
  "Navratri Committee",
  "Shri Temple Trust",
  "Community NGO",
];

export const iconGradients = [
  "bg-gradient-to-r from-green-500 to-emerald-500",
  "bg-gradient-to-r from-indigo-500 to-purple-500",
  "bg-gradient-to-r from-pink-500 to-rose-500",
  "bg-gradient-to-r from-blue-500 to-cyan-500",
  "bg-gradient-to-r from-orange-500 to-amber-500",
  "bg-gradient-to-r from-red-500 to-pink-500",
];
