"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, isPastDate, toISODate } from "@/shared/lib";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export type CalendarProps = {
  value: string; // 선택된 날짜 "YYYY-MM-DD"
  onSelect: (iso: string) => void;
  now: Date | null; // 오늘 기준(과거 비활성). null이면 placeholder(하이드레이션 안전)
  className?: string;
};

// 세로형 월 달력. 과거 날짜는 선택 불가, 이전/다음 달 이동(현재 달 이전으로는 못 감).
export function Calendar({ value, onSelect, now, className }: CalendarProps) {
  const [monthOffset, setMonthOffset] = useState(0);

  if (!now) {
    return (
      <div
        className={cn("rounded-card border border-border bg-surface-2 p-4", className)}
        aria-hidden
      >
        <div className="h-72" />
      </div>
    );
  }

  const base = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const year = base.getFullYear();
  const month = base.getMonth();
  const firstWeekday = base.getDay(); // 0=일
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div
      role="group"
      aria-label="희망 날짜 선택"
      className={cn("rounded-card border border-border bg-surface-2 p-4", className)}
    >
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="이전 달"
          disabled={monthOffset <= 0}
          onClick={() => setMonthOffset((offset) => offset - 1)}
          className="grid size-9 place-items-center rounded-control text-text-muted transition-colors hover:bg-surface hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronLeft className="size-4" aria-hidden />
        </button>
        <p className="text-body font-medium text-text">
          {year}년 {month + 1}월
        </p>
        <button
          type="button"
          aria-label="다음 달"
          onClick={() => setMonthOffset((offset) => offset + 1)}
          className="grid size-9 place-items-center rounded-control text-text-muted transition-colors hover:bg-surface hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
        >
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((weekday, index) => (
          <span
            key={weekday}
            className={cn(
              "py-1 text-caption font-medium",
              index === 0 ? "text-danger" : "text-text-subtle",
            )}
          >
            {weekday}
          </span>
        ))}
        {cells.map((day, index) => {
          if (day === null) return <span key={`empty-${index}`} aria-hidden />;
          const iso = toISODate(new Date(year, month, day));
          const disabled = isPastDate(iso, now);
          const selected = value === iso;
          const isSunday = index % 7 === 0;
          return (
            <button
              key={iso}
              type="button"
              title={iso}
              disabled={disabled}
              aria-pressed={selected}
              onClick={() => onSelect(iso)}
              className={cn(
                "grid h-11 place-items-center rounded-control text-caption transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan",
                selected
                  ? "bg-gradient-brand font-bold text-white"
                  : cn("hover:bg-surface", isSunday ? "text-danger" : "text-text"),
                "disabled:cursor-not-allowed disabled:text-text-subtle disabled:opacity-40 disabled:hover:bg-transparent",
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
