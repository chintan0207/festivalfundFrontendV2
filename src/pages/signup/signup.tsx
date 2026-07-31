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
import { useGoogleLogin } from "@react-oauth/google";
import { useSignup, useGoogleAuth } from "@/api/auth/useAuth";
import { toast } from "sonner";
import { gradientColors } from "@/theme/colors";

function Signup() {
  const signupMutation = useSignup();
  const googleAuthMutation = useGoogleAuth();
  const [step, setStep] = useState(1);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      if (tokenResponse.access_token) {
        googleAuthMutation.mutate({ accessToken: tokenResponse.access_token });
      } else {
        toast.error("Google authentication failed");
      }
    },
    onError: () => {
      toast.error("Google Sign-In failed or was cancelled");
    },
  });

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
    <div className="min-h-screen w-screen bg-background flex flex-col justify-center py-6 sm:py-0 overflow-y-auto sm:overflow-hidden">
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
              <div className="absolute -top-10 -right-10 w-36 h-36 bg-gradient-to-br from-primary/15 via-chart-2/10 to-transparent rounded-full blur-md pointer-events-none" />

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
                  {step === 1 && (
                    <>
                      <StepOne register={register} errors={errors} />
                      <div className="relative my-3">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-border/60" />
                        </div>
                        <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                          <span className="px-3 bg-card text-muted-foreground font-medium">
                            Or instant sign up
                          </span>
                        </div>
                      </div>
                      <AppButton
                        variant="outline"
                        className="w-full h-10 text-xs sm:text-sm font-medium border-border/80 hover:bg-muted/70 transition-all rounded-xl gap-2.5 shadow-2xs mt-1"
                        type="button"
                        loading={googleAuthMutation.isPending}
                        onClick={() => handleGoogleLogin()}
                      >
                        <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                        Sign up with Google
                      </AppButton>
                    </>
                  )}
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
