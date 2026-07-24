import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Star, Shield, ArrowLeft } from "lucide-react";
import { AppButton } from "@/components/common/AppButton";
import { AppCard } from "@/components/common/AppCard";
import { AppInput } from "@/components/common/AppInput";
import { AppBadge } from "@/components/common/AppBadge";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../auth/schema/AuthSchema";
import { useForgotPassword } from "@/api/hooks/useAuth";

function ForgotPassword() {
  const forgotPasswordMutation = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    forgotPasswordMutation.mutate({ email: data.email });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:grid md:grid-cols-2 md:gap-12 md:items-center md:min-h-screen">
        <div className="hidden md:block relative">
          <div className="relative space-y-8 max-w-lg mx-auto">
            <AppBadge icon={<Star className="h-4 w-4 text-primary" />} className="w-fit">
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                Forgot Password
              </span>
            </AppBadge>

            <h1 className="text-5xl font-bold leading-tight tracking-tight">
              Reset Your<span className="gradient-text"> Password</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Enter your registered email address and we'll send you a link to reset your
              password.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl text-white bg-gradient-to-r from-green-500 to-emerald-500 flex-shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">Email Verification</p>
                  <p className="text-xs text-muted-foreground">
                    We'll verify your identity
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl text-white bg-gradient-to-r from-indigo-500 to-purple-500 flex-shrink-0">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">Secure Reset Link</p>
                  <p className="text-xs text-muted-foreground">
                    Temporary token expires in 1 hour
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <AppCard className="w-full max-w-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-chart-2/10 rounded-bl-full" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-6">
                <Link
                  to="/"
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
                    F
                  </div>
                  <span className="text-lg font-semibold">FestivalFund</span>
                </Link>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-bold">Forgot Password</h2>
                <p className="text-muted-foreground mt-1">
                  Enter your email to receive reset instructions
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <AppInput
                  id="email"
                  label="Email Address"
                  placeholder="name@example.com"
                  leftIcon={<Mail className="h-4 w-4" />}
                  {...register("email")}
                  error={errors.email?.message}
                />

                <AppButton
                  type="submit"
                  loading={forgotPasswordMutation.isPending}
                  className="w-full font-medium"
                >
                  {forgotPasswordMutation.isPending ? "Sending..." : "Send Reset Link"}
                </AppButton>

                <div className="mt-4 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Back to Login
                  </Link>
                </div>
              </form>
            </div>
          </AppCard>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
