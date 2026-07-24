import { Link, useSearch } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Shield, Star, ArrowLeft } from "lucide-react";
import { AppButton } from "@/components/common/AppButton";
import { AppCard } from "@/components/common/AppCard";
import { AppInput } from "@/components/common/AppInput";
import { AppBadge } from "@/components/common/AppBadge";
import { resetPasswordSchema, type ResetPasswordFormData } from "../auth/schema/AuthSchema";
import { useResetPassword } from "@/api/hooks/useAuth";

function ResetPassword() {
  const resetPasswordMutation = useResetPassword();
  const search = useSearch({ from: "/_auth/reset-password" });
  const token = (search as { token?: string }).token;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;
    resetPasswordMutation.mutate({ token, password: data.password });
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <AppCard className="w-full max-w-md">
          <div className="text-center py-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mx-auto mb-4">
              <Shield className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Invalid Reset Link</h2>
            <p className="text-muted-foreground mb-6">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Link to="/forgot-password">
              <AppButton>Request New Reset Link</AppButton>
            </Link>
          </div>
        </AppCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:grid md:grid-cols-2 md:gap-12 md:items-center md:min-h-screen">
        <div className="hidden md:block relative">
          <div className="relative space-y-8 max-w-lg mx-auto">
            <AppBadge icon={<Star className="h-4 w-4 text-primary" />} className="w-fit">
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                New Password
              </span>
            </AppBadge>

            <h1 className="text-5xl font-bold leading-tight tracking-tight">
              Create a
              <span className="gradient-text"> New Password</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Choose a strong password that you haven't used before. Make sure it's at least 6 characters long.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl text-white bg-gradient-to-r from-green-500 to-emerald-500 flex-shrink-0">
                  <Lock className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">Secure Password</p>
                  <p className="text-xs text-muted-foreground">Minimum 6 characters required</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl text-white bg-gradient-to-r from-indigo-500 to-purple-500 flex-shrink-0">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">Encrypted</p>
                  <p className="text-xs text-muted-foreground">Your password is hashed and encrypted</p>
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
                <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
                    F
                  </div>
                  <span className="text-lg font-semibold">FestivalFund</span>
                </Link>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-bold">Reset Password</h2>
                <p className="text-muted-foreground mt-1">
                  Enter your new password below
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <AppInput
                  id="password"
                  label="New Password"
                  type="password"
                  placeholder="Enter new password"
                  leftIcon={<Lock className="h-4 w-4" />}
                  {...register("password")}
                  error={errors.password?.message}
                />

                <AppInput
                  id="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm new password"
                  leftIcon={<Lock className="h-4 w-4" />}
                  {...register("confirmPassword")}
                  error={errors.confirmPassword?.message}
                />

                <AppButton
                  type="submit"
                  loading={resetPasswordMutation.isPending}
                  className="w-full font-medium"
                >
                  {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;