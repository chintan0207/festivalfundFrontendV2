export interface FestivalStats {
  openingBalance: number;
  totalCollected: number;
  pendingAmount: number;
  totalExpenses: number;
  currentBalance: number;
}

export interface Festival {
  id: string;
  name: string;
  year: number;
  startDate: string;
  endDate: string;
  targetAmount: number;
  stats: FestivalStats;
  status: "ACTIVE" | "UPCOMING" | "COMPLETED";
  location: string;
  category: string;
  contributorsCount: number;
  description: string;
}

export interface Contributor {
  id: string;
  festivalId: string;
  contributorCode: string;
  name: string;
  phone: string;
  email: string;
  category: "PARENT" | "BOY" | "GIRL";
  totalContributed: number;
  status: "Active" | "Pending";
  locality: string;
}

export interface Contribution {
  id: string;
  contributionCode: string;
  receiptNo: string;
  festivalId: string;
  contributorId?: string;
  contributorName: string;
  contributorPhone: string;
  contributorCategory: "PARENT" | "BOY" | "GIRL";
  type: "MONEY" | "ITEM";
  amount: number;
  itemName?: string;
  paymentMode: "UPI" | "CASH";
  status: "DEPOSITED" | "PENDING" | "CANCELLED";
  date: string;
  notes?: string;
}

export interface Expense {
  id: string;
  expenseCode: string;
  voucherNo: string;
  festivalId: string;
  title: string;
  category: "MAHAPRASAD" | "DECORATION" | "MANDAP" | "SOUND" | "OTHER";
  amount: number;
  paidTo: string;
  paymentMode: "UPI" | "CASH";
  date: string;
  status: "Paid" | "Approved" | "Pending";
  notes?: string;
}

export const INITIAL_FESTIVALS: Festival[] = [
  {
    id: "fest-1",
    name: "Ganesh Chaturthi",
    year: 2025,
    startDate: "2025-08-25",
    endDate: "2025-09-04",
    targetAmount: 200000,
    stats: {
      openingBalance: 25000,
      totalCollected: 107748,
      pendingAmount: 0,
      totalExpenses: 104139,
      currentBalance: 28609,
    },
    status: "ACTIVE",
    location: "Central Mandap",
    category: "Religious & Cultural",
    contributorsCount: 142,
    description: "Annual Ganesh Utsav celebration with daily Aarti, Cultural events, and Mahaprasad distribution.",
  },
  {
    id: "fest-2",
    name: "Navratri Festival",
    year: 2026,
    startDate: "2026-10-11",
    endDate: "2026-10-19",
    targetAmount: 300000,
    stats: {
      openingBalance: 15000,
      totalCollected: 85000,
      pendingAmount: 12000,
      totalExpenses: 42000,
      currentBalance: 58000,
    },
    status: "UPCOMING",
    location: "Community Grounds",
    category: "Dance & Music",
    contributorsCount: 98,
    description: "9 nights of traditional Dandiya & Garba raas with live orchestra.",
  },
];

export const INITIAL_CONTRIBUTORS: Contributor[] = [
  {
    id: "c-1",
    festivalId: "fest-1",
    contributorCode: "CTR-001",
    name: "Ramesh Sharma",
    phone: "+91 98765 43210",
    email: "ramesh.sharma@example.com",
    category: "PARENT",
    totalContributed: 25000,
    status: "Active",
    locality: "Block A, Green Park",
  },
  {
    id: "c-2",
    festivalId: "fest-1",
    contributorCode: "CTR-002",
    name: "Priya Mehta",
    phone: "+91 98234 56789",
    email: "priya.m@example.com",
    category: "GIRL",
    totalContributed: 11000,
    status: "Active",
    locality: "Sector 4, Flat 302",
  },
  {
    id: "c-3",
    festivalId: "fest-1",
    contributorCode: "CTR-003",
    name: "Aarav Patel",
    phone: "+91 98111 22233",
    email: "aarav.p@example.com",
    category: "BOY",
    totalContributed: 51000,
    status: "Active",
    locality: "Sunrise Towers",
  },
  {
    id: "c-4",
    festivalId: "fest-1",
    contributorCode: "CTR-004",
    name: "Suresh Joshi",
    phone: "+91 97654 32109",
    email: "suresh.j@example.com",
    category: "PARENT",
    totalContributed: 20748,
    status: "Active",
    locality: "B-12 Colony",
  },
];

export const INITIAL_CONTRIBUTIONS: Contribution[] = [
  {
    id: "cnt-1",
    contributionCode: "CON-001",
    receiptNo: "REC-2025-001",
    festivalId: "fest-1",
    contributorId: "c-3",
    contributorName: "Aarav Patel",
    contributorPhone: "+91 98111 22233",
    contributorCategory: "BOY",
    type: "MONEY",
    amount: 51000,
    paymentMode: "UPI",
    status: "DEPOSITED",
    date: "2025-08-20",
    notes: "Stage & Decoration Sponsorship",
  },
  {
    id: "cnt-2",
    contributionCode: "CON-002",
    receiptNo: "REC-2025-002",
    festivalId: "fest-1",
    contributorId: "c-1",
    contributorName: "Ramesh Sharma",
    contributorPhone: "+91 98765 43210",
    contributorCategory: "PARENT",
    type: "MONEY",
    amount: 25000,
    paymentMode: "CASH",
    status: "DEPOSITED",
    date: "2025-08-21",
    notes: "Mahaprasad Bhog contribution",
  },
  {
    id: "cnt-3",
    contributionCode: "CON-003",
    receiptNo: "REC-2025-003",
    festivalId: "fest-1",
    contributorId: "c-4",
    contributorName: "Suresh Joshi",
    contributorPhone: "+91 97654 32109",
    contributorCategory: "PARENT",
    type: "MONEY",
    amount: 20748,
    paymentMode: "UPI",
    status: "DEPOSITED",
    date: "2025-08-22",
    notes: "Flower Decoration Fund",
  },
  {
    id: "cnt-4",
    contributionCode: "CON-004",
    receiptNo: "REC-2025-004",
    festivalId: "fest-1",
    contributorId: "c-2",
    contributorName: "Priya Mehta",
    contributorPhone: "+91 98234 56789",
    contributorCategory: "GIRL",
    type: "MONEY",
    amount: 11000,
    paymentMode: "CASH",
    status: "DEPOSITED",
    date: "2025-08-23",
    notes: "Evening Aarti bhog",
  },
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: "exp-1",
    expenseCode: "EXP-001",
    voucherNo: "VOU-2025-001",
    festivalId: "fest-1",
    title: "Mahaprasad",
    category: "MAHAPRASAD",
    amount: 20448,
    paidTo: "Shree Krishna Caterers",
    paymentMode: "UPI",
    date: "2025-08-25",
    status: "Paid",
    notes: "Food & Prasad expenses",
  },
  {
    id: "exp-2",
    expenseCode: "EXP-002",
    voucherNo: "VOU-2025-002",
    festivalId: "fest-1",
    title: "Decoration",
    category: "DECORATION",
    amount: 6760,
    paidTo: "Glow & Lighting Co.",
    paymentMode: "UPI",
    date: "2025-08-26",
    status: "Paid",
    notes: "Stage & Lighting",
  },
  {
    id: "exp-3",
    expenseCode: "EXP-003",
    voucherNo: "VOU-2025-003",
    festivalId: "fest-1",
    title: "Mandap",
    category: "MANDAP",
    amount: 10320,
    paidTo: "Shree Ram Decorators",
    paymentMode: "CASH",
    date: "2025-08-27",
    status: "Paid",
    notes: "Stage & Mandap setup",
  },
  {
    id: "exp-4",
    expenseCode: "EXP-004",
    voucherNo: "VOU-2025-004",
    festivalId: "fest-1",
    title: "Sound",
    category: "SOUND",
    amount: 22710,
    paidTo: "Swar Beats Audio",
    paymentMode: "UPI",
    date: "2025-08-28",
    status: "Paid",
    notes: "Audio arrangements",
  },
  {
    id: "exp-5",
    expenseCode: "EXP-005",
    voucherNo: "VOU-2025-005",
    festivalId: "fest-1",
    title: "Other",
    category: "OTHER",
    amount: 43901,
    paidTo: "General Supplies",
    paymentMode: "CASH",
    date: "2025-08-29",
    status: "Paid",
    notes: "Miscellaneous expenses",
  },
];
