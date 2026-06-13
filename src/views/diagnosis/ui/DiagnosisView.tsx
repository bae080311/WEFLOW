import { Check, ChevronDown, Sparkles } from "lucide-react";
import { Button, Container, Reveal, SectionHeader } from "@/shared/ui";
import { InquiryForm } from "@/features/inquiryForm";
import { DIAGNOSIS_CHECKLIST } from "@/shared/config";
import {
  DIAGNOSIS_CHECKLIST_TITLE,
  DIAGNOSIS_FORM_ANCHOR,
  DIAGNOSIS_FORM_HEADER,
  DIAGNOSIS_HERO,
  DIAGNOSIS_TRUST,
} from "../config/diagnosisContent";

// /diagnosis — 한 화면 좌우 분할: 좌(가치·진단항목·신뢰) / 우(신청 폼). 모바일은 세로 스택.
export function DiagnosisView() {
  const formHref = `#${DIAGNOSIS_FORM_ANCHOR}`;

  return (
    <section className="relative isolate overflow-hidden bg-bg-deep py-16 md:py-24">
      <div className="aurora-hero" aria-hidden />
      <div className="absolute inset-0 dot-grid opacity-50" aria-hidden />
      <div className="glow-orb -left-24 top-0 size-72 bg-brand-cyan/25" aria-hidden />
      <div className="glow-orb -right-20 bottom-0 size-80 bg-brand-blue/25" aria-hidden />

      <Container className="relative z-10 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* 좌: 가치 + 진단 항목 + 신뢰 */}
        <Reveal className="flex flex-col">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-cyan/40 bg-surface/60 px-4 py-1.5 text-caption font-medium text-brand-cyan backdrop-blur-sm">
            <Sparkles className="size-4" aria-hidden />
            {DIAGNOSIS_HERO.badge}
          </span>

          <SectionHeader
            className="mt-6"
            as="h1"
            size="lg"
            title={
              <>
                <span className="block">{DIAGNOSIS_HERO.titleLines[0]}</span>
                <span className="block text-gradient-brand">{DIAGNOSIS_HERO.titleLines[1]}</span>
              </>
            }
            description={DIAGNOSIS_HERO.description}
          />

          {/* 진단 항목 4 — 압축 리스트(2열) */}
          <p className="mt-8 text-caption font-bold uppercase tracking-[0.18em] text-text-subtle">
            {DIAGNOSIS_CHECKLIST_TITLE}
          </p>
          <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {DIAGNOSIS_CHECKLIST.map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-gradient-brand text-white">
                  <Check className="size-3.5" aria-hidden />
                </span>
                <span className="text-body text-text">{item}</span>
              </li>
            ))}
          </ul>

          {/* 신뢰 포인트 한 줄 */}
          <ul className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-caption text-text-muted">
            {DIAGNOSIS_TRUST.map((point) => (
              <li key={point} className="inline-flex items-center gap-1.5">
                <Check className="size-3.5 shrink-0 text-brand-cyan" aria-hidden />
                {point}
              </li>
            ))}
          </ul>

          {/* 모바일 전용 CTA — 아래 폼으로 스크롤 */}
          <Button href={formHref} variant="gradient" size="lg" className="mt-8 w-full lg:hidden">
            {DIAGNOSIS_HERO.ctaLabel}
            <ChevronDown className="size-5" aria-hidden />
          </Button>
        </Reveal>

        {/* 우: 신청 폼 카드 (앵커 타깃) */}
        <Reveal delay={120}>
          <div
            id={DIAGNOSIS_FORM_ANCHOR}
            className="gradient-ring relative isolate scroll-mt-24 overflow-hidden rounded-card bg-surface p-6 shadow-glow md:p-8"
          >
            <div className="glow-orb -right-12 -top-12 size-48 bg-brand-cyan/20" aria-hidden />
            <div className="relative">
              <p className="text-h3 text-text">{DIAGNOSIS_FORM_HEADER.title}</p>
              <p className="mt-1.5 text-caption text-text-muted">
                {DIAGNOSIS_FORM_HEADER.description}
              </p>
              <div className="mt-6">
                <InquiryForm source="diagnosis" />
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
