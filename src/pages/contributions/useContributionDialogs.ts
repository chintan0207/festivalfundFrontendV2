import { useCallback, useMemo, useState } from "react";
import {
  useCreateContribution,
  useUpdateContribution,
  useDeleteContribution,
} from "@/api/contribution/useContributions";
import type { ContributionFormValues } from "./components/dialogs/contributionFormSchema";
import type {
  ContributionListItem,
  CreateContributionPayload,
  UpdateContributionPayload,
} from "@/types/Types";

interface UseContributionDialogsOptions {
  themeGradient: string;
  onCreated?: () => void;
  onEdited?: (contributionId: string) => void;
  onDeleted?: (contributionId: string) => void;
}

export function useContributionDialogs({
  themeGradient,
  onCreated,
  onEdited,
  onDeleted,
}: UseContributionDialogsOptions) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editInitialValues, setEditInitialValues] = useState<ContributionFormValues | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const createMutation = useCreateContribution();
  const updateMutation = useUpdateContribution();
  const deleteMutation = useDeleteContribution();

  const openAdd = useCallback(() => setIsAddOpen(true), []);

  const openEdit = useCallback((contribution: ContributionListItem) => {
    setEditId(contribution._id);
    setEditInitialValues({
      contributorMode: "existing",
      contributorId: contribution.contributor?._id || "",
      festivalId: contribution.festival?._id || "",
      type: contribution.type,
      status: contribution.status,
      date: contribution.date ? contribution.date.slice(0, 10) : "",
      amount: contribution.amount,
      itemName: contribution.itemName || "",
      quantity: contribution.quantity,
      estimatedValue: contribution.estimatedValue,
      paymentMode: contribution.paymentMode || "CASH",
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

  const buildCreatePayload = useCallback((values: ContributionFormValues): CreateContributionPayload => {
    const payload: CreateContributionPayload = {
      festivalId: values.festivalId || "",
      type: values.type,
      status: values.status,
      date: values.date || new Date().toISOString(),
      paymentMode: values.paymentMode || "CASH",
    };

    if (values.contributorMode === "existing") {
      payload.contributorId = values.contributorId;
    } else {
      payload.name = values.name?.trim();
      payload.phoneNumber = values.phoneNumber?.trim() || null;
      payload.email = values.email?.trim() || null;
      payload.address = values.address?.trim() || null;
      payload.category = values.category;
    }

    if (values.type === "MONEY") {
      payload.amount = values.amount;
    } else {
      payload.itemName = values.itemName?.trim();
      payload.quantity = values.quantity;
      payload.estimatedValue = values.estimatedValue;
    }

    return payload;
  }, []);

  const buildUpdatePayload = useCallback((values: ContributionFormValues): UpdateContributionPayload => {
    const payload: UpdateContributionPayload = {
      type: values.type,
      status: values.status,
      date: values.date || new Date().toISOString(),
      paymentMode: values.paymentMode || "CASH",
    };

    if (values.type === "MONEY") {
      payload.amount = values.amount;
    } else {
      payload.itemName = values.itemName?.trim();
      payload.quantity = values.quantity;
      payload.estimatedValue = values.estimatedValue;
    }

    return payload;
  }, []);

  const handleAddSubmit = useCallback(
    (values: ContributionFormValues) => {
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
    (values: ContributionFormValues) => {
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
