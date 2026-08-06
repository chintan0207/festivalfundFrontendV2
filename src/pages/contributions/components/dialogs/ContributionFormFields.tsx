import { AppInput } from "@/components/common/AppInput";
import { AppSelect, type AppSelectOption } from "@/components/common/AppSelect";
import {
  contributionCategoryOptions,
  contributionPaymentOptions,
  contributionStatusOptions,
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
  contributorOptions,
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
  contributorOptions: AppSelectOption[];
}) {
  const contributorMode = watch("contributorMode") || "existing";
  const type = watch("type") || "MONEY";

  return (
    <>
      {mode === "add" && (
        <>
          <AppSelect
            id={`${prefix}-contributorMode`}
            label="Contributor"
            value={contributorMode}
            onChange={(val) => setValue("contributorMode", val, { shouldValidate: true })}
            options={[
              { value: "existing", label: "Select existing contributor" },
              { value: "new", label: "Add new contributor" },
            ]}
          />

          {contributorMode === "existing" ? (
            <AppSelect
              id={`${prefix}-contributorId`}
              label="Contributor"
              value={watch("contributorId") || ""}
              onChange={(val) => setValue("contributorId", val, { shouldValidate: true })}
              options={contributorOptions}
              placeholder="Search and select..."
              error={errors.contributorId?.message}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <AppInput
                  id={`${prefix}-name`}
                  label="Full Name"
                  placeholder="e.g. Ramesh Sharma"
                  {...register("name")}
                  error={errors.name?.message}
                />
                <AppSelect
                  id={`${prefix}-category`}
                  label="Category"
                  value={watch("category") || "PARENT"}
                  onChange={(val) => setValue("category", val, { shouldValidate: true })}
                  options={contributionCategoryOptions}
                  error={errors.category?.message}
                />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <AppInput
                  id={`${prefix}-phone`}
                  label="Phone Number"
                  placeholder="+91 98765 43210"
                  {...register("phoneNumber")}
                  error={errors.phoneNumber?.message}
                />
                <AppInput
                  id={`${prefix}-email`}
                  label="Email Address"
                  type="email"
                  placeholder="donor@example.com"
                  {...register("email")}
                  error={errors.email?.message}
                />
              </div>
              <AppInput
                id={`${prefix}-address`}
                label="Address"
                placeholder="e.g. 12, Navrangpura, Ahmedabad"
                {...register("address")}
                error={errors.address?.message}
              />
            </>
          )}

          <AppSelect
            id={`${prefix}-festivalId`}
            label="Festival"
            value={watch("festivalId") || ""}
            onChange={(val) => setValue("festivalId", val, { shouldValidate: true })}
            options={festivalOptions}
            placeholder="Select festival..."
            error={errors.festivalId?.message}
          />
        </>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <AppSelect
          id={`${prefix}-type`}
          label="Contribution Type"
          value={type}
          onChange={(val) => setValue("type", val, { shouldValidate: true })}
          options={contributionTypeOptions}
          error={errors.type?.message}
        />
        <AppSelect
          id={`${prefix}-status`}
          label="Status"
          value={watch("status") || "PENDING"}
          onChange={(val) => setValue("status", val, { shouldValidate: true })}
          options={contributionStatusOptions}
          error={errors.status?.message}
        />
      </div>

      <AppInput
        id={`${prefix}-date`}
        label="Contribution Date"
        type="date"
        {...register("date")}
        error={errors.date?.message}
      />

      {type === "MONEY" ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
        </div>
      ) : (
        <>
          <AppInput
            id={`${prefix}-itemName`}
            label="Item Name"
            placeholder="e.g. Colors & Pichkari set"
            {...register("itemName")}
            error={errors.itemName?.message}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
          </div>
        </>
      )}
    </>
  );
}
