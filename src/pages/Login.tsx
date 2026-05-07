/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AppButton } from "@/components/common/AppButton";
import { AppCard } from "@/components/common/AppCard";
import { AppInput } from "@/components/common/AppInput";
import { loginSchema } from "./schema/AuthSchema";
import { useAuthStore } from "@/api/auth/auth.store";

export default function Login() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
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
    console.log({ ...data, rememberMe });
    const success = await login(data.email, data.password);
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden grid md:grid-cols-2 bg-muted/40">
      {/* LEFT SIDE */}
      <div className="hidden md:flex flex-col justify-center px-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />

        <div className="relative max-w-lg space-y-8">
          <h1 className="text-4xl font-bold leading-tight tracking-tight">
            Modern Festival Management for{" "}
            <span className="text-primary">Every Mandal</span>
          </h1>

          <p className="text-muted-foreground text-base leading-relaxed">
            Track contributions, manage expenses, and generate professional reports for
            Ganesh Chaturthi, Navratri, and more.
          </p>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Contribution Tracking
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Expense Management
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Real-time Reports
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center px-4 py-10 w-full">
        <AppCard
          className="w-full max-w-md"
          title="Login"
          subtitle="Access your FestivalFund dashboard"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <AppInput
              id="email"
              label="Email"
              placeholder="name@example.com"
              {...register("email")}
              error={errors.email?.message}
            />

            {/* Password */}
            <AppInput
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              error={errors?.password?.message}
            />

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(val) => setRememberMe(!!val)}
                />
                <Label htmlFor="remember" className="text-sm">
                  Remember me
                </Label>
              </div>

              <AppButton variant="link" className="px-0 text-sm">
                Forgot password?
              </AppButton>
            </div>

            {/* Login */}
            <AppButton type="submit" loading={isSubmitting} className="w-full text-base">
              Login
            </AppButton>

            {/* Google */}
            <AppButton
              variant="outline"
              className="w-full flex items-center gap-2"
              type="button"
              onClick={() => alert("Google login (UI only)")}
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                className="h-4 w-4"
              />
              Continue with Google
            </AppButton>

            {/* Signup */}
            <div className="text-center text-sm">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-primary font-medium">
                Sign up
              </Link>
            </div>
          </form>
        </AppCard>
      </div>
    </div>
  );
}
