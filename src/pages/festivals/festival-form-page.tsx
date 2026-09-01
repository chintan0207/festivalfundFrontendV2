/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "@tanstack/react-router";
import { Calendar, DollarSign, MapPin, Tag, Wallet } from "lucide-react";
import {
  useFestival,
  useCreateFestival,
  useUpdateFestival,
} from "@/api/festival/useFestivals";
import { getModuleTheme } from "@/theme/colors";
import { PageContainer } from "@/components/common/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { AppButton } from "@/components/common/AppButton";
import { AppInput } from "@/components/common/AppInput";
import { AppSelect } from "@/components/common/AppSelect";
import { AppTextArea } from "@/components/common/AppTextArea";
import { BannerUploader } from "@/components/common/BannerUploader";
import { DetailPageSkeleton } from "@/components/common/DetailPageSkeleton";
import { festivalStatusOptions, festivalCategoryOptions } from "./lib/festivalMeta";
import type { FestivalStatus } from "@/types/Types";

const festivalFormSchema = z
  .object({
    name: z
      .string()
      .min(2, "Festival title must be at least 2 characters")
      .max(100, "Festival title must be under 100 characters"),
    year: z
      .number()
      .min(1900, "Year must be 1900 or later")
      .max(2100, "Invalid year")
      .optional()
      .or(z.nan()),
    targetAmount: z.number().min(0, "Target budget must be positive").optional().or(z.nan()),
    openingBalance: z.number().min(0, "Opening balance must be positive").optional().or(z.nan()),
    status: z.enum(["UPCOMING", "ACTIVE", "COMPLETED", "ARCHIVED"]).optional(),
    category: z.string().max(100, "Category must be under 100 characters").optional(),
    location: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    description: z
      .string()
      .max(1000, "Description must be under 1000 characters")
      .optional(),
    bannerUrl: z.string().optional(),
  })
  .refine((d) => !d.startDate || !d.endDate || d.endDate >= d.startDate, {
    message: "End date must be on or after the start date",
    path: ["endDate"],
  });

export type FestivalFormValues = z.infer<typeof festivalFormSchema>;

const emptyValues = (): FestivalFormValues => ({
  name: "",
  year: new Date().getFullYear(),
  targetAmount: undefined,
  openingBalance: undefined,
  status: "ACTIVE",
  category: "",
  location: "",
  startDate: "",
  endDate: "",
  description: "",
  bannerUrl: "",
});

export interface FestivalFormPageProps {
  /** Present in edit mode; absent for create. */
  festivalId?: string;
}

export function FestivalFormPage({ festivalId }: FestivalFormPageProps) {
  const isEditing = Boolean(festivalId);
  const router = useRouter();
  const theme = getModuleTheme("festivals");

  const { data: festival, isLoading } = useFestival(festivalId ?? "");

  const createMutation = useCreateFestival();
  const updateMutation = useUpdateFestival();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FestivalFormValues>({
    resolver: zodResolver(festivalFormSchema) as any,
    defaultValues: emptyValues(),
  });

  useEffect(() => {
    if (!isEditing) {
      reset(emptyValues());
      return;
    }
    if (festival) {
      reset({
        name: festival.name ?? "",
        year: festival.year ?? new Date().getFullYear(),
        targetAmount: festival.targetAmount ?? undefined,
        openingBalance: festival.stats?.openingBalance ?? undefined,
        status: festival.status || "UPCOMING",
        category: festival.category || "",
        location: festival.location || "",
        startDate: festival.startDate ? String(festival.startDate).split("T")[0] : "",
        endDate: festival.endDate ? String(festival.endDate).split("T")[0] : "",
        description: festival.description || "",
        bannerUrl: festival.bannerUrl || "",
      });
    }
  }, [isEditing, festival, reset]);

  const onSubmit = (values: FestivalFormValues) => {
    const yearValue =
      typeof values.year === "number" && !Number.isNaN(values.year)
        ? Number(values.year)
        : undefined;

    const payload = {
      name: values.name,
      year: yearValue,
      targetAmount:
        typeof values.targetAmount === "number" && !Number.isNaN(values.targetAmount)
          ? Number(values.targetAmount)
          : undefined,
      status: values.status || "ACTIVE",
      category: values.category || undefined,
      location: values.location || undefined,
      description: values.description || undefined,
      startDate: values.startDate || undefined,
      endDate: values.endDate || undefined,
      bannerUrl: values.bannerUrl || undefined,
    };

    if (isEditing && festivalId) {
      updateMutation.mutate(
        { festivalId, payload },
        {
          onSuccess: () => {
            router.navigate({
              to: "/dashboard/festivals/$festivalId",
              params: { festivalId },
            });
          },
        },
      );
    } else {
      createMutation.mutate(
        {
          ...payload,
          openingBalance:
            typeof values.openingBalance === "number" &&
            !Number.isNaN(values.openingBalance)
              ? Number(values.openingBalance)
              : undefined,
        },
        {
          onSuccess: (res) => {
            const id = res?.data?._id;
            if (id) {
              router.navigate({
                to: "/dashboard/festivals/$festivalId",
                params: { festivalId: id },
              });
            } else {
              router.navigate({ to: "/dashboard/festivals" });
            }
          },
        },
      );
    }
  };

  if (isEditing && isLoading) {
    return (
      <PageContainer variant="detail">
        <DetailPageSkeleton />
      </PageContainer>
    );
  }

  if (isEditing && !festival) {
    return (
      <PageContainer variant="detail">
        <PageHeader
          title="Festival not found"
          module="festivals"
          breadcrumbs={[{ label: "Home", to: "/dashboard" }, { label: "Festivals", to: "/dashboard/festivals" }]}
          actions={
            <AppButton variant="outline" onClick={() => router.history.back()}>
              Go Back
            </AppButton>
          }
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer variant="detail">
      <PageHeader
        title={isEditing ? "Edit Festival" : "Create Festival"}
        module="festivals"
        description={
          isEditing
            ? "Update the festival details. Opening balance is managed at creation."
            : "Set up a new festival with budget, timeline, and venue details."
        }
        breadcrumbs={
          isEditing
            ? [
                { label: "Home", to: "/dashboard" },
                { label: "Festivals", to: "/dashboard/festivals" },
                ...(festival ? [{ label: festival.name }] : []),
                { label: "Edit Festival" },
              ]
            : [
                { label: "Home", to: "/dashboard" },
                { label: "Festivals", to: "/dashboard/festivals" },
                { label: "Create Festival" },
              ]
        }
      />

      <div className="rounded-2xl bg-card border border-border/80 p-4 sm:p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
          {/* Festival Name */}
          <AppInput
            id="name"
            label="Festival Title *"
            placeholder="e.g. Ganesh Chaturthi"
            leftIcon={<Tag className="h-3.5 w-3.5 text-muted-foreground" />}
            error={errors.name?.message}
            {...register("name")}
          />

          {/* Year & Target & Opening Balance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AppInput
              id="year"
              label="Event Year"
              placeholder={`e.g. ${new Date().getFullYear()}`}
              hint="Optional. Defaults to current year if omitted."
              type="number"
              leftIcon={<Calendar className="h-3.5 w-3.5 text-muted-foreground" />}
              error={errors.year?.message}
              {...register("year", { valueAsNumber: true })}
            />

            <AppInput
              id="targetAmount"
              label="Target Budget (₹)"
              type="number"
              leftIcon={<DollarSign className="h-3.5 w-3.5 text-muted-foreground" />}
              error={errors.targetAmount?.message}
              {...register("targetAmount", { valueAsNumber: true })}
            />
          </div>

          {!isEditing && (
            <AppInput
              id="openingBalance"
              label="Opening Balance (₹)"
              hint="Initial balance carried into the festival. Gets locked after creation."
              type="number"
              leftIcon={<Wallet className="h-3.5 w-3.5 text-muted-foreground" />}
              error={errors.openingBalance?.message}
              {...register("openingBalance", { valueAsNumber: true })}
            />
          )}

          {/* Status & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AppSelect
              id="status"
              label="Status"
              // eslint-disable-next-line react-hooks/incompatible-library
              value={watch("status")}
              onChange={(val) => setValue("status", val as FestivalStatus, { shouldValidate: true })}
              options={festivalStatusOptions}
              error={errors.status?.message}
            />

            <AppSelect
              id="category"
              label="Category"
              value={watch("category")}
              onChange={(val) => setValue("category", val, { shouldValidate: true })}
              options={festivalCategoryOptions}
              error={errors.category?.message}
            />
          </div>

          {/* Start & End Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AppInput
              id="startDate"
              label="Start Date"
              type="date"
              error={errors.startDate?.message}
              {...register("startDate")}
            />

            <AppInput
              id="endDate"
              label="End Date"
              type="date"
              error={errors.endDate?.message}
              {...register("endDate")}
            />
          </div>

          {/* Location */}
          <AppInput
            id="location"
            label="Location / Venue"
            placeholder="e.g. Community Grounds, Sector 4"
            leftIcon={<MapPin className="h-3.5 w-3.5 text-muted-foreground" />}
            error={errors.location?.message}
            {...register("location")}
          />

          {/* Banner */}
          <BannerUploader
            label="Banner Image"
            hint="Optional image displayed on the festival detail page."
            value={watch("bannerUrl")}
            onChange={(url) => setValue("bannerUrl", url || "", { shouldValidate: true })}
            error={errors.bannerUrl?.message}
          />

          {/* Description */}
          <AppTextArea
            id="description"
            label="Description"
            placeholder="Short description of festival celebration and events..."
            rows={4}
            error={errors.description?.message}
            {...register("description")}
          />

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2 border-t border-border/40">
            <AppButton
              type="button"
              variant="outline"
              onClick={() => router.history.back()}
              disabled={isPending}
            >
              Cancel
            </AppButton>
            <AppButton type="submit" gradient={theme.gradient} loading={isPending}>
              {isPending ? "Saving..." : isEditing ? "Update Festival" : "Create Festival"}
            </AppButton>
          </div>
        </form>
      </div>
    </PageContainer>
  );
}

export default FestivalFormPage;