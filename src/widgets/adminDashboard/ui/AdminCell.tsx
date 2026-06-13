import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/shared/lib";

export type AdminCellProps = ComponentPropsWithoutRef<"td"> & {
  /** 모바일 카드에서 값 앞에 보여줄 필드명 */
  label?: string;
  /** 모바일에서 라벨 위 / 값 아래로 세로 배치(컨트롤처럼 넓은 값용) */
  stack?: boolean;
  children: ReactNode;
};

// 모바일=카드 행(라벨+값), 데스크탑=일반 td. 단일 DOM으로 반응형 처리(중복 렌더 없음).
export function AdminCell({ label, stack, className, children, ...rest }: AdminCellProps) {
  return (
    <td
      className={cn(
        "gap-3 py-1.5 first:pt-0 last:pb-0 md:table-cell md:border-b md:border-border md:px-4 md:py-3 md:first:pt-3 md:last:pb-3",
        stack ? "flex flex-col items-start" : "flex items-center justify-between",
        className,
      )}
      {...rest}
    >
      {label ? (
        <span className="shrink-0 text-caption text-text-muted md:hidden">{label}</span>
      ) : null}
      <div
        className={cn("min-w-0 break-keep", stack ? "mt-1.5 md:mt-0" : "text-right md:text-left")}
      >
        {children}
      </div>
    </td>
  );
}
