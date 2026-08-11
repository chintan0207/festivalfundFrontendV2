import { useEffect, useState, type FormEvent } from "react";
import { useAuthStore } from "@/api/auth/auth.store";
import { useUpdateProfile } from "@/api/auth/useAuth";
import { AppButton } from "@/components/common/AppButton";
import { AppInput } from "@/components/common/AppInput";
import { AppBadge } from "@/components/common/AppBadge";
import { Badge } from "@/components/ui/badge";
import { roleStyles } from "@/pages/settings/settingsRoleStyles";
import { User as UserIcon, Mail, Lock, CheckCircle } from "lucide-react";
import type { UserRole } from "@/types/Types";

export const ProfilePage = () => {
  const { user } = useAuthStore();
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [passError, setPassError] = useState("");

  useEffect(() => {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPassError("");

    if (newPassword && newPassword !== confirmPassword) {
      setPassError("Passwords do not match");
      return;
    }

    const payload: {
      name: string;
      email: string;
      currentPassword?: string;
      newPassword?: string;
    } = {
      name,
      email,
    };

    if (newPassword) {
      if (!currentPassword) {
        setPassError("Enter your current password to change password");
        return;
      }
      payload.currentPassword = currentPassword;
      payload.newPassword = newPassword;
    }

    const res = await updateProfile(payload);
    if (res) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const role = (user?.role as UserRole) ?? "ORG_VIEWER";

  return (
    <div className="space-y-6 pb-12 max-w-2xl">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">My Account</h1>
            <Badge variant="outline" className={roleStyles[role] || roleStyles.ORG_VIEWER}>
              {role.replace("_", " ")}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Update your name, login email, and password. Your login details are independent of the
            organization email.
          </p>
        </div>

        {isSaved && (
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
            <CheckCircle className="h-4 w-4" />
            <span>Profile saved successfully!</span>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4"
      >
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <UserIcon className="h-5 w-5 text-primary" />
          <h2 className="text-base font-bold text-foreground">Profile Details</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 text-xs">
          <AppInput
            id="profileName"
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <AppInput
            id="profileEmail"
            label="Login Email"
            type="email"
            leftIcon={<Mail className="h-4 w-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center gap-2 border-b border-border pb-3 pt-2">
          <Lock className="h-5 w-5 text-primary" />
          <h2 className="text-base font-bold text-foreground">Change Password</h2>
        </div>
        <p className="text-2xs text-muted-foreground -mt-2">
          Leave blank to keep your current password.
        </p>

        <div className="grid grid-cols-1 gap-4 text-xs">
          <AppInput
            id="currentPassword"
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Required only when changing password"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AppInput
              id="newPassword"
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min 6 characters"
            />
            <AppInput
              id="confirmPassword"
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              error={passError}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <AppButton type="submit" size="lg" className="rounded-xl px-8 shadow-md" loading={isPending}>
            Save Changes
          </AppButton>
        </div>
      </form>

      <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <AppBadge size="sm">Account Info</AppBadge>
        </div>
        <p className="text-xs text-muted-foreground">
          Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}. Your
          organization email is managed separately in Organization Settings by an admin.
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
