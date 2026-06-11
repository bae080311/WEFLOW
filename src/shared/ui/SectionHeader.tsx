import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

export type SectionHeaderProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  as: Heading = "h2",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(align === "center" ? "mx-auto max-w-2xl text-center" : "text-left", className)}
    >
      {eyebrow ? <p className="text-caption font-medium text-brand-cyan">{eyebrow}</p> : null}
      <Heading className="mt-2 text-h2 text-text md:text-h1">{title}</Heading>
      {description ? <p className="mt-3 text-body text-text-muted">{description}</p> : null}
    </div>
  );
}
