"use client";

import { useEffect, useState } from "react";
import { Workflow, Rocket, Wallet, type LucideIcon } from "lucide-react";
import { Container, Section, SectionHeader } from "@/shared/ui";
import { cn } from "@/shared/lib";
import { VALUE_CARDS } from "../config/homeContent";

const ICONS: LucideIcon[] = [Workflow, Rocket, Wallet];

// 핵심 가치 — 활성 카드가 큰 슬롯으로 올라오고 나머지는 옆에 스택.
// 자동으로 하나씩 차례대로 넘어가며(hover/포커스 시 정지), 클릭/점으로도 전환.
export function ValueCards() {
  const count = VALUE_CARDS.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [autoOk, setAutoOk] = useState(false);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAutoOk(true);
  }, []);

  useEffect(() => {
    if (!autoOk || paused || count <= 1) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % count), 4000);
    return () => window.clearInterval(id);
  }, [autoOk, paused, count]);

  const rest = VALUE_CARDS.map((_, i) => i).filter((i) => i !== active);
  const order = [active, ...rest];

  return (
    <Section className="relative isolate overflow-hidden">
      <div className="section-aura opacity-60" aria-hidden />
      <Container className="relative flex flex-col gap-12">
        <SectionHeader
          size="lg"
          align="center"
          eyebrow="WHY WEFLOW"
          title="문의로 이어지는 핵심 가치"
        />

        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <ul className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-2">
            {order.map((origIdx, pos) => {
              const featured = pos === 0;
              const card = VALUE_CARDS[origIdx];
              const Icon = ICONS[origIdx % ICONS.length];
              return (
                <li key={card.title} className={cn(featured && "lg:col-span-2 lg:row-span-2")}>
                  <button
                    type="button"
                    onClick={() => setActive(featured ? (active + 1) % count : origIdx)}
                    aria-label={featured ? "다음 가치 보기" : `${card.title} 보기`}
                    className={cn(
                      "group relative flex h-full w-full flex-col overflow-hidden rounded-card p-7 text-left transition-[transform,border-color,box-shadow] duration-300 ease-out",
                      "hover:-translate-y-1.5 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                      featured
                        ? "gradient-ring justify-end bg-gradient-card lg:p-10"
                        : "justify-start border border-border bg-surface/60 backdrop-blur-sm hover:border-brand-cyan/40",
                    )}
                  >
                    <span
                      className={cn(
                        "text-gradient-brand pointer-events-none absolute select-none font-bold leading-none opacity-15",
                        featured ? "-right-2 -top-6 text-[10rem]" : "-right-1 -top-3 text-[5rem]",
                      )}
                      aria-hidden
                    >
                      {String(origIdx + 1).padStart(2, "0")}
                    </span>
                    {/* 활성 카드 전환 시 페이드인 */}
                    <span
                      key={featured ? `f-${active}` : undefined}
                      className={cn("contents", featured && "motion-safe:[&>*]:animate-fade-up")}
                    >
                      <span
                        className={cn(
                          "grid place-items-center rounded-control bg-gradient-brand text-white",
                          featured ? "size-14" : "size-12",
                        )}
                      >
                        <Icon className={featured ? "size-7" : "size-6"} aria-hidden />
                      </span>
                      <h3 className={cn("mt-5 text-text", featured ? "text-hero" : "text-h2")}>
                        {card.title}
                      </h3>
                      <p className="mt-3 max-w-md text-body text-text-muted">{card.description}</p>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* 점 인디케이터 */}
          <ul className="mt-8 flex items-center justify-center gap-2">
            {VALUE_CARDS.map((card, i) => (
              <li key={card.title}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`${card.title} 보기`}
                  aria-current={i === active}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan",
                    i === active
                      ? "w-6 bg-gradient-brand"
                      : "w-2 bg-border-strong hover:bg-text-subtle",
                  )}
                />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
