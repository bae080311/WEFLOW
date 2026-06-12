"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { PRICING_PLANS, PriceCard, type PricingGroup } from "@/entities/pricingPlan";
import { cn } from "@/shared/lib";

const GROUP_META: Record<PricingGroup, { title: string; note?: string }> = {
  제작: { title: "제작 플랜", note: "필수 선택형 (3중 택1)" },
  케어: { title: "케어 플랜", note: "필수 선택형 (3중 택1)" },
  광고: { title: "광고 플랜", note: "키워드 셋팅" },
};

const DEFAULT_GROUPS: PricingGroup[] = ["제작", "케어", "광고"];

export type PricingCardsProps = {
  groups?: PricingGroup[];
  className?: string;
};

// 8개 가격 카드 — 그룹(제작/케어/광고) 탭으로 나눠 선택한 그룹만 컬럼 비교로 표시.
// 탭 선택 시 인디케이터가 미끄러지고(magic underline), 카드는 스태거 fade-up 으로 등장.
export function PricingCards({ groups = DEFAULT_GROUPS, className }: PricingCardsProps) {
  const [active, setActive] = useState<PricingGroup>(groups[0]);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });

  // 활성 탭 위치를 측정해 인디케이터를 이동(탭 변경·리사이즈 시).
  useEffect(() => {
    const measure = () => {
      const idx = groups.indexOf(active);
      if (idx === -1) return;
      const el = tabRefs.current[idx];
      if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active, groups]);

  const plans = PRICING_PLANS.filter((p) => p.group === active);
  const meta = GROUP_META[active];
  const twoCol = plans.length === 2;

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      {/* 탭 */}
      <div
        role="tablist"
        aria-label="가격 플랜 그룹"
        className="relative flex justify-center gap-1 border-b border-border"
      >
        {groups.map((group, i) => {
          const selected = group === active;
          return (
            <button
              key={group}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(group)}
              className={cn(
                "relative px-5 py-3 text-body font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan sm:px-8",
                selected ? "text-text" : "text-text-muted hover:text-text",
              )}
            >
              {GROUP_META[group].title}
            </button>
          );
        })}
        {/* 미끄러지는 인디케이터 */}
        <span
          aria-hidden
          className="absolute bottom-0 left-0 h-0.5 rounded-full bg-gradient-brand transition-[transform,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={
            {
              width: `${indicator.width}px`,
              transform: `translateX(${indicator.left}px)`,
            } as CSSProperties
          }
        />
      </div>

      {/* 선택 그룹 컬럼 비교 (탭 변경 시 key 로 remount → 스태거 등장) */}
      <div role="tabpanel" key={active} className="flex flex-col gap-6">
        {meta.note ? (
          <p className="animate-fade-up text-center text-caption text-text-muted">{meta.note}</p>
        ) : null}
        <div
          className={cn(
            "mx-auto grid w-full grid-cols-1 items-stretch gap-5",
            twoCol ? "max-w-3xl md:grid-cols-2" : "max-w-6xl md:grid-cols-3",
          )}
        >
          {plans.map((plan, i) => (
            <div
              key={plan.id}
              className="animate-fade-up h-full"
              style={{ animationDelay: `${i * 80 + 40}ms` }}
            >
              <PriceCard plan={plan} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
