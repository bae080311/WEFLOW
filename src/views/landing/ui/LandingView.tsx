import { Container, Section, SectionHeader } from "@/shared/ui";
import { InquiryForm } from "@/features/inquiryForm";
import { StatsBand } from "@/widgets/statsBand";
import { ProcessSteps } from "@/widgets/processSteps";
import { PricingCards } from "@/widgets/pricingCards";
import { ReviewMarquee } from "@/widgets/reviewMarquee";
import { DiagnosisChecklist } from "@/widgets/diagnosisChecklist";
import { ClosingCta } from "@/widgets/closingCta";
import { LandingHero } from "./LandingHero";
import { LandingValues } from "./LandingValues";
import {
  LANDING_PRICING_HEADER,
  LANDING_PROCESS_HEADER,
  LANDING_REVIEW_HEADER,
} from "../config/landingContent";

// 우측 sticky / 모바일 inline 으로 동일하게 쓰는 문의 폼 패널.
function InquiryPanel() {
  return (
    <div className="rounded-card border border-border-strong bg-surface p-6">
      <h2 className="text-h3 text-text">무료 상담 문의</h2>
      <p className="mb-5 mt-1 text-caption text-text-muted">남겨주시면 빠르게 연락드립니다.</p>
      <InquiryForm source="landing" />
    </div>
  );
}

export function LandingView() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-bg-deep py-16 md:py-24">
        <div className="aurora-hero" aria-hidden />
        <div className="absolute inset-0 dot-grid opacity-50" aria-hidden />
        <div className="glow-orb -left-24 top-10 size-72 bg-brand-cyan/25" aria-hidden />
        <Container className="relative z-10 grid gap-10 lg:grid-cols-[1.55fr_minmax(340px,0.85fr)] lg:items-start lg:gap-12">
          <div className="flex flex-col gap-12">
            <LandingHero />
            {/* 모바일: 폼을 본문 상단 inline 으로 노출 */}
            <div className="lg:hidden">
              <InquiryPanel />
            </div>
            <LandingValues />
          </div>
          {/* 데스크탑: 우측 sticky 폼 */}
          <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
            <InquiryPanel />
          </aside>
        </Container>
      </section>

      <StatsBand />

      <Section>
        <Container className="flex flex-col gap-10">
          <SectionHeader align="center" {...LANDING_PROCESS_HEADER} />
          <ProcessSteps />
        </Container>
      </Section>

      <Section bg="surface">
        <Container className="flex flex-col gap-10">
          <SectionHeader align="center" {...LANDING_PRICING_HEADER} />
          <PricingCards />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeader align="center" {...LANDING_REVIEW_HEADER} />
        </Container>
        <ReviewMarquee className="mt-10" />
      </Section>

      <DiagnosisChecklist />
      <ClosingCta />
    </>
  );
}
