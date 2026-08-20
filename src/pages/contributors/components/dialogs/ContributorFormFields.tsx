import { AppInput } from "@/components/common/AppInput";
import { AppSelect } from "@/components/common/AppSelect";
import { categoryOptions } from "@/lib/categoryMeta";
import { sanitizePhone } from "@/lib/phone";

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
          placeholder="9876543210"
          inputMode="numeric"
          maxLength={10}
          {...register("phoneNumber", {
            onChange: (e: { target: { value: string } }) => {
              setValue("phoneNumber", sanitizePhone(e.target.value), {
                shouldValidate: true,
              });
            },
          })}
          error={errors.phoneNumber?.message}
        />
        <AppSelect
          id={`${prefix}-category`}
          label="Category"
          value={watch("category")}
          onChange={(val) => setValue("category", val, { shouldValidate: true })}
          options={categoryOptions}
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
