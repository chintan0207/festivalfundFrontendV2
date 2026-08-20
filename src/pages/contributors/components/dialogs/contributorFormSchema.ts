import * as z from "zod";
import { OPTIONAL_PHONE } from "@/lib/phone";

export const contributorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: OPTIONAL_PHONE,
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().optional(),
  category: z.enum(["PARENT", "BOY", "GIRL"]),
});

export type ContributorFormValues = z.infer<typeof contributorSchema>;
