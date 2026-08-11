import * as z from "zod";

export const teamMemberFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .optional()
    .refine((v) => !v || v.length >= 6, {
      message: "Password must be at least 6 characters",
    }),
  role: z.enum(["ORG_ADMIN", "ORG_VIEWER"]),
  phoneNumber: z
    .string()
    .optional()
    .nullable()
    .refine((v) => !v || /^\d{10}$/.test(v), {
      message: "Enter a valid 10-digit phone number",
    }),
});

export type TeamMemberFormValues = z.infer<typeof teamMemberFormSchema>;
