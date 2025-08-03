import { Controller, useFormContext } from "react-hook-form";
import { FormLabel } from "../ui/form";
import { Checkbox } from "../ui/checkbox";

export const CheckboxFormInput = ({
  name,
  label,
}: {
  name: string;
  label: string;
}) => {
  const methods = useFormContext();

  return (
    <Controller
      control={methods.control}
      name={name}
      render={({ field }) => (
        <div className="flex items-center gap-3">
          <Checkbox
            {...field}
            onCheckedChange={(checked) => {
              field.onChange(checked);
            }}
          />
          <FormLabel>{label}</FormLabel>
        </div>
      )}
    />
  );
};
