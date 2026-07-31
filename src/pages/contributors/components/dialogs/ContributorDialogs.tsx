import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Users, Pencil, Trash2 } from "lucide-react";
import { ConfirmDialog, FormDialog } from "@/components/common";
import { contributorSchema, type ContributorFormValues } from "./contributorFormSchema";
import { ContributorFormFields } from "./ContributorFormFields";

interface ContributorDialogsProps {
  isAddOpen: boolean;
  isEditOpen: boolean;
  isDeleteOpen: boolean;
  editInitialValues?: ContributorFormValues;
  isPending: boolean;
  isDeleting: boolean;
  themeGradient: string;
  onAddClose: () => void;
  onEditClose: () => void;
  onDeleteClose: () => void;
  onAddSubmit: (values: ContributorFormValues) => void;
  onEditSubmit: (values: ContributorFormValues) => void;
  onDeleteConfirm: () => void;
}

export function ContributorDialogs({
  isAddOpen,
  isEditOpen,
  isDeleteOpen,
  editInitialValues,
  isPending,
  isDeleting,
  themeGradient,
  onAddClose,
  onEditClose,
  onDeleteClose,
  onAddSubmit,
  onEditSubmit,
  onDeleteConfirm,
}: ContributorDialogsProps) {
  return (
    <>
      <ContributorFormDialog
        mode="add"
        isOpen={isAddOpen}
        isPending={isPending}
        themeGradient={themeGradient}
        onClose={onAddClose}
        onSubmit={onAddSubmit}
      />

      <ContributorFormDialog
        mode="edit"
        isOpen={isEditOpen}
        initialValues={editInitialValues}
        isPending={isPending}
        themeGradient={themeGradient}
        onClose={onEditClose}
        onSubmit={onEditSubmit}
      />

      <ConfirmDialog
        open={isDeleteOpen}
        title="Delete Contributor"
        description="Are you sure you want to delete this contributor? This action can be undone by an administrator."
        confirmLabel="Delete"
        variant="danger"
        icon={<Trash2 className="h-5 w-5" />}
        loading={isDeleting}
        onConfirm={onDeleteConfirm}
        onCancel={onDeleteClose}
      />
    </>
  );
}

function ContributorFormDialog({
  mode,
  isOpen,
  initialValues,
  isPending,
  themeGradient,
  onClose,
  onSubmit,
}: {
  mode: "add" | "edit";
  isOpen: boolean;
  initialValues?: ContributorFormValues;
  isPending: boolean;
  themeGradient: string;
  onClose: () => void;
  onSubmit: (values: ContributorFormValues) => void;
}) {
  const isEdit = mode === "edit";

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ContributorFormValues>({
    resolver: zodResolver(contributorSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      email: "",
      address: "",
      category: "PARENT",
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    if (isEdit) {
      if (initialValues) reset(initialValues);
    } else {
      reset({
        name: "",
        phoneNumber: "",
        email: "",
        address: "",
        category: "PARENT",
      });
    }
  }, [isOpen, isEdit, initialValues, reset]);

  return (
    <FormDialog
      open={isOpen}
      title={isEdit ? "Edit Contributor" : "Add New Contributor"}
      titleIcon={
        isEdit ? (
          <Pencil className="h-5 w-5 text-indigo-500" />
        ) : (
          <Users className="h-5 w-5 text-green-500" />
        )
      }
      description={isEdit ? "Update donor details." : "Register a new donor into the system."}
      submitLabel={isEdit ? "Update Contributor" : "Save Contributor"}
      loading={isPending}
      gradient={themeGradient}
      onSubmit={handleSubmit(onSubmit)}
      onClose={onClose}
    >
      <ContributorFormFields
        register={register}
        errors={errors}
        watch={watch}
        setValue={setValue}
        prefix={mode}
      />
    </FormDialog>
  );
}
