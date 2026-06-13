import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/shared/lib/cn";

// 모바일에서는 block(=카드 스택), md 이상에서 일반 table. 데스크탑만 가로 스크롤/최소폭 적용.
export function Table({ className, ...rest }: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="w-full md:overflow-x-auto">
      <table
        className={cn(
          "block w-full border-collapse text-left text-body md:table md:min-w-160",
          className,
        )}
        {...rest}
      />
    </div>
  );
}

export function TableHeaderCell({ className, ...rest }: ComponentPropsWithoutRef<"th">) {
  return (
    <th
      scope="col"
      className={cn(
        "border-b border-border px-4 py-3 text-caption font-medium text-text-muted",
        className,
      )}
      {...rest}
    />
  );
}

export function TableCell({ className, ...rest }: ComponentPropsWithoutRef<"td">) {
  return <td className={cn("border-b border-border px-4 py-3 text-text", className)} {...rest} />;
}
