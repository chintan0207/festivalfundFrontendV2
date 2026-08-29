import * as z from "zod";

const baseShape = {
  festivalId: z.string().optional(),
  description: z.string().max(1000, "Description too long").trim().optional().default(""),
  amount: z.coerce.number().optional(),
  category: z.enum(["FOOD", "DECORATION", "SERVICES", "CULTURAL", "OTHER"]).optional(),
  date: z.string().optional(),
  vendorName: z.string().max(200, "Vendor name too long").trim().optional(),
  invoiceNumber: z.string().max(100, "Invoice number too long").trim().optional(),
  paymentMode: z.enum(["CASH", "UPI", "BANK_TRANSFER", "CHEQUE", "OTHER"]).optional().default("CASH"),
  status: z.enum(["PENDING", "PAID", "CANCELLED"]).optional(),
  attachments: z.array(z.string().min(1, "Invalid attachment URL")).optional().default([]),
} as const;

export function buildExpenseSchema(mode: "add" | "edit") {
  return z
    .object(baseShape)
    .refine((data) => mode !== "add" || !!data.festivalId, {
      message: "Select a festival",
      path: ["festivalId"],
    })
    .refine(
      (data) => mode === "add" ? data.amount !== undefined && data.amount > 0 : true,
      {
        message: "Amount is required and must be greater than 0",
        path: ["amount"],
      }
    )
    .refine(
      (data) => mode === "add" ? !!data.category : true,
      {
        message: "Select a category",
        path: ["category"],
      }
    );
}

export const expenseSchema = buildExpenseSchema("add");

export type ExpenseFormValues = z.infer<typeof expenseSchema>;
