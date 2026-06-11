"use client";

import { useId, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "@/shared/lib/cn";
import { FIELD_CONTROL, FIELD_LABEL } from "./fieldStyles";

export type SelectOption = { value: string; label: string };

export type SelectFieldProps = ComponentPropsWithoutRef<"select"> & {
  label: ReactNode;
  error?: string;
  options: readonly SelectOption[];
  placeholder?: string;
};

export function SelectField({
  label,
  error,
  required,
  id,
  options,
  placeholder,
  className,
  ...rest
}: SelectFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const errorId = `${fieldId}-error`;
  const placeholderDefault =
    placeholder !== undefined && !("value" in rest) && !("defaultValue" in rest) ? "" : undefined;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={fieldId} className={FIELD_LABEL}>
        {label}
        {required ? (
          <span className="text-danger" aria-hidden>
            {" *"}
          </span>
        ) : null}
      </label>
      <select
        id={fieldId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(FIELD_CONTROL, "h-11 appearance-none", error && "border-danger", className)}
        defaultValue={placeholderDefault}
        {...rest}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p id={errorId} className="text-caption text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
