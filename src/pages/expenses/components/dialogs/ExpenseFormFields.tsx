import { AppInput } from "@/components/common/AppInput";
import { AppSelect, type AppSelectOption } from "@/components/common/AppSelect";
import { CategoryQuickPick } from "../CategoryQuickPick";
import {
  expenseCategoryMeta,
  expensePaymentOptions,
  expenseStatusCreateOptions,
  expenseStatusLabel,
} from "../../lib/expenseMeta";

export function ExpenseFormFields({
  mode,
  register,
  errors,
  watch,
  setValue,
  prefix,
  festivalOptions,
  hideFestival,
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
          />
        </div>
      )}

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

      <AppInput
        id={`${prefix}-amount`}
        label="Amount (₹)"
        type="number"
        step="1"
        min="0"
        placeholder="e.g. 15000"
        {...register("amount")}
        error={errors.amount?.message}
      />

      <AppSelect
        id={`${prefix}-paymentMode`}
        label="Payment Mode"
        value={watch("paymentMode") || "CASH"}
        onChange={(val) => setValue("paymentMode", val, { shouldValidate: true })}
        options={expensePaymentOptions}
        error={errors.paymentMode?.message}
      />

      {mode === "add" ? (
        <div className="col-span-1 min-[360px]:col-span-2">
          <AppSelect
            id={`${prefix}-status`}
            label="Status"
            value={watch("status") || "PENDING"}
            onChange={(val) => setValue("status", val, { shouldValidate: true })}
            options={expenseStatusCreateOptions}
            error={errors.status?.message}
          />
        </div>
      ) : (
        <div className="col-span-1 min-[360px]:col-span-2 rounded-xl border border-border/60 bg-muted/40 px-3 py-2.5">
          <span className="block text-[11px] font-semibold text-muted-foreground">
            Status
          </span>
          <span className="block text-sm font-bold text-foreground mt-0.5">
            {expenseStatusLabel(watch("status"))}
          </span>
          <span className="block text-[11px] text-muted-foreground mt-0.5">
            Status changes use the status menu, not this form.
          </span>
        </div>
      )}

      <div className="col-span-1 min-[360px]:col-span-2">
        <AppInput
          id={`${prefix}-vendorName`}
          label="Paid To (Vendor)"
          placeholder="e.g. Shree Ram Decorators"
          {...register("vendorName")}
          error={errors.vendorName?.message}
        />
      </div>

      <AppInput
        id={`${prefix}-date`}
        label="Expense Date"
        type="date"
        {...register("date")}
        error={errors.date?.message}
      />

      <AppInput
        id={`${prefix}-invoiceNumber`}
        label="Invoice / Voucher No"
        placeholder="e.g. INV-2041"
        {...register("invoiceNumber")}
        error={errors.invoiceNumber?.message}
      />
    </div>
  );
}
