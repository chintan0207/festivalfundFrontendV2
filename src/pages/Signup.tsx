import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { AppCard } from "@/components/common/AppCard";
import { AppButton } from "@/components/common/AppButton";
import { registerSchema, type RegisterFormData } from "./schema/AuthSchema";
import { stepContent, StepOne, StepThree, StepTwo } from "./components/SignupSteps";
import SignupStepper from "./components/SignupStepper";
import { useSignup } from "@/api/hooks/useAuth";

export default function Signup() {
  const signupMutation = useSignup();
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const nextStep = async () => {
    let fields: (keyof RegisterFormData)[] = [];

    if (step === 1) {
      fields = ["orgName", "location"];
    }

    if (step === 2) {
      fields = ["adminName", "email", "phone"];
    }

    const valid = await trigger(fields);

    if (valid) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const onSubmit = async (data: RegisterFormData) => {
    const { name, address, adminName, email, phone, adminPassword } = data;

    signupMutation.mutate({
      name,
      address,
      adminName,
      email,
      phone,
      adminPassword,
    });
  };

  const currentStep = stepContent[step as keyof typeof stepContent];

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-muted/40">
      {/* LEFT SIDE */}
      <div className="hidden md:flex flex-col justify-center px-16 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />

        <div className="relative max-w-lg space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            Register Your
            <span className="text-primary"> Mandal</span>
          </h1>

          <p className="text-muted-foreground">
            Create and manage your organization easily with FestivalFund.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center px-4 py-10">
        <AppCard className="w-full max-w-md">
          <SignupStepper step={step} />

          <div className="text-center mb-4 space-y-1">
            <h2 className="text-lg sm:text-xl font-semibold">{currentStep.title}</h2>

            <p className="text-xs sm:text-sm text-muted-foreground">
              {currentStep.description}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {step === 1 && <StepOne register={register} errors={errors} />}

            {step === 2 && <StepTwo register={register} errors={errors} />}

            {step === 3 && <StepThree register={register} errors={errors} />}

            <div className="flex justify-between gap-2 pt-2">
              {step > 1 ? (
                <AppButton size="sm" type="button" variant="outline" onClick={prevStep}>
                  <ArrowBigLeft className="mr-2 h-4 w-4" />
                  Previous
                </AppButton>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <AppButton size="sm" type="button" onClick={nextStep}>
                  Next
                  <ArrowBigRight className="ml-2 h-4 w-4" />
                </AppButton>
              ) : (
                <AppButton size="sm" type="submit">
                  Create Account
                </AppButton>
              )}
            </div>

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
