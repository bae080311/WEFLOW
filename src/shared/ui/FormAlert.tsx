import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/shared/lib/cn";

export type FormAlertProps = {
  children: ReactNode;
  className?: string;
};

// 폼 제출 에러 알림 — 단순 빨간 텍스트 대신 아이콘 + danger 틴트 박스로 눈에 띄게.
// (예약·문의 폼 공용)
export function FormAlert({ children, className }: FormAlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "animate-fade-up flex items-start gap-2.5 rounded-control border border-danger/40 bg-danger/10 px-4 py-3 text-caption text-danger",
        className,
      )}
    >
      <AlertCircle className="mt-px size-4 shrink-0" aria-hidden />
      <span>{children}</span>
    </div>
  );
}
