import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/shared/lib/cn";

export type ChipVariant = "default" | "brand";

const variantMap: Record<ChipVariant, string> = {
  default: "border border-border bg-surface-2 text-text-muted",
  brand: "border border-brand-cyan text-brand-cyan",
};

export type ChipProps = ComponentPropsWithoutRef<"span"> & {
  variant?: ChipVariant;
};

export function Chip({ variant = "default", className, ...rest }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-control px-3 py-2 text-caption font-medium",
        variantMap[variant],
        className,
      )}
      {...rest}
    />
  );
}
