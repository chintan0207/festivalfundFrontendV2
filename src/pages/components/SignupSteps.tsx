/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppInput } from "@/components/common/AppInput";

export const stepContent = {
  1: {
    title: "Organization Details",
    description: "Tell us about your mandal",
  },
  2: {
    title: "Admin Information",
    description: "Primary administrator details",
  },
  3: {
    title: "Account Security",
    description: "Secure your account",
  },
};

export function StepOne({ register, errors }: any) {
  return (
    <>
      <AppInput
        label="Organization Name"
        placeholder="e.g. Shree Ganesh Mandal"
        {...register("name")}
        error={errors.name?.message}
      />

      <AppInput
        label="Address"
        placeholder="e.g. Ghej Dukan Faliya"
        {...register("address")}
        error={errors.address?.message}
      />
    </>
  );
}

export function StepTwo({ register, errors }: any) {
  return (
    <>
      <AppInput
        label="Full Name"
        placeholder="Your name"
        {...register("adminName")}
        error={errors.adminName?.message}
      />

      <AppInput
        label="Email"
        placeholder="name@example.com"
        {...register("email")}
        error={errors.email?.message}
      />

      <AppInput
        label="Phone Number"
        placeholder="Enter mobile number"
        {...register("phone")}
        error={errors.phone?.message}
      />
    </>
  );
}

export function StepThree({ register, errors }: any) {
  return (
    <>
      <AppInput
        label="Password"
        type="password"
        placeholder="Enter password"
        {...register("adminPassword")}
        error={errors.adminPassword?.message}
      />

      <AppInput
        label="Confirm Password"
        type="password"
        placeholder="Confirm password"
        {...register("confirmPassword")}
        error={errors.confirmPassword?.message}
      />

      <div className="rounded-xl border p-3 bg-muted/50 text-xs sm:text-sm">
        <p className="font-medium">Selected Plan: Standard</p>

        <p className="text-muted-foreground">₹499/month • 30-day free trial</p>
      </div>
    </>
  );
}
