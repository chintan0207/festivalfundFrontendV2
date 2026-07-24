/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Star, CreditCard, Wallet, TrendingUp, Eye, EyeOff } from "lucide-react";
import { AppButton } from "@/components/common/AppButton";
import { AppCard } from "@/components/common/AppCard";
import { AppInput } from "@/components/common/AppInput";
import { AppBadge } from "@/components/common/AppBadge";
import { AppLogo } from "@/components/common";
import { loginSchema } from "../auth/schema/AuthSchema";
import { useLogin } from "@/api/hooks/useAuth";
import { gradientColors } from "@/theme/colors";

function Login() {
  const loginMutation = useLogin();
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: any) => {
    loginMutation.mutate({ email: data.email, password: data.password });
  };

  const features = [
    {
      icon: CreditCard,
      label: "Contribution Tracking",
      desc: "Monitor cash & digital donations effortlessly",
    },
    {
      icon: Wallet,
      label: "Expense Management",
      desc: "Track vendor payments & committee spends",
    },
    {
      icon: TrendingUp,
      label: "Real-time Analytics",
      desc: "Instant insights & financial reporting",
    },
  ];

  return (
    <div className="min-h-screen w-screen bg-background flex flex-col justify-center py-6 sm:py-0 overflow-y-auto sm:overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl h-full flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 items-center w-full">
          {/* Left Side Feature Showcase */}
          <div className="hidden md:block space-y-6 max-w-lg mx-auto lg:mx-0">
            <AppBadge icon={<Star className="h-4 w-4 text-primary" />}>
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                Welcome Back
              </span>
            </AppBadge>

            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold leading-[1.15] tracking-tight">
              Access Your <span className="gradient-text">Festival Dashboard</span>
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Track contributions, manage expenses, and generate professional reports for
              Ganesh Chaturthi, Navratri, and major events with India's trusted mandal
              platform.
            </p>

            <div className="space-y-3 pt-1">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={i}
                    className="flex items-start gap-3.5 p-3 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm"
                  >
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-md ${gradientColors[i % gradientColors.length]} flex-shrink-0`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">
                        {feature.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side Login Card */}
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
                    Sign in to your account
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Enter your credentials below to get started
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <AppInput
                    id="email"
                    label="Email Address"
                    type="email"
                    placeholder="name@example.com"
                    leftIcon={<Mail className="h-4 w-4" />}
                    {...register("email")}
                    error={errors.email?.message}
                  />

                  <AppInput
                    id="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
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
                    error={errors?.password?.message}
                  />

                  <div className="flex items-center justify-between pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        id="remember"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 rounded border-input text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                      />
                      <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                        Remember me
                      </span>
                    </label>

                    <Link
                      to="/forgot-password"
                      className="text-xs sm:text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <AppButton
                    type="submit"
                    loading={isSubmitting || loginMutation.isPending}
                    className="w-full h-9.5"
                  >
                    {isSubmitting || loginMutation.isPending
                      ? "Signing in..."
                      : "Sign in"}
                  </AppButton>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border/60" />
                    </div>
                    <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                      <span className="px-3 bg-card text-muted-foreground font-medium">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <AppButton
                    variant="outline"
                    className="w-full h-9.5 text-xs sm:text-sm"
                    type="button"
                    onClick={() => alert("Google login (UI ready)")}
                  >
                    <img
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      className="h-4 w-4"
                      alt="Google"
                    />
                    Continue with Google
                  </AppButton>

                  <div className="mt-4 text-center pt-2 border-t border-border/50">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Don't have an account?{" "}
                      <Link
                        to="/signup"
                        className="font-semibold text-primary hover:underline transition-all"
                      >
                        Sign up for free
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

export default Login;
