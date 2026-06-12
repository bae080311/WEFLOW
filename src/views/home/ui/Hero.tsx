"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ChevronDown } from "lucide-react";
import { Button, Chip, Container } from "@/shared/ui";
import { ROUTES } from "@/shared/config";

const CHIPS = [
  "케어 플랜 (제작·광고·운영)",
  "빠른제작 (3일~7일)",
  "합리적 비용 (가성비+퀄리티)",
] as const;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [progress, setProgress] = useState(0);

  // 스크롤 진행도(0~1) 추적. reduced-motion / SSR(jsdom) 에서는 비활성 →
  // 효과 없이 완전히 드러난(revealed) 일반 히어로로 렌더한다.
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const el = sectionRef.current;
    if (!el) return;
    setEnabled(true);

    let raf = 0;
    let initialRaf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      // 레이아웃이 아직 안 잡혀 travel<=0 이면 인트로(0) 상태로 둔다(완전공개 1 아님).
      setProgress(travel > 0 ? clamp01(-rect.top / travel) : 0);
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    // 첫 페인트 후 다시 측정(min-height 적용 전 오측정 보정).
    initialRaf = window.requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
      if (initialRaf) window.cancelAnimationFrame(initialRaf);
    };
  }, []);

  // 비활성(SSR/reduced-motion) 시 p=1 → 오버레이가 사라진 최종 공개 상태.
  const p = enabled ? progress : 1;
  // W 구멍 크기: 스크롤 내릴수록 점점 커지며 뚫고 들어가는 줌인(메인 연출).
  const holeSize = `${(24 + Math.pow(p, 1.3) * 270).toFixed(1)}vmin`;
  // 오버레이(어두운 면): 커지는 동안 계속 불투명하게 유지 → 마지막(0.8~1)에만
  // 페이드아웃해 W 음각(빈 공간) 잔상을 깔끔히 정리하며 히어로 완전 공개.
  const overlayOpacity = p < 0.8 ? 1 : clamp01(1 - (p - 0.8) / 0.2);
  // 콘텐츠: 구멍이 충분히 커진 뒤(0.55~0.9) 서서히 등장.
  const contentOpacity = enabled ? clamp01((p - 0.55) / 0.35) : 1;

  return (
    <section
      ref={sectionRef}
      className="relative bg-bg-deep"
      style={enabled ? { minHeight: "230vh" } : undefined}
    >
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* 리빌 배경 — 구멍(W) 너머로 비치는 브랜드 비주얼 */}
        <div className="absolute inset-0" aria-hidden>
          <div className="aurora-hero" />
          <div className="absolute inset-0 dot-grid opacity-60" />
          <div className="hero-reveal-glow absolute inset-0" />
          <div
            className="glow-orb -left-24 top-10 size-72 bg-brand-cyan/30"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="glow-orb -right-16 bottom-0 size-80 bg-brand-blue/30"
            style={{ animationDelay: "-6s" }}
          />
        </div>

        {/* 히어로 콘텐츠 — 구멍이 열리며 서서히 등장 */}
        <Container
          className="relative z-10 flex flex-col items-center py-16 text-center transition-opacity duration-500 md:py-20"
          style={{ opacity: contentOpacity }}
        >
          <p className="text-caption font-medium tracking-tight text-text-muted md:text-body">
            랜딩&홈페이지 제작 · 광고 운영 · 검색 상단 노출 · 맞춤형 웹 솔루션
          </p>

          <h1 className="mt-4 text-balance text-hero font-bold text-text">
            <span className="block">문의로 이어지는</span>
            <span className="block">
              <span className="text-gradient-brand">홈페이지</span>를 만듭니다
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-balance text-body text-text-muted">
            홈페이지 제작부터 광고 연동·운영 관리까지.
            <br className="hidden sm:block" />
            단순 제작이 아닌 <span className="text-text">문의 구조</span>까지 설계합니다.
          </p>

          <div className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              href={ROUTES.diagnosis}
              variant="gradient"
              size="lg"
              className="w-full sm:w-auto"
            >
              무료 진단 신청
            </Button>
            {/* 글로우 배경 위에서도 또렷하게 — 반투명 서피스 + 강한 테두리 */}
            <Button
              href={ROUTES.cases}
              variant="outlined"
              size="lg"
              className="w-full border-border-strong bg-surface-2/80 backdrop-blur-sm sm:w-auto"
            >
              성공 사례 보기
            </Button>
            <Button
              href={ROUTES.landing}
              variant="outlined"
              size="lg"
              className="w-full border-border-strong bg-surface-2/80 backdrop-blur-sm sm:w-auto"
            >
              WEFLOW 랜딩 페이지
            </Button>
          </div>

          <ul className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {CHIPS.map((label) => (
              <li key={label}>
                <Chip variant="brand">{label}</Chip>
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-col items-center gap-1 text-text-subtle" aria-hidden>
            <span className="text-caption">스크롤하여 더 알아보기</span>
            <ChevronDown className="size-4 motion-safe:animate-bounce" />
          </div>
        </Container>

        {/* WEFLOW 로고(W) 모양 구멍이 뚫린 어두운 오버레이 — 스크롤하면 구멍이 열림 */}
        {enabled && (
          <div
            className="logo-knockout pointer-events-none absolute inset-0 z-20 bg-bg"
            style={{ "--hole": holeSize, opacity: overlayOpacity } as CSSProperties}
            aria-hidden
          />
        )}
      </div>
    </section>
  );
}
