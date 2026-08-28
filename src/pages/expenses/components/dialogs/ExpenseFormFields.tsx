import { AppInput } from "@/components/common/AppInput";
import { AppTextArea } from "@/components/common/AppTextArea";
import { AppSelect, type AppSelectOption } from "@/components/common/AppSelect";
import { CategoryQuickPick } from "../CategoryQuickPick";
import { StatusQuickPick } from "../StatusQuickPick";
import { ExpenseAttachmentsInput } from "./ExpenseAttachmentsInput";
import { expenseCategoryMeta, expensePaymentOptions } from "../../lib/expenseMeta";

export function ExpenseFormFields({
  mode,
  register,
  errors,
  watch,
  setValue,
  prefix,
  festivalOptions,
  hideFestival,
  disabled,
}: {
  mode: "add" | "edit";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  watch: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: any;
  prefix: string;
  festivalOptions: AppSelectOption[];
  /** When true the festival is auto-selected and its field is hidden. */
  hideFestival: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-2.5 sm:gap-4">
      {mode === "add" && !hideFestival && (
        <div className="col-span-1 min-[360px]:col-span-2">
          <AppSelect
            id={`${prefix}-festivalId`}
            label="Festival"
            value={watch("festivalId") || ""}
            onChange={(val) => setValue("festivalId", val, { shouldValidate: true })}
            options={festivalOptions}
            placeholder="Select festival..."
            error={errors.festivalId?.message}
            disabled={disabled}
          />
        </div>
      )}

      {/* Category Quick Pick */}
      <div className="col-span-1 min-[360px]:col-span-2">
        <label
          htmlFor={`${prefix}-category`}
          className="mb-1.5 block text-xs font-semibold text-foreground"
        >
          Category
        </label>
        <CategoryQuickPick
          value={watch("category") || "OTHER"}
          onChange={(val) => setValue("category", val, { shouldValidate: true })}
          options={expenseCategoryMeta.map((c) => ({
            value: c.key,
            label: c.label,
            description: c.description,
            Icon: c.Icon,
            gradient: c.gradient,
          }))}
        />
        {errors.category?.message && (
          <p className="mt-1 text-xs text-destructive">{errors.category.message}</p>
        )}
      </div>

      {/* Status Quick Pick - Creation Mode Only */}
      {mode === "add" && (
        <div className="col-span-1 min-[360px]:col-span-2">
          <label
            htmlFor={`${prefix}-status`}
            className="mb-1.5 block text-xs font-semibold text-foreground"
          >
            Initial Status
          </label>
          <StatusQuickPick
            value={watch("status") || "PENDING"}
            onChange={(val) => setValue("status", val, { shouldValidate: true })}
            disabled={disabled}
          />
          {errors.status?.message && (
            <p className="mt-1 text-xs text-destructive">{errors.status.message}</p>
          )}
        </div>
      )}

      {/* Description / Quick Notes - Both Creation and Edit Modes */}
      <div className="col-span-1 min-[360px]:col-span-2">
        <AppTextArea
          id={`${prefix}-description`}
          label="Description / Notes"
          placeholder="e.g. Stage lighting and sound system for evening cultural event..."
          rows={3}
          {...register("description")}
          error={errors.description?.message}
          disabled={disabled}
        />
      </div>

      <AppInput
        id={`${prefix}-amount`}
        label="Amount (₹)"
        type="number"
        step="1"
        min="0"
        placeholder="e.g. 15000"
        {...register("amount")}
        error={errors.amount?.message}
        disabled={disabled}
      />

      <AppSelect
        id={`${prefix}-paymentMode`}
        label="Payment Mode"
        value={watch("paymentMode") || "CASH"}
        onChange={(val) => setValue("paymentMode", val, { shouldValidate: true })}
        options={expensePaymentOptions}
        error={errors.paymentMode?.message}
        disabled={disabled}
      />

      <div className="col-span-1 min-[360px]:col-span-2">
        <AppInput
          id={`${prefix}-vendorName`}
          label="Paid To (Vendor)"
          placeholder="e.g. Shree Ram Decorators"
          {...register("vendorName")}
          error={errors.vendorName?.message}
          disabled={disabled}
        />
      </div>

      <div className="col-span-1 min-[360px]:col-span-2">
        <ExpenseAttachmentsInput
          value={watch("attachments") || []}
          onChange={(urls) => setValue("attachments", urls, { shouldValidate: true })}
          disabled={disabled}
        />
      </div>

      <AppInput
        id={`${prefix}-date`}
        label="Expense Date"
        type="date"
        {...register("date")}
        error={errors.date?.message}
        disabled={disabled}
      />

      <AppInput
        id={`${prefix}-invoiceNumber`}
        label="Invoice / Voucher No"
        placeholder="e.g. INV-2041"
        {...register("invoiceNumber")}
        error={errors.invoiceNumber?.message}
        disabled={disabled}
      />
    </div>
  );
}
