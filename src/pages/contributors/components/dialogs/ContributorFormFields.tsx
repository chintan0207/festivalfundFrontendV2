import { AppInput } from "@/components/common/AppInput";
import { AppSelect } from "@/components/common/AppSelect";
import { contributorCategoryOptions } from "../../lib/contributorMeta";

export function ContributorFormFields({
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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
          options={contributorCategoryOptions}
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
