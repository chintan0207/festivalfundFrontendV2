import { Link } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { AppCard } from "@/components/common/AppCard";
import { AppInput } from "@/components/common/AppInput";
import { AppButton } from "@/components/common/AppButton";

/* ---------------- VALIDATION ---------------- */

const schema = z
  .object({
    orgName: z.string().min(2, "Organization name required"),
    orgType: z.string().min(2, "Organization type required"),
    location: z.string().min(2, "Location required"),

    adminName: z.string().min(2, "Name required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(10, "Invalid phone"),

    password: z.string().min(6, "Min 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormData = z.infer<typeof schema>;

/* ---------------- STEPPER ---------------- */

function Stepper({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-4 mb-6">
      {[1, 2, 3].map((s, i) => (
        <div key={s} className="flex items-center">
          <div
            className={`h-10 w-10 flex items-center justify-center rounded-full text-sm font-semibold transition
            ${step >= s ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
          >
            {step > s ? "✓" : s}
          </div>

          {i !== 2 && (
            <div className={`w-10 h-[2px] ${step > s ? "bg-primary" : "bg-muted"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ---------------- COMPONENT ---------------- */

export default function Signup() {
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  /* -------- STEP VALIDATION -------- */

  const nextStep = async () => {
    let fields: (keyof FormData)[] = [];

    if (step === 1) fields = ["orgName", "orgType", "location"];
    if (step === 2) fields = ["adminName", "email", "phone"];

    const valid = await trigger(fields);
    if (valid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const onSubmit = (data: FormData) => {
    console.log(data);
    alert("Account Created (UI only)");
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-muted/40">
      {/* LEFT SIDE */}
      <div className="hidden md:flex flex-col justify-center px-16 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />

        <div className="relative max-w-lg space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            Register Your <span className="text-primary">Mandal</span>
          </h1>

          <p className="text-muted-foreground">
            Create and manage your organization easily with FestivalFund.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center px-4 py-10 overflow-hidden">
        <AppCard className="w-full max-w-md">
          <Stepper step={step} />

          {/* TITLE */}
          <div className="text-center mb-4 space-y-1">
            <h2 className="text-lg sm:text-xl font-semibold">
              {step === 1 && "Organization Details"}
              {step === 2 && "Admin Information"}
              {step === 3 && "Account Security"}
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground">
              {step === 1 && "Tell us about your mandal"}
              {step === 2 && "Primary administrator details"}
              {step === 3 && "Secure your account"}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* STEP 1 */}
            {step === 1 && (
              <>
                <AppInput
                  label="Organization Name"
                  placeholder="e.g. Shree Ganesh Mandal"
                  {...register("orgName")}
                  error={errors.orgName?.message}
                />

                <AppInput
                  label="Organization Type"
                  placeholder="Temple Committee"
                  {...register("orgType")}
                  error={errors.orgType?.message}
                />

                <AppInput
                  label="Location"
                  placeholder="City / Area"
                  {...register("location")}
                  error={errors.location?.message}
                />
                <div className="flex justify-end pt-2">
                  <AppButton size="sm" type="button" onClick={nextStep}>
                    Next →
                  </AppButton>
                </div>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
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

                {/* FIXED BUTTON LAYOUT */}
                <div className="flex justify-between pt-2">
                  <AppButton size="sm" type="button" variant="outline" onClick={prevStep}>
                    ← Previous
                  </AppButton>

                  <AppButton size="sm" type="button" onClick={nextStep}>
                    Next →
                  </AppButton>
                </div>
              </>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <>
                <AppInput
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                  {...register("password")}
                  error={errors.password?.message}
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

                {/* FIXED BUTTON LAYOUT */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <AppButton
                    size="sm"
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={prevStep}
                  >
                    ← Previous
                  </AppButton>

                  <AppButton size="sm" type="submit" className="w-full">
                    Create Account
                  </AppButton>
                </div>
              </>
            )}

            {/* FOOTER */}
            <p className="text-center text-xs sm:text-sm pt-2">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium">
                Login
              </Link>
            </p>
          </form>
        </AppCard>
      </div>
    </div>
  );
}
