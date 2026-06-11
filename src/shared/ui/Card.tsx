import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/shared/lib/cn";

export type CardVariant = "default" | "gradient" | "premium";

const variantMap: Record<CardVariant, string> = {
  default: "bg-surface border-border",
  gradient: "bg-gradient-card border-border",
  premium: "bg-surface border-accent",
};

export type CardProps = ComponentPropsWithoutRef<"div"> & {
  variant?: CardVariant;
  interactive?: boolean;
};

export function Card({ variant = "default", interactive = false, className, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card border p-5 transition-[border-color,box-shadow] duration-200 ease-out md:p-6 motion-reduce:transition-none",
        variantMap[variant],
        interactive &&
          "cursor-pointer hover:border-brand-cyan/40 hover:shadow-glow focus-within:border-brand-cyan/40 focus-within:shadow-glow active:scale-[0.99]",
        className,
      )}
      {...rest}
    />
  );
}
