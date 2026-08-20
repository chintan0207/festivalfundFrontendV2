/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Receipt, Pencil, Trash2 } from "lucide-react";
import { ConfirmDialog, FormDialog } from "@/components/common";
import { useFestivals } from "@/api/festival/useFestivals";
import { useFestivalApiStore } from "@/api/festival/festival.store";
import { buildExpenseSchema, type ExpenseFormValues } from "./expenseFormSchema";
import { ExpenseFormFields } from "./ExpenseFormFields";

interface ExpenseDialogsProps {
  isAddOpen: boolean;
  isEditOpen: boolean;
  isDeleteOpen: boolean;
  editInitialValues?: ExpenseFormValues;
  isPending: boolean;
  isDeleting: boolean;
  themeGradient: string;
  onAddClose: () => void;
  onEditClose: () => void;
  onDeleteClose: () => void;
  onAddSubmit: (values: ExpenseFormValues) => void;
  onEditSubmit: (values: ExpenseFormValues) => void;
  onDeleteConfirm: () => void;
}

export function ExpenseDialogs({
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
}: ExpenseDialogsProps) {
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
      <ExpenseFormDialog
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

      <ExpenseFormDialog
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
        title="Delete Expense"
        description="Are you sure you want to delete this expense? Only pending expenses can be deleted."
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

function ExpenseFormDialog({
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
  initialValues?: ExpenseFormValues;
  isPending: boolean;
  themeGradient: string;
  festivalOptions: { value: string; label: string }[];
  hideFestival: boolean;
  defaultFestivalId: string;
  onClose: () => void;
  onSubmit: (values: ExpenseFormValues) => void;
}) {
  const isEdit = mode === "edit";

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(buildExpenseSchema(mode)) as any,
    defaultValues: {
      festivalId: defaultFestivalId,
      description: "",
      amount: undefined,
      category: "FOOD",
      date: new Date().toISOString().slice(0, 10),
      vendorName: "",
      invoiceNumber: "",
      paymentMode: "UPI",
      status: "PENDING",
      attachments: [],
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    if (isEdit) {
      if (initialValues) reset(initialValues);
    } else {
      reset({
        festivalId: defaultFestivalId,
        description: "",
        amount: undefined,
        category: "FOOD",
        date: new Date().toISOString().slice(0, 10),
        vendorName: "",
        invoiceNumber: "",
        paymentMode: "UPI",
        status: "PENDING",
        attachments: [],
      });
    }
  }, [isOpen, isEdit, initialValues, reset, defaultFestivalId]);

  return (
    <FormDialog
      open={isOpen}
      title={isEdit ? "Edit Expense" : "Add New Expense"}
      titleIcon={
        isEdit ? (
          <Pencil className="h-5 w-5 text-rose-500" />
        ) : (
          <Receipt className="h-5 w-5 text-rose-500" />
        )
      }
      description={
        isEdit ? "Update expense details." : "Record a vendor expense & voucher payment."
      }
      submitLabel={isEdit ? "Update Expense" : "Save Expense"}
      loading={isPending}
      gradient={themeGradient}
      onSubmit={handleSubmit(onSubmit)}
      onClose={onClose}
    >
      <ExpenseFormFields
        mode={mode}
        register={register}
        errors={errors}
        watch={watch}
        setValue={setValue}
        prefix={mode}
        festivalOptions={festivalOptions}
        hideFestival={hideFestival}
        disabled={isPending}
      />
    </FormDialog>
  );
}
