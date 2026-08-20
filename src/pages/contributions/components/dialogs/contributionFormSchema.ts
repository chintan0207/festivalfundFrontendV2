import * as z from "zod";
import { isValidPhone, PHONE_ERROR } from "@/lib/phone";

const baseShape = {
  // Contributor (add mode only)
  contributorMode: z.enum(["existing", "new"]).default("existing"),
  contributorId: z.string().optional(),
  name: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  category: z.enum(["PARENT", "BOY", "GIRL"]).optional(),

  // Festival (add mode only)
  festivalId: z.string().optional(),

  // Contribution
  type: z.enum(["MONEY", "ITEM"]),
  status: z.enum(["PENDING", "DEPOSITED", "CANCELLED"]),
  date: z.string().optional(),
  amount: z.coerce.number().optional(),
  itemName: z.string().optional(),
  quantity: z.coerce.number().optional(),
  estimatedValue: z.coerce.number().optional(),
  paymentMode: z.string().optional(),
} as const;

export function buildContributionSchema(mode: "add" | "edit") {
  return z
    .object(baseShape)
    .superRefine((data, ctx) => {
      if (mode === "add") {
        if (data.contributorMode === "existing" && !data.contributorId) {
          ctx.addIssue({ code: "custom", path: ["contributorId"], message: "Select a contributor" });
        }
        if (data.contributorMode === "new" && (!data.name || data.name.trim().length < 2)) {
          ctx.addIssue({ code: "custom", path: ["name"], message: "Name must be at least 2 characters" });
        }
        if (data.contributorMode === "new" && !data.category) {
          ctx.addIssue({ code: "custom", path: ["category"], message: "Category is required" });
        }
        if (data.contributorMode === "new" && data.phoneNumber && !isValidPhone(data.phoneNumber)) {
          ctx.addIssue({ code: "custom", path: ["phoneNumber"], message: PHONE_ERROR });
        }
        if (!data.festivalId) {
          ctx.addIssue({ code: "custom", path: ["festivalId"], message: "Select a festival" });
        }
      }
      if (data.type === "MONEY") {
        if (data.amount === undefined || data.amount <= 0) {
          ctx.addIssue({ code: "custom", path: ["amount"], message: "Amount is required for cash contributions" });
        }
      }
      if (data.type === "ITEM") {
        if (!data.itemName || data.itemName.trim().length === 0) {
          ctx.addIssue({ code: "custom", path: ["itemName"], message: "Item name is required for item contributions" });
        }
      }
    });
}

export const contributionSchema = buildContributionSchema("add");

export type ContributionFormValues = z.infer<typeof contributionSchema>;
