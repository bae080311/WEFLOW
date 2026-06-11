import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/shared/lib/cn";

export type SectionBg = "base" | "deep" | "surface";

const bgMap: Record<SectionBg, string> = {
  base: "bg-bg",
  deep: "bg-bg-deep",
  surface: "bg-surface",
};

export type SectionProps = ComponentPropsWithoutRef<"section"> & {
  bg?: SectionBg;
};

export function Section({ bg, className, ...rest }: SectionProps) {
  return (
    <section className={cn("py-12 md:py-20 lg:py-24", bg && bgMap[bg], className)} {...rest} />
  );
}
