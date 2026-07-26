/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Sparkles, Calendar, MapPin, Tag, DollarSign, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppButton } from "@/components/common/AppButton";

const festivalSchema = z.object({
  name: z.string().min(2, "Festival title must be at least 2 characters"),
  year: z.number().min(2000, "Year must be 2000 or later").max(2100, "Invalid year"),
  targetAmount: z.number().min(0, "Target budget must be positive"),
  status: z.enum(["ACTIVE", "UPCOMING", "COMPLETED", "ARCHIVED"]),
  category: z.string().min(1, "Category is required"),
  location: z.string().optional(),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type FestivalFormValues = z.infer<typeof festivalSchema>;

export interface FestivalFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: FestivalFormValues) => void;
  initialValues?: Partial<FestivalFormValues> | null;
  isPending?: boolean;
}

export function FestivalFormModal({
  isOpen,
  onOpenChange,
  onSubmit,
  initialValues,
  isPending = false,
}: FestivalFormModalProps) {
  const isEditing = Boolean(initialValues && (initialValues as any).id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FestivalFormValues>({
    resolver: zodResolver(festivalSchema) as any,
    defaultValues: {
      name: "",
      year: new Date().getFullYear(),
      targetAmount: 500000,
      status: "ACTIVE",
      category: "Religious & Cultural",
      location: "Community Grounds",
      description: "",
      startDate: "2026-09-07",
      endDate: "2026-09-17",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialValues) {
        reset({
          name: initialValues.name || "",
          year: initialValues.year || new Date().getFullYear(),
          targetAmount: initialValues.targetAmount || 500000,
          status: (initialValues.status as any) || "ACTIVE",
          category: initialValues.category || "Religious & Cultural",
          location: initialValues.location || "Community Grounds",
          description: initialValues.description || "",
          startDate: initialValues.startDate
            ? initialValues.startDate.split("T")[0]
            : "2026-09-07",
          endDate: initialValues.endDate
            ? initialValues.endDate.split("T")[0]
            : "2026-09-17",
        });
      } else {
        reset({
          name: "",
          year: new Date().getFullYear(),
          targetAmount: 500000,
          status: "ACTIVE",
          category: "Religious & Cultural",
          location: "Community Grounds",
          description: "",
          startDate: "2026-09-07",
          endDate: "2026-09-17",
        });
      }
    }
  }, [isOpen, initialValues, reset]);

  const handleFormSubmit = (data: FestivalFormValues) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl p-6">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>{isEditing ? "Edit Festival" : "Create New Festival"}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Configure target budget, timeline dates, category, and status for your festival.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4 text-xs">
            {/* Festival Name */}
            <div className="grid gap-1.5">
              <Label htmlFor="name" className="font-semibold text-foreground flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Festival Title</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g. Ganesh Chaturthi 2026"
                {...register("name")}
                className="h-9 text-xs"
              />
              {errors.name && (
                <p className="text-[11px] text-rose-500 font-medium">{errors.name.message}</p>
              )}
            </div>

            {/* Year & Target Budget */}
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="year" className="font-semibold text-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Event Year</span>
                </Label>
                <Input
                  id="year"
                  type="number"
                  {...register("year", { valueAsNumber: true })}
                  className="h-9 text-xs"
                />
                {errors.year && (
                  <p className="text-[11px] text-rose-500 font-medium">{errors.year.message}</p>
                )}
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="targetAmount" className="font-semibold text-foreground flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Target Budget (₹)</span>
                </Label>
                <Input
                  id="targetAmount"
                  type="number"
                  {...register("targetAmount", { valueAsNumber: true })}
                  className="h-9 text-xs"
                />
                {errors.targetAmount && (
                  <p className="text-[11px] text-rose-500 font-medium">{errors.targetAmount.message}</p>
                )}
              </div>
            </div>

            {/* Status & Category */}
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="status" className="font-semibold text-foreground">Status</Label>
                <select
                  id="status"
                  {...register("status")}
                  className="h-9 px-3 rounded-md border border-input bg-background text-xs font-medium text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="UPCOMING">UPCOMING</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
                {errors.status && (
                  <p className="text-[11px] text-rose-500 font-medium">{errors.status.message}</p>
                )}
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="category" className="font-semibold text-foreground">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g. Religious & Cultural"
                  {...register("category")}
                  className="h-9 text-xs"
                />
                {errors.category && (
                  <p className="text-[11px] text-rose-500 font-medium">{errors.category.message}</p>
                )}
              </div>
            </div>

            {/* Start & End Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="startDate" className="font-semibold text-foreground">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  {...register("startDate")}
                  className="h-9 text-xs"
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="endDate" className="font-semibold text-foreground">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  {...register("endDate")}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            {/* Location / Venue */}
            <div className="grid gap-1.5">
              <Label htmlFor="location" className="font-semibold text-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Location / Venue</span>
              </Label>
              <Input
                id="location"
                placeholder="e.g. Community Grounds, Sector 4"
                {...register("location")}
                className="h-9 text-xs"
              />
            </div>

            {/* Description */}
            <div className="grid gap-1.5">
              <Label htmlFor="description" className="font-semibold text-foreground flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Description</span>
              </Label>
              <Input
                id="description"
                placeholder="Short description of festival celebration..."
                {...register("description")}
                className="h-9 text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border/40">
            <AppButton
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </AppButton>
            <AppButton type="submit" disabled={isPending}>
              {isPending
                ? "Saving..."
                : isEditing
                  ? "Update Festival"
                  : "Save Festival"}
            </AppButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
