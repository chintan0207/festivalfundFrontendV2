import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowBigLeft,
  ArrowBigRight,
  CreditCard,
  Wallet,
  TrendingUp,
  Shield,
  Sparkles,
} from "lucide-react";
import { AppButton } from "@/components/common/AppButton";
import { AppCard } from "@/components/common/AppCard";
import { AppBadge } from "@/components/common/AppBadge";
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
    { icon: CreditCard, label: "Track Contributions", desc: "Record cash & donations" },
    { icon: Wallet, label: "Manage Expenses", desc: "Organize expenses" },
    { icon: TrendingUp, label: "Generate Reports", desc: "PDF & analytics" },
    { icon: Shield, label: "Secure Platform", desc: "Bank-grade security" },
  ];

  const currentStep = stepContent[step as keyof typeof stepContent];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:grid md:grid-cols-2 md:gap-12 md:items-center md:min-h-screen">
        <div className="hidden md:block relative">
          <div className="relative space-y-8 max-w-lg mx-auto">
            <AppBadge
              icon={<Sparkles className="h-4 w-4 text-primary" />}
              className="w-fit"
            >
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                Get Started Free
              </span>
            </AppBadge>

            <h1 className="text-5xl font-bold leading-tight tracking-tight">
              Create Your
              <br />
              <span className="gradient-text">Organization Account</span>
              <br />
              in Minutes
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Join thousands of mandals, trusts, and committees managing festival finances
              with FestivalFund's intuitive platform designed for Indian organizations.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {benefits.map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-xl text-white ${gradientColors[i % gradientColors.length]} flex-shrink-0`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{benefit.label}</p>
                      <p className="text-xs text-muted-foreground">{benefit.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <AppCard className="w-full max-w-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-chart-2/10 rounded-bl-full" />
            <div className="relative">
              <div className="text-center mb-6 space-y-1">
                <h2 className="text-lg sm:text-xl font-semibold">{currentStep.title}</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {currentStep.description}
                </p>
              </div>

              <SignupStepper step={step} />

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {step === 1 && <StepOne register={register} errors={errors} />}
                {step === 2 && <StepTwo register={register} errors={errors} />}
                {step === 3 && <StepThree register={register} errors={errors} />}
                <div className="flex justify-between gap-2 pt-2">
                  {step > 1 ? (
                    <AppButton
                      size="sm"
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                    >
                      <ArrowBigLeft className="mr-2 h-4 w-4" /> Previous
                    </AppButton>
                  ) : (
                    <div />
                  )}
                  {step < 3 ? (
                    <AppButton size="sm" type="button" onClick={nextStep}>
                      Next <ArrowBigRight className="ml-2 h-4 w-4" />
                    </AppButton>
                  ) : (
                    <AppButton size="sm" type="submit" loading={signupMutation.isPending}>
                      {signupMutation.isPending
                        ? "Creating Account..."
                        : "Create Account"}
                    </AppButton>
                  )}
                </div>
                
                <p className="text-center text-xs sm:text-sm pt-2">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-primary hover:text-primary/80"
                  >
                    Login
                  </Link>
                </p>
              </form>
            </div>
          </AppCard>
        </div>
      </div>
    </div>
  );
}

export default Signup;
