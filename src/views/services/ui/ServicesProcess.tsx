"use client";

import { useEffect, useRef, useState } from "react";
import { Container, SectionHeader } from "@/shared/ui";
import { cn } from "@/shared/lib";
import { PROCESS_STEPS } from "@/shared/config";
import { SERVICES_PROCESS_HEADER } from "../config/servicesContent";

const pad = (n: number) => String(n).padStart(2, "0");

// 6단계 — 카카오 AI 페이지처럼 한 단계가 한 화면씩(스크롤 스냅으로 뚝뚝 끊겨) 전개된다.
export function ServicesProcess() {
  const steps = PROCESS_STEPS;
  const total = steps.length;
  const scrollerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);

  // 현재 화면에 들어온 단계를 추적해 진행 레일을 갱신(IO 미지원 시 그냥 정적).
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const root = scrollerRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const i = panelRefs.current.indexOf(e.target as HTMLElement);
            if (i >= 0) setActive(i);
          }
        }
      },
      { root, threshold: 0.6 },
    );
    panelRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const goTo = (i: number) =>
    panelRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <section className="relative">
      {/* 제목 헤더 — 과정(패널) 위에 겹쳐지는 오버레이(큰 빈 공간 없이) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 pt-10 md:pt-14">
        <Container>
          <SectionHeader {...SERVICES_PROCESS_HEADER} />
        </Container>
      </div>

      <div className="relative">
        {/* 진행 레일 — 번호 노드 + 연결선(완료 구간 그라디언트) 세로 타임라인 */}
        <ol className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col md:flex lg:right-10">
          {steps.map((s, i) => {
            const isActive = i === active;
            const done = i < active;
            return (
              <li key={s.step} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`${s.step}단계 ${s.title}`}
                  aria-current={isActive}
                  className="group flex items-center gap-3 focus-visible:outline-none"
                >
                  <span
                    className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-full text-caption font-bold transition-all duration-300 group-focus-visible:ring-2 group-focus-visible:ring-brand-cyan",
                      isActive
                        ? "bg-gradient-brand text-white shadow-glow"
                        : done
                          ? "border border-brand-cyan/50 text-brand-cyan"
                          : "border border-border-strong text-text-subtle group-hover:border-brand-cyan/60 group-hover:text-text-muted",
                    )}
                  >
                    {pad(s.step)}
                  </span>
                  <span
                    className={cn(
                      "whitespace-nowrap text-caption font-medium transition-colors duration-300",
                      isActive ? "text-text" : "text-text-subtle group-hover:text-text-muted",
                    )}
                  >
                    {s.title}
                  </span>
                </button>
                {i < total - 1 ? (
                  <span
                    className={cn(
                      "ml-4 h-6 w-px transition-colors duration-300",
                      done ? "bg-gradient-brand" : "bg-border-strong",
                    )}
                    aria-hidden
                  />
                ) : null}
              </li>
            );
          })}
        </ol>

        {/* 풀스크린 스냅 스텝퍼 */}
        <div
          ref={scrollerRef}
          className="dot-grid h-screen snap-y snap-mandatory overflow-y-auto bg-bg-deep"
          tabIndex={0}
          aria-label="제작 진행 6단계"
        >
          {steps.map((s, i) => (
            <section
              key={s.step}
              ref={(el) => {
                panelRefs.current[i] = el;
              }}
              aria-label={`${s.step}단계 ${s.title}`}
              className="relative flex h-screen snap-start items-center justify-center overflow-hidden px-6 text-center"
            >
              {/* 화면을 꽉 채우는 거대 단계 번호 (제목이 그 위에 겹쳐진다) */}
              <span
                className="text-gradient-brand pointer-events-none absolute inset-0 grid select-none place-items-center font-bold leading-none opacity-20"
                style={{ fontSize: "min(94vh, 62vw)" }}
                aria-hidden
              >
                {pad(s.step)}
              </span>

              {/* 번호 위에 겹쳐지는 텍스트 */}
              <div className="relative z-10 flex flex-col items-center gap-4">
                <span className="text-caption font-medium tracking-[0.3em] text-brand-cyan">
                  STEP {pad(s.step)} / {pad(total)}
                </span>
                <h3
                  className="font-bold leading-[1.05] text-text"
                  style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)" }}
                >
                  {s.title}
                </h3>
                <p className="max-w-xl text-balance text-body text-text-muted md:text-lg">
                  {s.description}
                </p>
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
