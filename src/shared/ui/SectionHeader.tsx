import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

export type SectionHeaderProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  /** md=기본(콘텐츠 섹션), lg=대형 헤드라인(랜딩·홈 주요 섹션) */
  size?: "md" | "lg";
  className?: string;
};

const titleSize: Record<NonNullable<SectionHeaderProps["size"]>, string> = {
  md: "text-h2 md:text-h1",
  lg: "text-h1 leading-[1.15] md:text-hero md:leading-[1.1]",
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  as: Heading = "h2",
  size = "md",
  className,
}: SectionHeaderProps) {
  const center = align === "center";
  return (
    <div className={cn(center ? "mx-auto max-w-2xl text-center" : "text-left", className)}>
      {eyebrow ? (
        <p
          className={cn(
            "inline-flex items-center gap-2 text-caption font-bold uppercase tracking-[0.18em] text-brand-cyan",
            center && "justify-center",
          )}
        >
          <span className="h-px w-6 bg-gradient-brand" aria-hidden />
          {eyebrow}
        </p>
      ) : null}
      <Heading className={cn("mt-3 text-balance break-keep text-text", titleSize[size])}>
        {title}
      </Heading>
      {description ? (
        <p className="mt-4 break-keep text-body text-text-muted">{description}</p>
      ) : null}
    </div>
  );
}
