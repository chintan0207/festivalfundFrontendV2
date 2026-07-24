import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Wallet,
  TrendingUp,
  Shield,
  Sparkles,
} from "lucide-react";
import { AppButton } from "@/components/common/AppButton";
import { AppCard } from "@/components/common/AppCard";
import { AppBadge } from "@/components/common/AppBadge";
import { AppLogo } from "@/components/common";
import { registerSchema, type RegisterFormData } from "../auth/schema/AuthSchema";
import { stepContent, StepOne, StepTwo, StepThree } from "./components/SignupSteps";
import SignupStepper from "./components/SignupStepper";
import { useSignup } from "@/api/hooks/useAuth";
import { gradientColors } from "@/theme/colors";

function Signup() {
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
    if (step === 1) fields = ["name", "address"];
    if (step === 2) fields = ["adminName", "email", "phone"];
    const valid = await trigger(fields);
    if (valid) setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const onSubmit = async (data: RegisterFormData) => {
    const { name, address, adminName, email, phone, adminPassword } = data;
    signupMutation.mutate({ name, address, adminName, email, phone, adminPassword });
  };

  const benefits = [
    {
      icon: CreditCard,
      label: "Track Contributions",
      desc: "Record cash & digital donations",
    },
    {
      icon: Wallet,
      label: "Manage Expenses",
      desc: "Organize vendor payments & budgets",
    },
    {
      icon: TrendingUp,
      label: "Generate Reports",
      desc: "PDF statements & live analytics",
    },
    { icon: Shield, label: "Secure Platform", desc: "Role-based access & data security" },
  ];

  const currentStep = stepContent[step as keyof typeof stepContent];

  return (
    <div className="h-screen w-screen overflow-hidden bg-background flex flex-col justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl h-full flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 items-center w-full">
          {/* Left Side Feature Showcase */}
          <div className="hidden md:block space-y-6 max-w-lg mx-auto lg:mx-0">
            <AppBadge icon={<Sparkles className="h-4 w-4 text-primary" />}>
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                Get Started Free
              </span>
            </AppBadge>

            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold leading-[1.15] tracking-tight">
              Create Your <span className="gradient-text">Organization Account</span> in
              Minutes
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Join thousands of mandals, trusts, and committees managing festival finances
              with FestivalFund's intuitive platform built for Indian organizations.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {benefits.map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm"
                  >
                    <div
                      className={`flex h-8.5 w-8.5 items-center justify-center rounded-xl text-white shadow-sm ${gradientColors[i % gradientColors.length]} flex-shrink-0`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-xs sm:text-sm text-foreground">
                        {benefit.label}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {benefit.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side Signup Form Card */}
          <div className="flex items-center justify-center w-full">
            <AppCard className="w-full max-w-md p-5 sm:p-6 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-36 h-36 bg-gradient-to-br from-primary/15 via-chart-2/10 to-transparent rounded-full blur-2xl pointer-events-none" />

              <div className="relative">
                {/* Brand Header */}
                <div className="flex items-center gap-2 mb-4">
                  <AppLogo size="sm" />
                </div>

                <div className="mb-3 space-y-0.5">
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                    {currentStep.title}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {currentStep.description}
                  </p>
                </div>

                <SignupStepper step={step} />

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {step === 1 && <StepOne register={register} errors={errors} />}
                  {step === 2 && <StepTwo register={register} errors={errors} />}
                  {step === 3 && <StepThree register={register} errors={errors} />}

                  <div
                    className={`flex items-center justify-between ${step > 1 ? "gap-3" : ""} pt-2`}
                  >
                    {step > 1 ? (
                      <AppButton
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className="w-1/2 h-9.5 text-xs sm:text-sm"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                      </AppButton>
                    ) : (
                      <div className="w-0" />
                    )}

                    {step < 3 ? (
                      <AppButton
                        type="button"
                        onClick={nextStep}
                        className={`${step === 1 ? "w-full" : "w-1/2"} h-9.5 text-xs sm:text-sm`}
                      >
                        Next <ArrowRight className="ml-2 h-4 w-4" />
                      </AppButton>
                    ) : (
                      <AppButton
                        type="submit"
                        loading={signupMutation.isPending}
                        className="w-1/2 h-9.5 text-xs sm:text-sm"
                      >
                        {signupMutation.isPending ? "Creating..." : "Create Account"}
                      </AppButton>
                    )}
                  </div>

                  <div className="mt-4 text-center pt-2 border-t border-border/50">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="font-semibold text-primary hover:underline transition-all"
                      >
                        Sign in
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </AppCard>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
