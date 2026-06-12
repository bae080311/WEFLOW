"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/cn";

export type CountUpProps = {
  value: number;
  durationMs?: number;
  className?: string;
  /** 표시 포맷터(천단위 등). 기본은 정수 문자열 */
  format?: (n: number) => string;
};

/**
 * 뷰포트 진입 시 0 → value 로 카운트업.
 * IO/rAF 미지원(jsdom/SSR) 또는 prefers-reduced-motion 이면 즉시 최종값을 표시한다.
 */
export function CountUp({ value, durationMs = 1200, className, format }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion =
      typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (
      typeof IntersectionObserver === "undefined" ||
      typeof requestAnimationFrame === "undefined" ||
      reduceMotion
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- 미지원/모션억제 환경 1회성 폴백
      setDisplay(value);
      return;
    }

    let raf = 0;
    let start = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.disconnect();
          const tick = (ts: number) => {
            if (!start) start = ts;
            const progress = Math.min(1, (ts - start) / durationMs);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * value));
            if (progress < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [value, durationMs]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {format ? format(display) : String(display)}
    </span>
  );
}
