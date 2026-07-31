import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Users, Pencil } from "lucide-react";
import { AppInput } from "@/components/common/AppInput";
import { AppButton } from "@/components/common/AppButton";
import { AppSelect } from "@/components/common/AppSelect";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const contributorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().optional(),
  category: z.enum(["PARENT", "BOY", "GIRL"]),
});

export type ContributorFormValues = z.infer<typeof contributorSchema>;

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
      <AddContributorDialog
        isOpen={isAddOpen}
        isPending={isPending}
        themeGradient={themeGradient}
        onClose={onAddClose}
        onSubmit={onAddSubmit}
      />

      <EditContributorDialog
        isOpen={isEditOpen}
        initialValues={editInitialValues}
        isPending={isPending}
        themeGradient={themeGradient}
        onClose={onEditClose}
        onSubmit={onEditSubmit}
      />

      <Dialog open={isDeleteOpen} onOpenChange={onDeleteClose}>
        <DialogContent className="sm:max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>Delete Contributor</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this contributor? This action can be undone by an
              administrator.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <AppButton variant="outline" onClick={onDeleteClose}>
              Cancel
            </AppButton>
            <AppButton
              onClick={onDeleteConfirm}
              loading={isDeleting}
              className="bg-rose-600 hover:bg-rose-700 text-white border-0"
            >
              Delete
            </AppButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function AddContributorDialog({
  isOpen,
  isPending,
  themeGradient,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  isPending: boolean;
  themeGradient: string;
  onClose: () => void;
  onSubmit: (values: ContributorFormValues) => void;
}) {
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
    if (isOpen) {
      reset({
        name: "",
        phoneNumber: "",
        email: "",
        address: "",
        category: "PARENT",
      });
    }
  }, [isOpen, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <Users className="h-5 w-5 text-green-500" />
              Add New Contributor
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Register a new donor into the system.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4 text-xs">
            <ContributorFormFields
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
              prefix="add"
            />
          </div>

          <DialogFooter>
            <AppButton variant="outline" type="button" onClick={onClose}>
              Cancel
            </AppButton>
            <AppButton type="submit" loading={isPending} className={themeGradient}>
              Save Contributor
            </AppButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditContributorDialog({
  isOpen,
  initialValues,
  isPending,
  themeGradient,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  initialValues?: ContributorFormValues;
  isPending: boolean;
  themeGradient: string;
  onClose: () => void;
  onSubmit: (values: ContributorFormValues) => void;
}) {
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
    if (isOpen && initialValues) {
      reset(initialValues);
    }
  }, [isOpen, initialValues, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <Pencil className="h-5 w-5 text-indigo-500" />
              Edit Contributor
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Update donor details.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4 text-xs">
            <ContributorFormFields
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
              prefix="edit"
            />
          </div>

          <DialogFooter>
            <AppButton variant="outline" type="button" onClick={onClose}>
              Cancel
            </AppButton>
            <AppButton type="submit" loading={isPending} className={themeGradient}>
              Update Contributor
            </AppButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ContributorFormFields({
  register,
  errors,
  watch,
  setValue,
  prefix,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  watch: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: any;
  prefix: string;
}) {
  return (
    <>
      <AppInput
        id={`${prefix}-name`}
        label="Full Name"
        placeholder="e.g. Ramesh Sharma"
        {...register("name")}
        error={errors.name?.message}
      />

      <div className="grid grid-cols-2 gap-3">
        <AppInput
          id={`${prefix}-phone`}
          label="Phone Number"
          placeholder="+91 98765 43210"
          {...register("phoneNumber")}
          error={errors.phoneNumber?.message}
        />
        <AppSelect
          id={`${prefix}-category`}
          label="Category"
          value={watch("category")}
          onChange={(val) => setValue("category", val, { shouldValidate: true })}
          options={[
            { value: "PARENT", label: "Parents" },
            { value: "BOY", label: "Boys" },
            { value: "GIRL", label: "Girls" },
          ]}
          error={errors.category?.message}
        />
      </div>

      <AppInput
        id={`${prefix}-email`}
        label="Email Address"
        type="email"
        placeholder="donor@example.com"
        {...register("email")}
        error={errors.email?.message}
      />

      <AppInput
        id={`${prefix}-address`}
        label="Address"
        placeholder="e.g. 12, Navrangpura, Ahmedabad"
        {...register("address")}
        error={errors.address?.message}
      />
    </>
  );
}
