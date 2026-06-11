import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/shared/lib/cn";

export type ContainerProps = ComponentPropsWithoutRef<"div"> & {
  /** 시맨틱 태그 교체 (예: "section", "header"). 기본 div. */
  as?: ElementType;
};

// design-system §8: max-w 1200(=max-w-content) + 반응형 좌우 패딩(모바일 20 / 데스크탑 32)
export function Container({ as: Tag = "div", className, ...rest }: ContainerProps) {
  return <Tag className={cn("mx-auto w-full max-w-content px-5 md:px-8", className)} {...rest} />;
}
