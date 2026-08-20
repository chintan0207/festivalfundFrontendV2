import { useCallback, useMemo, useState } from "react";
import {
  useCreateExpense,
  useUpdateExpense,
  useDeleteExpense,
} from "@/api/expense/useExpenses";
import type { ExpenseFormValues } from "./components/dialogs/expenseFormSchema";
import type {
  CreateExpensePayload,
  Expense,
  ExpenseListItem,
  UpdateExpensePayload,
} from "@/types/Types";

interface UseExpenseDialogsOptions {
  themeGradient: string;
  onCreated?: () => void;
  onEdited?: (expenseId: string) => void;
  onDeleted?: (expenseId: string) => void;
}

export function useExpenseDialogs({
  themeGradient,
  onCreated,
  onEdited,
  onDeleted,
}: UseExpenseDialogsOptions) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editInitialValues, setEditInitialValues] = useState<ExpenseFormValues | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const createMutation = useCreateExpense();
  const updateMutation = useUpdateExpense();
  const deleteMutation = useDeleteExpense();

  const openAdd = useCallback(() => setIsAddOpen(true), []);

  const openEdit = useCallback((expense: ExpenseListItem | Expense) => {
    setEditId(expense._id);
    const listItem = expense as ExpenseListItem;
    const fullItem = expense as Expense;
    const festivalId =
      listItem.festival?._id ||
      (typeof fullItem.festivalId === "object"
        ? fullItem.festivalId?._id
        : fullItem.festivalId) ||
      "";
    setEditInitialValues({
      festivalId,
      description: expense.description || "",
      amount: expense.amount,
      category: expense.category,
      date: expense.date ? expense.date.slice(0, 10) : "",
      vendorName: expense.vendorName || "",
      invoiceNumber: expense.invoiceNumber || "",
      paymentMode: expense.paymentMode || "CASH",
      status: expense.status,
      attachments: expense.attachments || [],
    });
    setIsEditOpen(true);
  }, []);

  const openDelete = useCallback((id: string) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  }, []);

  const closeEdit = useCallback(() => {
    setIsEditOpen(false);
    setEditId(null);
    setEditInitialValues(undefined);
  }, []);

  const closeDelete = useCallback(() => {
    setIsDeleteOpen(false);
    setDeleteId(null);
  }, []);

  const buildCreatePayload = useCallback(
    (values: ExpenseFormValues): CreateExpensePayload => {
      return {
        festivalId: values.festivalId || "",
        description: values.description?.trim() || "",
        amount: values.amount || 0,
        category: values.category || "OTHER",
        date: values.date || new Date().toISOString(),
        vendorName: values.vendorName?.trim() || "",
        invoiceNumber: values.invoiceNumber?.trim() || "",
        paymentMode: values.paymentMode || "CASH",
        status: values.status || "PENDING",
        attachments: values.attachments || [],
      };
    },
    [],
  );

  const buildUpdatePayload = useCallback(
    (values: ExpenseFormValues): UpdateExpensePayload => {
      return {
        description: values.description?.trim() || "",
        amount: values.amount || 0,
        category: values.category,
        date: values.date || new Date().toISOString(),
        vendorName: values.vendorName?.trim() || "",
        invoiceNumber: values.invoiceNumber?.trim() || "",
        paymentMode: values.paymentMode || "CASH",
        attachments: values.attachments || [],
      };
    },
    [],
  );

  const handleAddSubmit = useCallback(
    (values: ExpenseFormValues) => {
      createMutation.mutate(buildCreatePayload(values), {
        onSuccess: () => {
          setIsAddOpen(false);
          onCreated?.();
        },
      });
    },
    [createMutation, buildCreatePayload, onCreated],
  );

  const handleEditSubmit = useCallback(
    (values: ExpenseFormValues) => {
      if (!editId) return;
      updateMutation.mutate(
        { id: editId, payload: buildUpdatePayload(values) },
        {
          onSuccess: () => {
            const id = editId;
            closeEdit();
            onEdited?.(id);
          },
        },
      );
    },
    [editId, updateMutation, buildUpdatePayload, closeEdit, onEdited],
  );

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        const id = deleteId;
        closeDelete();
        onDeleted?.(id);
      },
    });
  }, [deleteId, deleteMutation, closeDelete, onDeleted]);

  const dialogsProps = useMemo(
    () => ({
      isAddOpen,
      isEditOpen,
      isDeleteOpen,
      editInitialValues,
      isPending: createMutation.isPending || updateMutation.isPending,
      isDeleting: deleteMutation.isPending,
      themeGradient,
      onAddClose: () => setIsAddOpen(false),
      onEditClose: closeEdit,
      onDeleteClose: closeDelete,
      onAddSubmit: handleAddSubmit,
      onEditSubmit: handleEditSubmit,
      onDeleteConfirm: handleDeleteConfirm,
    }),
    [
      isAddOpen,
      isEditOpen,
      isDeleteOpen,
      editInitialValues,
      createMutation.isPending,
      updateMutation.isPending,
      deleteMutation.isPending,
      themeGradient,
      closeEdit,
      closeDelete,
      handleAddSubmit,
      handleEditSubmit,
      handleDeleteConfirm,
    ],
  );

  return { openAdd, openEdit, openDelete, dialogsProps };
}
