/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Building2, MapPin, User, Mail, Phone, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { AppInput } from "@/components/common/AppInput";
import { sanitizePhone } from "@/lib/phone";

export const stepContent = {
  1: {
    title: "Organization Details",
    description: "Tell us about your mandal or trust",
  },
  2: {
    title: "Admin Information",
    description: "Primary administrator details",
  },
  3: {
    title: "Account Security",
    description: "Set up a secure password for your account",
  },
};

export function StepOne({ register, errors }: any) {
  return (
    <div className="space-y-4">
      <AppInput
        id="name"
        label="Organization Name"
        placeholder="e.g. Shree Ganesh Mandal"
        leftIcon={<Building2 className="h-4 w-4" />}
        {...register("name")}
        error={errors.name?.message}
      />

      <AppInput
        id="address"
        label="Address / Location"
        placeholder="e.g. Station Road, Dadar, Mumbai"
        leftIcon={<MapPin className="h-4 w-4" />}
        {...register("address")}
        error={errors.address?.message}
      />
    </div>
  );
}

export function StepTwo({ register, errors, setValue }: any) {
  return (
    <div className="space-y-4">
      <AppInput
        id="adminName"
        label="Admin Full Name"
        placeholder="e.g. Rahul Sharma"
        leftIcon={<User className="h-4 w-4" />}
        {...register("adminName")}
        error={errors.adminName?.message}
      />

      <AppInput
        id="email"
        label="Admin Email Address"
        type="email"
        placeholder="rahul@example.com"
        leftIcon={<Mail className="h-4 w-4" />}
        {...register("email")}
        error={errors.email?.message}
      />

      <AppInput
        id="phone"
        label="Phone Number"
        type="tel"
        inputMode="numeric"
        maxLength={10}
        placeholder="10-digit mobile number"
        leftIcon={<Phone className="h-4 w-4" />}
        {...register("phone", {
          onChange: (e: { target: { value: string } }) => {
            setValue("phone", sanitizePhone(e.target.value), { shouldValidate: true });
          },
        })}
        error={errors.phone?.message}
      />
    </div>
  );
}

export function StepThree({ register, errors }: any) {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  return (
    <div className="space-y-4">
      <AppInput
        id="adminPassword"
        label="Password"
        type={showPass ? "text" : "password"}
        placeholder="Min. 6 characters"
        leftIcon={<Lock className="h-4 w-4" />}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="hover:text-foreground transition-colors focus:outline-none"
          >
            {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        }
        {...register("adminPassword")}
        error={errors.adminPassword?.message}
      />

      <AppInput
        id="confirmPassword"
        label="Confirm Password"
        type={showConfirmPass ? "text" : "password"}
        placeholder="Re-enter password"
        leftIcon={<Lock className="h-4 w-4" />}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowConfirmPass(!showConfirmPass)}
            className="hover:text-foreground transition-colors focus:outline-none"
          >
            {showConfirmPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        }
        {...register("confirmPassword")}
        error={errors.confirmPassword?.message}
      />

      <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm">
          <p className="font-medium text-foreground">Free Tier Account</p>
          <p className="text-muted-foreground">Full access to contribution tracking & reports</p>
        </div>
      </div>
    </div>
  );
}
