/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { ArrowRight, Lock, Shield, Star, Users, Loader2 } from "lucide-react";
import { AppButton } from "@/components/common/AppButton";
import { AppCard } from "@/components/common/AppCard";
import { AppInput } from "@/components/common/AppInput";
import { AppBadge } from "@/components/common/AppBadge";
import { AppLogo } from "@/components/common";
import { gradientColors } from "@/theme/colors";
import {
  acceptInvitationSchema,
  type AcceptInvitationFormData,
} from "../auth/schema/AuthSchema";
import { useVerifyInvitation, useAcceptInvitation } from "@/api/organization/useOrganization";
import { useGoogleAuth } from "@/api/auth/useAuth";
import { useAuthStore } from "@/api/auth/auth.store";

const AcceptInvitePage = ({ token }: { token: string }) => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { data: verification, isLoading, isError, error } = useVerifyInvitation(token);
  const { mutateAsync: accept, isPending } = useAcceptInvitation();
  const googleAuthMutation = useGoogleAuth();
  const [googlePending, setGooglePending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AcceptInvitationFormData>({
    resolver: zodResolver(acceptInvitationSchema),
    mode: "onChange",
  });

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if (tokenResponse.access_token) {
        setGooglePending(true);
        googleAuthMutation.mutate(
          { accessToken: tokenResponse.access_token, inviteToken: token },
          {
            onSuccess: (res) => {
              const data = res.data;
              if (data) {
                const { accessToken, refreshToken, loggedInUser, organization } = data;
                setAuth({ user: loggedInUser, organization, accessToken, refreshToken });
                toast.success("Invitation accepted and logged in with Google");
                navigate({ to: "/dashboard", replace: true });
              }
            },
            onSettled: () => setGooglePending(false),
          },
        );
      }
    },
    onError: () => {
      setGooglePending(false);
      toast.error("Google Sign-In failed or was cancelled");
    },
  });

  const onSubmit = async (data: AcceptInvitationFormData) => {
    const res = await accept({ token, name: data.name, password: data.password });
    if (res?.data) {
      const { accessToken, refreshToken, loggedInUser, organization } = res.data;
      setAuth({ user: loggedInUser, organization, accessToken, refreshToken });
      toast.success(res.message || "Invitation accepted. Welcome!");
      navigate({ to: "/dashboard", replace: true });
    }
  };

  return (
    <div className="min-h-screen w-screen bg-background flex flex-col justify-center py-6 sm:py-0 overflow-y-auto sm:overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl h-full flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 items-center w-full">
          {/* Left Side Feature Showcase */}
          <div className="hidden md:block space-y-6 max-w-lg mx-auto lg:mx-0">
            <AppBadge icon={<Star className="h-4 w-4 text-primary" />} className="w-fit">
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                You're Invited
              </span>
            </AppBadge>

            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold leading-[1.15] tracking-tight">
              Join Your <span className="gradient-text">Organization Workspace</span>
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Accept your invitation to start managing contributions, expenses, and reports
              for your organization with FestivalFund.
            </p>

            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3.5 p-3 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-md ${gradientColors[0]} flex-shrink-0`}
                >
                  <Users className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">
                    Invite-based Access
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Set your password or sign in with Google to join instantly
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-md ${gradientColors[1]} flex-shrink-0`}
                >
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">
                    Secure Onboarding
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Role-based access with your organization team
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Invite Card */}
          <div className="flex items-center justify-center w-full">
            <AppCard className="w-full max-w-md p-5 sm:p-6 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-36 h-36 bg-gradient-to-br from-primary/15 via-chart-2/10 to-transparent rounded-full blur-md pointer-events-none" />

              <div className="relative">
                {/* Brand Header */}
                <div className="flex items-center gap-2 mb-4">
                  <AppLogo size="sm" />
                </div>

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin mb-3" />
                    <p className="text-sm">Validating your invitation...</p>
                  </div>
                ) : isError || !verification ? (
                  <div className="py-8 text-center space-y-3">
                    <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
                      <Shield className="h-6 w-6" />
                    </div>
                    <h2 className="text-lg font-bold text-foreground">Invitation Unavailable</h2>
                    <p className="text-xs text-muted-foreground">
                      {error
                        ? (error as any)?.response?.data?.message
                        : "This invitation link is invalid, expired, or has already been used."}
                    </p>
                    <Link
                      to="/login"
                      className="inline-block text-xs font-semibold text-primary hover:underline"
                    >
                      Go to Sign in
                    </Link>
                  </div>
                ) : (
                  <>
                    {/* Compact org invitation header */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white overflow-hidden shrink-0">
                        {verification.organization?.logoUrl ? (
                          <img
                            src={verification.organization.logoUrl}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Users className="h-5 w-5" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-base font-bold tracking-tight text-foreground truncate">
                          {verification.organization?.name || "Organization"}
                        </h2>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {verification.name} · {verification.email}
                        </p>
                      </div>
                      <AppBadge size="sm" className="shrink-0 capitalize">
                        {verification.role.replace("_", " ")}
                      </AppBadge>
                    </div>

                    <AppButton
                      variant="outline"
                      className="w-full h-10 text-xs font-medium border-border/80 hover:bg-muted/70 transition-all rounded-xl gap-2.5"
                      type="button"
                      loading={googlePending || googleAuthMutation.isPending}
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
                      Continue with Google
                    </AppButton>

                    <div className="relative my-3">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border/60" />
                      </div>
                      <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                        <span className="px-3 bg-card text-muted-foreground font-medium">Or</span>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                      <AppInput
                        id="acceptName"
                        label="Full Name"
                        placeholder="e.g. Anit Sharma"
                        leftIcon={<Users className="h-4 w-4" />}
                        {...register("name")}
                        error={errors.name?.message}
                      />
                      <AppInput
                        id="acceptPassword"
                        label="Set a Password"
                        type="password"
                        placeholder="Min 6 characters"
                        leftIcon={<Lock className="h-4 w-4" />}
                        {...register("password")}
                        error={errors.password?.message}
                      />
                      <AppInput
                        id="acceptConfirm"
                        label="Confirm Password"
                        type="password"
                        placeholder="Re-enter password"
                        leftIcon={<Lock className="h-4 w-4" />}
                        {...register("confirmPassword")}
                        error={errors.confirmPassword?.message}
                      />
                      <AppButton type="submit" loading={isPending} className="w-full h-10">
                        Accept Invitation <ArrowRight className="ml-2 h-4 w-4" />
                      </AppButton>
                    </form>

                    <p className="mt-3 text-center text-xs text-muted-foreground">
                      Already have an account?{" "}
                      <Link to="/login" className="font-semibold text-primary hover:underline">
                        Sign in
                      </Link>
                    </p>
                  </>
                )}
              </div>
            </AppCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcceptInvitePage;
