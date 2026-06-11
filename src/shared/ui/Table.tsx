import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/shared/lib/cn";

export function Table({ className, ...rest }: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={cn("w-full min-w-160 border-collapse text-left text-body", className)}
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
