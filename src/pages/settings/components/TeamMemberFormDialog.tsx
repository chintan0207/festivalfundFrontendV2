import { useEffect } from "react";
import { useForm, useController } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormDialog } from "@/components/common/FormDialog";
import { AppInput } from "@/components/common/AppInput";
import { AppSelect, type AppSelectOption } from "@/components/common/AppSelect";
import { Users } from "lucide-react";
import { GlobalRoleEnum } from "@/lib/constants";
import type { User } from "@/types/Types";
import {
  teamMemberFormSchema,
  type TeamMemberFormValues,
} from "./TeamMemberFormSchema";

export type { TeamMemberFormValues } from "./TeamMemberFormSchema";

export type TeamMemberFormMode = "invite" | "create";

interface TeamMemberFormDialogProps {
  mode: TeamMemberFormMode;
  member?: User | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: TeamMemberFormValues) => void;
}

const roleOptions: AppSelectOption[] = [
  { value: GlobalRoleEnum.ORG_ADMIN, label: "Org Admin" },
  { value: GlobalRoleEnum.ORG_VIEWER, label: "Org Viewer" },
];

export function TeamMemberFormDialog({
  mode,
  member,
  loading,
  onClose,
  onSubmit,
}: TeamMemberFormDialogProps) {
  const isEdit = !!member;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberFormSchema),
    defaultValues: {
      name: member?.name ?? "",
      email: member?.email ?? "",
      password: "",
      role: (member?.role as TeamMemberFormValues["role"]) ?? GlobalRoleEnum.ORG_VIEWER,
      phoneNumber: member?.phoneNumber ?? "",
    },
  });

  const { field: roleField } = useController({
    name: "role",
    control,
  });

  useEffect(() => {
    reset({
      name: member?.name ?? "",
      email: member?.email ?? "",
      password: "",
      role: (member?.role as TeamMemberFormValues["role"]) ?? GlobalRoleEnum.ORG_VIEWER,
      phoneNumber: member?.phoneNumber ?? "",
    });
  }, [member, reset]);

  return (
    <FormDialog
      open
      onClose={onClose}
      title={
        mode === "invite"
          ? "Invite Team Member"
          : isEdit
            ? "Edit Team Member"
            : "Create Team Member"
      }
      titleIcon={<Users className="h-5 w-5" />}
      description={
        mode === "invite"
          ? "Send an email invitation. The member will set their own password (or sign in with Google) on acceptance."
          : isEdit
            ? "Update the selected team member's details."
            : "Create an account directly with a password you set."
      }
      submitLabel={mode === "invite" ? "Send Invite" : isEdit ? "Save Changes" : "Create Member"}
      loading={loading}
      onSubmit={handleSubmit(onSubmit)}
      contentClassName="sm:max-w-lg"
    >
      <div className="grid gap-4">
        <AppInput
          label="Full Name"
          id="tm-name"
          placeholder="e.g. Anit Sharma"
          {...register("name")}
          error={errors.name?.message}
          required
        />
        <AppInput
          label="Email"
          id="tm-email"
          type="email"
          placeholder="member@organization.org"
          {...register("email")}
          error={errors.email?.message}
          required
        />
        {mode === "create" && (
          <AppInput
            label={isEdit ? "New Password (leave blank to keep)" : "Password"}
            id="tm-password"
            type="password"
            placeholder="Min 6 characters"
            {...register("password")}
            error={errors.password?.message}
            required={!isEdit}
          />
        )}
        <div className="grid sm:grid-cols-2 gap-4">
          {mode !== "invite" && (
            <AppInput
              label="Phone (optional)"
              id="tm-phone"
              inputMode="numeric"
              maxLength={10}
              placeholder="10-digit mobile"
              {...register("phoneNumber")}
              error={errors.phoneNumber?.message}
            />
          )}
          <AppSelect
            id="tm-role"
            label="Role"
            value={roleField.value}
            onChange={(val) => roleField.onChange(val as TeamMemberFormValues["role"])}
            options={roleOptions}
          />
        </div>
      </div>
    </FormDialog>
  );
}
