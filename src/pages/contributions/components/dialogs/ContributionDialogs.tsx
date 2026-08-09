import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Receipt, Pencil, Trash2 } from "lucide-react";
import { ConfirmDialog, FormDialog } from "@/components/common";
import { useFestivals } from "@/api/festival/useFestivals";
import { useFestivalApiStore } from "@/api/festival/festival.store";
import {
  buildContributionSchema,
  type ContributionFormValues,
} from "./contributionFormSchema";
import { ContributionFormFields } from "./ContributionFormFields";

interface ContributionDialogsProps {
  isAddOpen: boolean;
  isEditOpen: boolean;
  isDeleteOpen: boolean;
  editInitialValues?: ContributionFormValues;
  isPending: boolean;
  isDeleting: boolean;
  themeGradient: string;
  onAddClose: () => void;
  onEditClose: () => void;
  onDeleteClose: () => void;
  onAddSubmit: (values: ContributionFormValues) => void;
  onEditSubmit: (values: ContributionFormValues) => void;
  onDeleteConfirm: () => void;
}

export function ContributionDialogs({
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
}: ContributionDialogsProps) {
  const { data: festivalsData } = useFestivals();
  const activeFestivalId = useFestivalApiStore((s) => s.activeFestivalId);

  const festivalOptions = useMemo(
    () =>
      (festivalsData?.festivals ?? []).map((f) => ({
        value: f._id,
        label: `${f.name} (${f.year})`,
      })),
    [festivalsData],
  );

  const hideFestival = !!activeFestivalId;

  return (
    <>
      <ContributionFormDialog
        mode="add"
        isOpen={isAddOpen}
        isPending={isPending}
        themeGradient={themeGradient}
        festivalOptions={festivalOptions}
        hideFestival={hideFestival}
        defaultFestivalId={activeFestivalId ?? ""}
        onClose={onAddClose}
        onSubmit={onAddSubmit}
      />

      <ContributionFormDialog
        mode="edit"
        isOpen={isEditOpen}
        initialValues={editInitialValues}
        isPending={isPending}
        themeGradient={themeGradient}
        festivalOptions={festivalOptions}
        hideFestival={hideFestival}
        defaultFestivalId={activeFestivalId ?? ""}
        onClose={onEditClose}
        onSubmit={onEditSubmit}
      />

      <ConfirmDialog
        open={isDeleteOpen}
        title="Delete Contribution"
        description="Are you sure you want to delete this contribution? This action will also update the festival balance."
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

function ContributionFormDialog({
  mode,
  isOpen,
  initialValues,
  isPending,
  themeGradient,
  festivalOptions,
  hideFestival,
  defaultFestivalId,
  onClose,
  onSubmit,
}: {
  mode: "add" | "edit";
  isOpen: boolean;
  initialValues?: ContributionFormValues;
  isPending: boolean;
  themeGradient: string;
  festivalOptions: { value: string; label: string }[];
  hideFestival: boolean;
  defaultFestivalId: string;
  onClose: () => void;
  onSubmit: (values: ContributionFormValues) => void;
}) {
  const isEdit = mode === "edit";

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ContributionFormValues>({
    resolver: zodResolver(buildContributionSchema(mode)),
    defaultValues: {
      contributorMode: "existing",
      contributorId: "",
      name: "",
      phoneNumber: "",
      email: "",
      address: "",
      category: "PARENT",
      festivalId: defaultFestivalId,
      type: "MONEY",
      status: "PENDING",
      date: new Date().toISOString().slice(0, 10),
      amount: undefined,
      itemName: "",
      quantity: undefined,
      estimatedValue: undefined,
      paymentMode: "CASH",
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    if (isEdit) {
      if (initialValues) reset(initialValues);
    } else {
      reset({
        contributorMode: "existing",
        contributorId: "",
        name: "",
        phoneNumber: "",
        email: "",
        address: "",
        category: "PARENT",
        festivalId: defaultFestivalId,
        type: "MONEY",
        status: "PENDING",
        date: new Date().toISOString().slice(0, 10),
        amount: undefined,
        itemName: "",
        quantity: undefined,
        estimatedValue: undefined,
        paymentMode: "CASH",
      });
    }
  }, [isOpen, isEdit, initialValues, reset, defaultFestivalId]);

  return (
    <FormDialog
      open={isOpen}
      title={isEdit ? "Edit Contribution" : "Add New Contribution"}
      titleIcon={
        isEdit ? (
          <Pencil className="h-5 w-5 text-violet-500" />
        ) : (
          <Receipt className="h-5 w-5 text-violet-500" />
        )
      }
      description={
        isEdit
          ? "Update contribution details."
          : "Record a donor contribution & generate a receipt."
      }
      submitLabel={isEdit ? "Update Contribution" : "Save Contribution"}
      loading={isPending}
      gradient={themeGradient}
      onSubmit={handleSubmit(onSubmit)}
      onClose={onClose}
    >
      <ContributionFormFields
        mode={mode}
        register={register}
        errors={errors}
        watch={watch}
        setValue={setValue}
        prefix={mode}
        festivalOptions={festivalOptions}
        hideFestival={hideFestival}
      />
    </FormDialog>
  );
}
