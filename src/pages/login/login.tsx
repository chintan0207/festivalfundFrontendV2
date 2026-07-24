/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Star, CreditCard, Wallet, TrendingUp } from "lucide-react";
import { AppButton } from "@/components/common/AppButton";
import { AppCard } from "@/components/common/AppCard";
import { AppInput } from "@/components/common/AppInput";
import { AppBadge } from "@/components/common/AppBadge";
import { loginSchema } from "../auth/schema/AuthSchema";
import { useLogin } from "@/api/hooks/useAuth";
import { gradientColors } from "@/theme/colors";

function Login() {
  const loginMutation = useLogin();
  const [rememberMe, setRememberMe] = useState(false);

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
      desc: "Monitor and manage all contributions",
    },
    { icon: Wallet, label: "Expense Management", desc: "Track and organize expenses" },
    {
      icon: TrendingUp,
      label: "Real-time Reports",
      desc: "Get instant insights into your festival finances",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:grid md:grid-cols-2 md:gap-12 md:items-center md:min-h-screen">
        <div className="hidden md:block relative">
          <div className="relative space-y-8 max-w-lg mx-auto">
            <AppBadge icon={<Star className="h-4 w-4 text-primary" />} className="w-fit">
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                Welcome Back
              </span>
            </AppBadge>

            <h1 className="text-5xl font-bold leading-tight tracking-tight">
              Access Your
              <span className="gradient-text"> Festival Dashboard </span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Track contributions, manage expenses, and generate professional reports for
              Ganesh Chaturthi, Navratri, and more with India's most trusted festival
              platform.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-xl text-white ${gradientColors[i % gradientColors.length]} flex-shrink-0`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{feature.label}</p>
                      <p className="text-xs text-muted-foreground">{feature.desc}</p>
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
              <div className="mb-6">
                <h2 className="text-2xl font-bold">Login</h2>
                <p className="text-muted-foreground mt-1">
                  Access your FestivalFund dashboard
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

                <AppInput
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  leftIcon={<Lock className="h-4 w-4" />}
                  {...register("password")}
                  error={errors?.password?.message}
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      id="remember"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="remember" className="text-sm font-medium">
                      Remember me
                    </label>
                  </div>

                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-primary hover:text-primary/80"
                  >
                    Forgot password?
                  </Link>
                </div>

                <AppButton
                  type="submit"
                  loading={isSubmitting || loginMutation.isPending}
                  className="w-full font-medium"
                >
                  {isSubmitting || loginMutation.isPending ? "Signing in..." : "Sign in"}
                </AppButton>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-card text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <AppButton
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 font-medium"
                  type="button"
                  onClick={() => alert("Google login (UI only)")}
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    className="h-4 w-4"
                    alt="Google"
                  />
                  Continue with Google
                </AppButton>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link
                      to="/signup"
                      className="font-semibold text-primary hover:text-primary/80"
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
  );
}

export default Login;
