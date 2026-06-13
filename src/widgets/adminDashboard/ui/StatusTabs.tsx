"use client";

import { cn } from "@/shared/lib";
import type { Status } from "@/shared/types";

export type StatusFilter = Status | "전체";

const TABS: StatusFilter[] = ["대기", "진행중", "완료", "전체"];

export type StatusTabsProps = {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
  className?: string;
};

export function StatusTabs({ value, onChange, className }: StatusTabsProps) {
  return (
    <div role="tablist" aria-label="상태 필터" className={cn("flex flex-wrap gap-2", className)}>
      {TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={value === tab}
          onClick={() => onChange(tab)}
          className={cn(
            "h-11 rounded-control border px-4 text-caption font-medium transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan",
            value === tab
              ? "border-brand-cyan bg-surface-2 text-brand-cyan"
              : "border-border bg-surface text-text-muted hover:bg-surface-2 hover:text-text",
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
