import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

export type ButtonVariant = "gradient" | "solid" | "outlined" | "ghost" | "inverse";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control font-medium " +
  "transition-[transform,box-shadow,background-color,border-color,color] duration-200 ease-out " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-bg " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none";

const variants: Record<ButtonVariant, string> = {
  gradient: "bg-gradient-brand text-white hover:shadow-glow",
  solid: "bg-primary text-white hover:bg-primary-soft",
  outlined: "border border-border-strong bg-transparent text-text hover:bg-surface-2",
  ghost: "bg-transparent text-text-muted hover:bg-surface hover:text-text",
  // 컬러 배경(브랜드 그라디언트 밴드) 위에서 사용하는 화이트 버튼
  inverse: "bg-white text-primary hover:bg-white/90",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-caption",
  md: "h-11 px-5 text-body",
  lg: "h-13 px-6 text-body",
};

type BaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = BaseProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof BaseProps | "href"> & { href?: undefined };

type ButtonAsLink = BaseProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof BaseProps> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = "solid",
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (rest.href != null) {
    return (
      <Link className={classes} {...(rest as ButtonAsLink)}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...(rest as ButtonAsButton)}>
      {children}
    </button>
  );
}
