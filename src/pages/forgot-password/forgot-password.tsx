import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Star, Shield, ArrowLeft, MailCheck, RotateCcw } from "lucide-react";
import { AppButton } from "@/components/common/AppButton";
import { AppCard } from "@/components/common/AppCard";
import { AppInput } from "@/components/common/AppInput";
import { AppBadge } from "@/components/common/AppBadge";
import { AppLogo } from "@/components/common/AppLogo";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../auth/schema/AuthSchema";
import { useForgotPassword } from "@/api/hooks/useAuth";
import { gradientColors } from "@/theme/colors";

function ForgotPassword() {
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
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
    forgotPasswordMutation.mutate(
      { email: data.email },
      {
        onSuccess: () => {
          setSubmittedEmail(data.email);
          setEmailSent(true);
        },
      }
    );
  };

  const handleResend = () => {
    if (!submittedEmail) return;
    forgotPasswordMutation.mutate({ email: submittedEmail });
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-background flex flex-col justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl h-full flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 items-center w-full">
          
          {/* Left Side Info */}
          <div className="hidden md:block space-y-6 max-w-lg mx-auto lg:mx-0">
            <AppBadge icon={<Star className="h-4 w-4 text-primary" />}>
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                {emailSent ? "Check Your Inbox" : "Forgot Password"}
              </span>
            </AppBadge>

            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold leading-[1.15] tracking-tight">
              {emailSent ? (
                <>
                  Reset Link <span className="gradient-text">Sent</span>
                </>
              ) : (
                <>
                  Reset Your <span className="gradient-text">Password</span>
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {emailSent
                ? `We've sent a password reset link to ${submittedEmail}. Please check your inbox and follow the instructions.`
                : "Enter your registered email address and we'll send you a link to reset your password securely."}
            </p>

            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3.5 p-3 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-md ${gradientColors[0]} flex-shrink-0`}>
                  <MailCheck className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Fast & Secure Reset</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Temporary reset token expires in 20 minutes
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-md ${gradientColors[1]} flex-shrink-0`}>
                  <Shield className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Protected Access</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Identity verified via secure encrypted email link
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Card */}
          <div className="flex items-center justify-center w-full">
            <AppCard className="w-full max-w-md p-5 sm:p-6 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-36 h-36 bg-gradient-to-br from-primary/15 via-chart-2/10 to-transparent rounded-full blur-2xl pointer-events-none" />

              <div className="relative">
                {/* Brand Header */}
                <div className="flex items-center gap-2 mb-4">
                  <AppLogo size="sm" />
                </div>

                {emailSent ? (
                  <div className="space-y-5 text-center py-1">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                      <MailCheck className="h-7 w-7 text-primary animate-pulse" />
                    </div>

                    <div className="space-y-1">
                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Check your email</h2>
                      <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-xs mx-auto">
                        We've sent a password reset link to{" "}
                        <span className="font-semibold text-foreground">{submittedEmail}</span>.
                        Please check your inbox and spam folder.
                      </p>
                    </div>

                    <div className="space-y-2.5 pt-1">
                      <AppButton
                        variant="outline"
                        className="w-full h-9.5 text-xs sm:text-sm"
                        onClick={handleResend}
                        loading={forgotPasswordMutation.isPending}
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        {forgotPasswordMutation.isPending ? "Resending..." : "Resend Email"}
                      </AppButton>

                      <AppButton
                        variant="ghost"
                        className="w-full text-muted-foreground hover:text-foreground h-9.5 text-xs sm:text-sm"
                        onClick={() => setEmailSent(false)}
                      >
                        Try a different email
                      </AppButton>
                    </div>

                    <div className="pt-3 border-t border-border/50">
                      <Link
                        to="/login"
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back to Sign In
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 space-y-0.5">
                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Forgot Password?</h2>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Enter your email and we'll send you a reset link
                      </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <AppInput
                        id="email"
                        label="Email Address"
                        type="email"
                        placeholder="you@company.com"
                        leftIcon={<Mail className="h-4 w-4" />}
                        {...register("email")}
                        error={errors.email?.message}
                      />

                      <AppButton
                        type="submit"
                        loading={forgotPasswordMutation.isPending}
                        className="w-full h-9.5"
                      >
                        {forgotPasswordMutation.isPending ? "Sending..." : "Send Reset Link"}
                      </AppButton>

                      <div className="mt-4 text-center pt-2 border-t border-border/50">
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Remember your password?{" "}
                          <Link
                            to="/login"
                            className="font-semibold text-primary hover:underline transition-all"
                          >
                            Sign in
                          </Link>
                        </p>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </AppCard>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
