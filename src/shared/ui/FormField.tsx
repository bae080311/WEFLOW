"use client";

import { useId, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "@/shared/lib/cn";
import { FIELD_CONTROL, FIELD_LABEL } from "./fieldStyles";

export type FormFieldProps = ComponentPropsWithoutRef<"input"> & {
  label: ReactNode;
  error?: string;
};

export function FormField({ label, error, required, id, className, ...rest }: FormFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const errorId = `${fieldId}-error`;

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
      <input
        id={fieldId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(FIELD_CONTROL, "h-11", error && "border-danger", className)}
        {...rest}
      />
      {error ? (
        <p id={errorId} className="text-caption text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
