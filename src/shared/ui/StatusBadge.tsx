import type { Status } from "@/shared/types";
import { Badge, type BadgeVariant } from "./Badge";

const statusVariant: Record<Status, BadgeVariant> = {
  대기: "default",
  진행중: "warning",
  완료: "success",
};

export type StatusBadgeProps = {
  status: Status;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge variant={statusVariant[status]} className={className}>
      {status}
    </Badge>
  );
}
