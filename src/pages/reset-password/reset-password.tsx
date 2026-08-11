import { useState } from "react";
import { Link, useSearch } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Shield, Star, ArrowLeft, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { AppButton } from "@/components/common/AppButton";
import { AppCard } from "@/components/common/AppCard";
import { AppInput } from "@/components/common/AppInput";
import { AppBadge } from "@/components/common/AppBadge";
import { AppLogo } from "@/components/common";
import { resetPasswordSchema, type ResetPasswordFormData } from "../auth/schema/AuthSchema";
import { useResetPassword } from "@/api/auth/useAuth";
import { gradientColors } from "@/theme/colors";

function ResetPassword() {
  const resetPasswordMutation = useResetPassword();
  const search = useSearch({ from: "/_auth/reset-password" });
  const token = (search as { token?: string }).token;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      <div className="min-h-[100dvh] w-full overflow-hidden bg-background flex items-center justify-center p-4">
        <AppCard className="w-full max-w-md p-5 sm:p-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-3 border border-destructive/20">
            <Shield className="h-7 w-7 text-destructive" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-1.5">Invalid Reset Link</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mb-5 leading-relaxed">
            This password reset link is invalid or has expired. Please request a new one to continue.
          </p>
          <Link to="/forgot-password">
            <AppButton className="w-full h-9.5 text-xs sm:text-sm">
              Request New Reset Link
            </AppButton>
          </Link>
        </AppCard>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] w-full bg-background flex flex-col py-6 overflow-y-auto sm:py-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl h-full flex items-center justify-center my-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 items-center w-full">
          {/* Left Side Info */}
          <div className="hidden md:block space-y-6 max-w-lg mx-auto lg:mx-0">
            <AppBadge icon={<Star className="h-4 w-4 text-primary" />} className="w-fit">
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                New Password
              </span>
            </AppBadge>

            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold leading-[1.15] tracking-tight">
              Create a <span className="gradient-text">New Password</span>
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Choose a strong password that you haven't used before. Make sure it's at
              least 6 characters long for account safety.
            </p>

            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3.5 p-3 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-md ${gradientColors[0]} flex-shrink-0`}
                >
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">
                    Secure Credentials
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Minimum 6 characters required
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-md ${gradientColors[1]} flex-shrink-0`}
                >
                  <CheckCircle2 className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">
                    Encrypted Storage
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Your password is hashed with bcrypt encryption
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Reset Password Card */}
          <div className="flex items-center justify-center w-full">
            <AppCard className="w-full max-w-md p-5 sm:p-6 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-36 h-36 bg-gradient-to-br from-primary/15 via-chart-2/10 to-transparent rounded-full blur-md pointer-events-none" />

              <div className="relative">
                {/* Brand Header */}
                <div className="flex items-center gap-2 mb-4">
                  <AppLogo size="sm" />
                </div>

                <div className="mb-4 space-y-0.5">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    Reset Password
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Enter your new password below
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <AppInput
                    id="password"
                    label="New Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    leftIcon={<Lock className="h-4 w-4" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="hover:text-foreground transition-colors focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    }
                    {...register("password")}
                    error={errors.password?.message}
                  />

                  <AppInput
                    id="confirmPassword"
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    leftIcon={<Lock className="h-4 w-4" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="hover:text-foreground transition-colors focus:outline-none"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    }
                    {...register("confirmPassword")}
                    error={errors.confirmPassword?.message}
                  />

                  <AppButton
                    type="submit"
                    loading={resetPasswordMutation.isPending}
                    className="w-full h-9.5"
                  >
                    {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
                  </AppButton>

                  <div className="mt-4 text-center pt-2 border-t border-border/50">
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      Back to Sign In
                    </Link>
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

export default ResetPassword;