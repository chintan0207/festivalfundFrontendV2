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

export interface ContributorFormData {
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  category: string;
}

interface ContributorDialogsProps {
  isAddOpen: boolean;
  isEditOpen: boolean;
  isDeleteOpen: boolean;
  form: ContributorFormData;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  themeGradient: string;
  onAddClose: () => void;
  onEditClose: () => void;
  onDeleteClose: () => void;
  onFormChange: (field: string, value: string) => void;
  onCreate: () => void;
  onUpdate: () => void;
  onDeleteConfirm: () => void;
}

export function ContributorDialogs({
  isAddOpen,
  isEditOpen,
  isDeleteOpen,
  form,
  isCreating,
  isUpdating,
  isDeleting,
  themeGradient,
  onAddClose,
  onEditClose,
  onDeleteClose,
  onFormChange,
  onCreate,
  onUpdate,
  onDeleteConfirm,
}: ContributorDialogsProps) {
  return (
    <>
      {/* Add Contributor Dialog */}
      <Dialog open={isAddOpen} onOpenChange={onAddClose}>
        <DialogContent className="sm:max-w-md rounded-2xl">
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
            <ContributorFormFields form={form} onChange={onFormChange} prefix="add" />
          </div>

          <DialogFooter>
            <AppButton variant="outline" onClick={onAddClose}>
              Cancel
            </AppButton>
            <AppButton onClick={onCreate} loading={isCreating} className={themeGradient}>
              Save Contributor
            </AppButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Contributor Dialog */}
      <Dialog open={isEditOpen} onOpenChange={onEditClose}>
        <DialogContent className="sm:max-w-md rounded-2xl">
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
            <ContributorFormFields form={form} onChange={onFormChange} prefix="edit" />
          </div>

          <DialogFooter>
            <AppButton variant="outline" onClick={onEditClose}>
              Cancel
            </AppButton>
            <AppButton onClick={onUpdate} loading={isUpdating} className={themeGradient}>
              Update Contributor
            </AppButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
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

function ContributorFormFields({
  form,
  onChange,
  prefix,
}: {
  form: ContributorFormData;
  onChange: (field: string, value: string) => void;
  prefix: string;
}) {
  return (
    <>
      <AppInput
        id={`${prefix}-name`}
        label="Full Name"
        placeholder="e.g. Ramesh Sharma"
        value={form.name}
        onChange={(e) => onChange("name", e.target.value)}
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <AppInput
          id={`${prefix}-phone`}
          label="Phone Number"
          placeholder="+91 98765 43210"
          value={form.phoneNumber}
          onChange={(e) => onChange("phoneNumber", e.target.value)}
        />
        <AppSelect
          id={`${prefix}-category`}
          label="Category"
          value={form.category}
          onChange={(val) => onChange("category", val)}
          options={[
            { value: "PARENT", label: "Parents" },
            { value: "BOY", label: "Boys" },
            { value: "GIRL", label: "Girls" },
          ]}
        />
      </div>

      <AppInput
        id={`${prefix}-email`}
        label="Email Address"
        type="email"
        placeholder="donor@example.com"
        value={form.email}
        onChange={(e) => onChange("email", e.target.value)}
      />

      <AppInput
        id={`${prefix}-address`}
        label="Address"
        placeholder="e.g. 12, Navrangpura, Ahmedabad"
        value={form.address}
        onChange={(e) => onChange("address", e.target.value)}
      />
    </>
  );
}
