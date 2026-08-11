import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

export type FormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name required"),
    address: z.string().min(2, "Location required"),

    adminName: z.string().min(2, "Name required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(10, "Invalid phone"),

    adminPassword: z.string().min(6, "Min 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.adminPassword === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const acceptInvitationSchema = z
  .object({
    name: z.string().min(2, "Name required"),
    password: z.string().min(6, "Minimum 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type AcceptInvitationFormData = z.infer<typeof acceptInvitationSchema>;