import { z } from "zod";

export const PHONE_REGEX = /^\d{10}$/;

export const PHONE_ERROR = "Enter a valid 10-digit mobile number";

/** Strip non-digits and normalize 10-digit mobile number (handles +91, 91, and leading 0). */
export function sanitizePhone(value: string): string {
  let digits = value.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  return digits.slice(0, 10);
}

export function isValidPhone(value?: string | null): boolean {
  return !!value && PHONE_REGEX.test(value);
}

/** Phone input is required and must be exactly 10 digits. */
export const REQUIRED_PHONE = z
  .string()
  .regex(PHONE_REGEX, PHONE_ERROR);

/** Optional phone: empty string or exactly 10 digits. */
export const OPTIONAL_PHONE = z
  .string()
  .refine((value) => !value || PHONE_REGEX.test(value), PHONE_ERROR)
  .optional();

/** Optional + nullable phone (used where the field may store null). */
export const OPTIONAL_PHONE_NULLABLE = OPTIONAL_PHONE.nullable();