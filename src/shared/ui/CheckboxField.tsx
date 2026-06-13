"use client";

import { useId, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/shared/lib/cn";

export type CheckboxFieldProps = ComponentPropsWithoutRef<"input"> & {
  label: ReactNode;
  error?: string;
};

// 커스텀 체크박스: 실제 input(opacity-0)이 박스를 덮어 클릭/포커스/접근성 유지,
// 시각 박스는 peer 상태로 체크 팝인 애니메이션.
export function CheckboxField({ label, error, id, className, ...rest }: CheckboxFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const errorId = `${fieldId}-error`;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={fieldId} className="flex cursor-pointer items-start gap-3">
        <span className="relative mt-0.5 inline-flex size-5 shrink-0">
          <input
            id={fieldId}
            type="checkbox"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className={cn("peer absolute inset-0 z-10 cursor-pointer opacity-0", className)}
            {...rest}
          />
          <span
            aria-hidden
            className={cn(
              "grid size-5 place-items-center rounded-[6px] border border-border-strong bg-surface-2",
              "transition-[background-color,border-color,box-shadow] duration-200",
              "peer-hover:border-brand-cyan/60",
              "peer-checked:border-transparent peer-checked:bg-gradient-brand",
              "peer-checked:[&_svg]:scale-100 peer-checked:[&_svg]:opacity-100",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-brand-cyan peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-bg",
              error && "border-danger",
            )}
          >
            <Check
              className="size-3.5 scale-50 text-white opacity-0 transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none"
              aria-hidden
            />
          </span>
        </span>
        <span className="text-caption text-text-muted">{label}</span>
      </label>
      {error ? (
        <p id={errorId} className="text-caption text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
