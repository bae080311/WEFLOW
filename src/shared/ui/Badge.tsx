import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/shared/lib/cn";

export type BadgeVariant = "default" | "brand" | "success" | "warning" | "danger";

const variantMap: Record<BadgeVariant, string> = {
  default: "bg-surface-2 text-text-muted",
  brand: "border border-brand-cyan text-brand-cyan",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
};

export type BadgeProps = ComponentPropsWithoutRef<"span"> & {
  variant?: BadgeVariant;
};

export function Badge({ variant = "default", className, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-caption font-medium",
        variantMap[variant],
        className,
      )}
      {...rest}
    />
  );
}
