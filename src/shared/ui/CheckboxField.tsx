"use client";

import { useId, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

export type CheckboxFieldProps = ComponentPropsWithoutRef<"input"> & {
  label: ReactNode;
  error?: string;
};

export function CheckboxField({ label, error, id, className, ...rest }: CheckboxFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const errorId = `${fieldId}-error`;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-start gap-2">
        <input
          id={fieldId}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn("mt-1 size-4 accent-primary", className)}
          {...rest}
        />
        <label htmlFor={fieldId} className="cursor-pointer text-caption text-text-muted">
          {label}
        </label>
      </div>
      {error ? (
        <p id={errorId} className="text-caption text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
