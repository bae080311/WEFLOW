"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button, Container, Section } from "@/shared/ui";
import { ROUTES } from "@/shared/config";

export type ClosingCtaProps = {
  title?: string;
  description?: string;
  className?: string;
};

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

// 페이지 마감 풀블리드 CTA 밴드(브랜드 그라디언트). 홈·랜딩 재사용.
// 스크롤하면 밴드가 화면을 꽉 채울 때까지 커졌다가, 더 내리면 사라지는 핀 시퀀스.
// reduced-motion / SSR 에서는 효과 없이 정적 카드로 렌더한다.
export function ClosingCta({
  title = "지금, 문의로 이어지는 홈페이지를 시작하세요",
  description = "무료 진단으로 우리 비즈니스에 맞는 전환 구조를 먼저 확인해 보세요.",
  className,
}: ClosingCtaProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [progress, setProgress] = useState(0);

  // 모션 허용 시에만 효과 활성화(SSR/reduced-motion 제외). ref 와 무관하게 먼저 켠다.
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    // 마운트 후 클라이언트/모션 판정에 따른 1회성 활성화(SSR 결정성 위해 초기 false).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(true);
  }, []);

  // 활성화되어 애니메이션 브랜치(ref 부착)가 렌더된 뒤 스크롤 추적을 시작한다.
  useEffect(() => {
    if (!enabled) return;
    const el = sectionRef.current;
    if (!el) return;

    let raf = 0;
    let initialRaf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      setProgress(travel > 0 ? clamp01(-rect.top / travel) : 0);
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    initialRaf = window.requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
      if (initialRaf) window.cancelAnimationFrame(initialRaf);
    };
  }, [enabled]);

  const content = (
    <>
      <div className="dot-grid absolute inset-0 opacity-20" aria-hidden />
      <h2 className="relative mx-auto max-w-3xl text-balance text-h1 font-bold text-white md:text-hero md:leading-[1.1]">
        {title}
      </h2>
      <p className="relative mx-auto mt-4 max-w-xl text-balance text-body text-white/90">
        {description}
      </p>
      <div className="relative mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button href={ROUTES.diagnosis} variant="inverse" size="lg" className="w-full sm:w-auto">
          무료 진단 신청
        </Button>
        <Link
          href={ROUTES.cases}
          className="inline-flex items-center gap-1 text-body font-medium text-white underline-offset-4 transition-opacity hover:opacity-80 hover:underline focus-visible:underline focus-visible:opacity-80 focus-visible:outline-none"
        >
          성공 사례 보기
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </>
  );

  // 정적(SSR/reduced-motion): 기존 카드 그대로.
  if (!enabled) {
    return (
      <Section className={className}>
        <Container>
          <div className="bg-gradient-brand relative isolate overflow-hidden rounded-card px-6 py-16 text-center md:px-12 md:py-24">
            {content}
          </div>
        </Container>
      </Section>
    );
  }

  const p = progress;
  // 가운데(0.5)에 올수록 커져 화면을 꽉 채우고, 멀어질수록(양끝) 다시 작아진다.
  // (사라지지 않고 작은 카드로 돌아감)
  const center = 1 - Math.abs(p - 0.5) / 0.5;
  const scale = 0.55 + center * 0.45;
  const radius = (1 - center) * 32;

  return (
    <section ref={sectionRef} className={className} style={{ minHeight: "200vh" }}>
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <div
          className="bg-gradient-brand absolute inset-0 isolate flex flex-col items-center justify-center px-6 text-center will-change-transform md:px-12"
          style={
            {
              transform: `scale(${scale.toFixed(3)})`,
              borderRadius: `${radius.toFixed(1)}px`,
              overflow: "hidden",
            } as CSSProperties
          }
        >
          {content}
        </div>
      </div>
    </section>
  );
}
