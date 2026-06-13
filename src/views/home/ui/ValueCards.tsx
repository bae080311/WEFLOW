"use client";

import { useEffect, useState } from "react";
import { Workflow, Rocket, Wallet, type LucideIcon } from "lucide-react";
import { Container, Section, SectionHeader } from "@/shared/ui";
import { cn } from "@/shared/lib";
import { VALUE_CARDS } from "../config/homeContent";

const ICONS: LucideIcon[] = [Workflow, Rocket, Wallet];

// 핵심 가치 — 동일 크기 3카드, 활성 카드가 떠오르고 빛나며 자동 순환(hover/포커스 시 정지·점으로도 전환).
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
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {VALUE_CARDS.map((card, i) => {
              const isActive = i === active;
              const Icon = ICONS[i % ICONS.length];
              return (
                <li key={card.title}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-pressed={isActive}
                    aria-label={`${card.title} 보기`}
                    className={cn(
                      "group relative flex h-full w-full flex-col overflow-hidden rounded-card p-7 text-left",
                      "transition-[transform,border-color,box-shadow] duration-300 ease-out",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan motion-reduce:transition-none",
                      isActive
                        ? "gradient-ring bg-gradient-card shadow-glow motion-safe:-translate-y-1"
                        : "border border-border bg-surface/60 backdrop-blur-sm hover:-translate-y-1 hover:border-brand-cyan/40 motion-reduce:hover:translate-y-0",
                    )}
                  >
                    {isActive ? (
                      <span
                        className="glow-orb -right-8 -top-10 size-44 bg-brand-cyan/20"
                        aria-hidden
                      />
                    ) : null}

                    <span className="relative flex items-center justify-between">
                      <span
                        className={cn(
                          "grid size-12 place-items-center rounded-control bg-gradient-brand text-white transition-transform duration-300",
                          isActive && "motion-safe:scale-110",
                        )}
                      >
                        <Icon className="size-6" aria-hidden />
                      </span>
                      <span
                        className={cn(
                          "select-none text-[3.25rem] font-bold leading-none transition-colors duration-300",
                          isActive ? "text-gradient-brand opacity-50" : "text-text-subtle/25",
                        )}
                        aria-hidden
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </span>

                    <h3 className="relative mt-6 text-h2 text-text">{card.title}</h3>
                    <p className="relative mt-2 text-body text-text-muted">{card.description}</p>
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
