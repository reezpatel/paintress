import { Controller, useFormContext } from "react-hook-form";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const TextFormInput = ({
  name,
  label,
  placeholder,
  left,
  right,
}: {
  name: string;
  label: string;
  placeholder?: string;
  left?: ReactNode;
  right?: ReactNode;
}) => {
  const methods = useFormContext();

  return (
    <Controller
      control={methods.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              {left && (
                <div className="absolute left-2 top-1/2 -translate-y-1/2">
                  {left}
                </div>
              )}
              {right && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  {right}
                </div>
              )}
              <Input
                className={cn({
                  "pl-13": !!left,
                  "pr-8": !!right,
                })}
                placeholder={placeholder}
                {...field}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
