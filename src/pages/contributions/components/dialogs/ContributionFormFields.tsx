import { AppInput } from "@/components/common/AppInput";
import { AppSelect, type AppSelectOption } from "@/components/common/AppSelect";
import { ContributorSearchPicker } from "@/components/common/ContributorSearchPicker";
import {
  contributionCategoryOptions,
  contributionPaymentOptions,
  contributionStatusCreateOptions,
  contributionStatusLabel,
  contributionTypeOptions,
} from "../../lib/contributionMeta";

export function ContributionFormFields({
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
  const contributorMode = watch("contributorMode") || "existing";
  const type = watch("type") || "MONEY";

  return (
    <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-2.5 sm:gap-4">
      {mode === "add" && (
        <>
          <div className="col-span-1 min-[360px]:col-span-2">
            <ContributorSearchPicker
              mode={contributorMode}
              value={watch("contributorId") || ""}
              onChange={(val) => setValue("contributorId", val, { shouldValidate: true })}
              onChangeMode={(val) => setValue("contributorMode", val, { shouldValidate: true })}
              label="Contributor"
              error={errors.contributorId?.message}
            />
          </div>

          {contributorMode === "new" && (
            <>
              <div className="col-span-1 min-[360px]:col-span-2">
                <AppInput
                  id={`${prefix}-name`}
                  label="Full Name"
                  placeholder="e.g. Ramesh Sharma"
                  {...register("name")}
                  error={errors.name?.message}
                />
              </div>
              <AppSelect
                id={`${prefix}-category`}
                label="Category"
                value={watch("category") || "PARENT"}
                onChange={(val) => setValue("category", val, { shouldValidate: true })}
                options={contributionCategoryOptions}
                error={errors.category?.message}
              />
              <AppInput
                id={`${prefix}-phone`}
                label="Phone Number"
                placeholder="9876543210"
                inputMode="numeric"
                maxLength={10}
                {...register("phoneNumber", {
                  onChange: (e: { target: { value: string } }) => {
                    const onlyDigits = e.target.value.replace(/[^\d]/g, "").slice(0, 10);
                    setValue("phoneNumber", onlyDigits, { shouldValidate: true });
                  },
                })}
                error={errors.phoneNumber?.message}
              />
              <div className="col-span-1 min-[360px]:col-span-2">
                <AppInput
                  id={`${prefix}-email`}
                  label="Email Address"
                  type="email"
                  placeholder="donor@example.com"
                  {...register("email")}
                  error={errors.email?.message}
                />
              </div>
              <div className="col-span-1 min-[360px]:col-span-2">
                <AppInput
                  id={`${prefix}-address`}
                  label="Address"
                  placeholder="e.g. 12, Navrangpura, Ahmedabad"
                  {...register("address")}
                  error={errors.address?.message}
                />
              </div>
            </>
          )}

          {!hideFestival && (
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
        </>
      )}

      <AppSelect
        id={`${prefix}-type`}
        label="Contribution Type"
        value={type}
        onChange={(val) => setValue("type", val, { shouldValidate: true })}
        options={contributionTypeOptions}
        error={errors.type?.message}
      />
      {mode === "add" ? (
        <AppSelect
          id={`${prefix}-status`}
          label="Status"
          value={watch("status") || "PENDING"}
          onChange={(val) => setValue("status", val, { shouldValidate: true })}
          options={contributionStatusCreateOptions}
          error={errors.status?.message}
        />
      ) : (
        <div className="col-span-1 min-[360px]:col-span-2 rounded-xl border border-border/60 bg-muted/40 px-3 py-2.5">
          <span className="block text-[11px] font-semibold text-muted-foreground">Status</span>
          <span className="block text-sm font-bold text-foreground mt-0.5">
            {contributionStatusLabel(watch("status"))}
          </span>
          <span className="block text-[11px] text-muted-foreground mt-0.5">
            Status changes use the status menu, not this form.
          </span>
        </div>
      )}

      <div className="col-span-1 min-[360px]:col-span-2">
        <AppInput
          id={`${prefix}-date`}
          label="Contribution Date"
          type="date"
          {...register("date")}
          error={errors.date?.message}
        />
      </div>

      {type === "MONEY" ? (
        <>
          <AppInput
            id={`${prefix}-amount`}
            label="Amount (₹)"
            type="number"
            step="1"
            min="0"
            placeholder="e.g. 5000"
            {...register("amount")}
            error={errors.amount?.message}
          />
          <AppSelect
            id={`${prefix}-paymentMode`}
            label="Payment Mode"
            value={watch("paymentMode") || "CASH"}
            onChange={(val) => setValue("paymentMode", val, { shouldValidate: true })}
            options={contributionPaymentOptions}
            error={errors.paymentMode?.message}
          />
        </>
      ) : (
        <>
          <div className="col-span-1 min-[360px]:col-span-2">
            <AppInput
              id={`${prefix}-itemName`}
              label="Item Name"
              placeholder="e.g. Colors & Pichkari set"
              {...register("itemName")}
              error={errors.itemName?.message}
            />
          </div>
          <AppInput
            id={`${prefix}-quantity`}
            label="Quantity"
            type="number"
            step="1"
            min="1"
            placeholder="e.g. 2"
            {...register("quantity")}
            error={errors.quantity?.message}
          />
          <AppInput
            id={`${prefix}-estimatedValue`}
            label="Estimated Value (₹)"
            type="number"
            step="1"
            min="0"
            placeholder="e.g. 1500"
            {...register("estimatedValue")}
            error={errors.estimatedValue?.message}
          />
        </>
      )}
    </div>
  );
}
