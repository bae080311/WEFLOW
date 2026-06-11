"use client";

import { useId, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "@/shared/lib/cn";
import { FIELD_CONTROL, FIELD_LABEL } from "./fieldStyles";

export type TextareaFieldProps = ComponentPropsWithoutRef<"textarea"> & {
  label: ReactNode;
  error?: string;
};

export function TextareaField({
  label,
  error,
  required,
  id,
  className,
  ...rest
}: TextareaFieldProps) {
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
      <textarea
        id={fieldId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(FIELD_CONTROL, "min-h-30 resize-y py-3", error && "border-danger", className)}
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
