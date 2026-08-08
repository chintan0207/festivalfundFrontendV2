import { useCallback, useMemo, useState } from "react";
import {
  useCreateContributor,
  useUpdateContributor,
  useSoftDeleteContributor,
} from "@/api/contributor/useContributors";
import type { ContributorFormValues } from "./components/dialogs/contributorFormSchema";
import type { Contributor } from "@/types/Types";

/**
 * Builds a clean backend payload: empty strings become null and strings are
 * trimmed so the API treats them as "not provided" instead of invalid format.
 */
const buildPayload = (values: ContributorFormValues) => ({
  name: values.name.trim(),
  phoneNumber: values.phoneNumber?.trim() || null,
  email: values.email?.trim() || null,
  address: values.address?.trim() || null,
  category: values.category,
});

interface UseContributorDialogsOptions {
  themeGradient: string;
  onCreated?: () => void;
  onEdited?: (contributorId: string) => void;
  onDeleted?: (contributorId: string) => void;
}

export function useContributorDialogs({
  themeGradient,
  onCreated,
  onEdited,
  onDeleted,
}: UseContributorDialogsOptions) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editInitialValues, setEditInitialValues] = useState<ContributorFormValues | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const createMutation = useCreateContributor();
  const updateMutation = useUpdateContributor();
  const deleteMutation = useSoftDeleteContributor();

  const openAdd = useCallback(() => setIsAddOpen(true), []);

  const openEdit = useCallback((contributor: Contributor) => {
    setEditId(contributor._id);
    setEditInitialValues({
      name: contributor.name,
      phoneNumber: contributor.phoneNumber || "",
      email: contributor.email || "",
      address: contributor.address || "",
      category: contributor.category,
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

  const handleAddSubmit = useCallback(
    (values: ContributorFormValues) => {
      createMutation.mutate(buildPayload(values), {
        onSuccess: () => {
          setIsAddOpen(false);
          onCreated?.();
        },
      });
    },
    [createMutation, onCreated],
  );

  const handleEditSubmit = useCallback(
    (values: ContributorFormValues) => {
      if (!editId) return;
      updateMutation.mutate(
        { contributorId: editId, payload: buildPayload(values) },
        {
          onSuccess: () => {
            const id = editId;
            closeEdit();
            onEdited?.(id);
          },
        },
      );
    },
    [editId, updateMutation, closeEdit, onEdited],
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
