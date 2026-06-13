import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/shared/lib/cn";

export type FormSuccessProps = {
  title: string;
  description?: string;
  className?: string;
  /** 후속 액션(예: "새 문의 작성" 버튼) */
  children?: ReactNode;
};

// 폼 제출 성공 패널 — 브랜드 글로우 + 팝인 체크 아이콘으로 "완료"를 직관적으로 보여준다.
// (예약·문의 폼 공용)
export function FormSuccess({ title, description, className, children }: FormSuccessProps) {
  return (
    <div
      role="status"
      className={cn(
        "relative isolate flex flex-col items-center gap-5 overflow-hidden rounded-card border border-border bg-surface p-8 text-center",
        className,
      )}
    >
      <div
        className="glow-orb left-1/2 top-0 size-44 -translate-x-1/2 bg-brand-cyan/25"
        aria-hidden
      />
      <span className="animate-bubble-pop relative grid size-16 place-items-center rounded-full bg-gradient-brand text-white shadow-glow">
        <Check className="size-8" strokeWidth={3} aria-hidden />
      </span>
      <div className="relative flex flex-col gap-1.5">
        <p className="text-h2 text-text">{title}</p>
        {description ? <p className="break-keep text-body text-text-muted">{description}</p> : null}
      </div>
      {children ? (
        <div className="relative mt-1 flex flex-col gap-2 sm:flex-row">{children}</div>
      ) : null}
    </div>
  );
}
