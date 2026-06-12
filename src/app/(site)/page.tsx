import { DiagnosisChecklist } from "@/widgets/diagnosisChecklist";
import { StatsBand } from "@/widgets/statsBand";
import { ClosingCta } from "@/widgets/closingCta";
import {
  Hero,
  ValueCards,
  CarePlanSection,
  CaseSummary,
  ProcessOverview,
  ReviewSection,
} from "@/views/home";

// 홈 (§3-1) — 히어로 + 신뢰지표 + 핵심가치 + 케어플랜 혜택 + 성공사례 + 제작과정 + 무료진단 + 후기 + 마감 CTA.
export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBand />
      <ValueCards />
      <CarePlanSection />
      <CaseSummary />
      <ProcessOverview />
      <DiagnosisChecklist />
      <ReviewSection />
      <ClosingCta />
    </>
  );
}
