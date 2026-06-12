"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

export type RevealProps = {
  children: ReactNode;
  className?: string;
  /** 진입 지연(ms) — 그리드 내 카드 stagger 용 */
  delay?: number;
};

/**
 * 스크롤 진입 시 fade-up 으로 나타나는 래퍼.
 * IntersectionObserver 가 없거나(jsdom/SSR) 지원되지 않으면 즉시 노출한다.
 * 모션 억제는 globals.css 의 prefers-reduced-motion 블록이 처리한다.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      // IO 미지원(jsdom/구형 브라우저) 폴백: 관찰이 불가하므로 즉시 노출한다.
      // 초기 state 는 SSR 결정성을 위해 항상 false 이므로, 이 1회성 set 은 불가피하다.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("reveal", visible && "is-visible", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
