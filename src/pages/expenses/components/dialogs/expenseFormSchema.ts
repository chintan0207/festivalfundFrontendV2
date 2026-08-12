import * as z from "zod";

const baseShape = {
  festivalId: z.string().optional(),
  description: z.string().optional(),
  amount: z.coerce.number().optional(),
  category: z.enum(["FOOD", "DECORATION", "SERVICES", "CULTURAL", "OTHER"]).optional(),
  date: z.string().optional(),
  vendorName: z.string().optional(),
  invoiceNumber: z.string().optional(),
  paymentMode: z.enum(["CASH", "UPI", "BANK_TRANSFER", "CHEQUE", "OTHER"]).optional(),
  status: z.enum(["PENDING", "PAID", "CANCELLED"]).optional(),
  attachments: z.array(z.string()).optional().default([]),
} as const;

export function buildExpenseSchema(mode: "add" | "edit") {
  return z
    .object(baseShape)
    .refine((data) => mode !== "add" || !!data.festivalId, {
      message: "Select a festival",
      path: ["festivalId"],
    })
    .refine((data) => data.amount !== undefined && data.amount > 0, {
      message: "Amount is required and must be greater than 0",
      path: ["amount"],
    })
    .refine((data) => !!data.category, {
      message: "Select a category",
      path: ["category"],
    });
}

export const expenseSchema = buildExpenseSchema("add");

export type ExpenseFormValues = z.infer<typeof expenseSchema>;
