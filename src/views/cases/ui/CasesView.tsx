import { Container, Reveal, Section, SectionHeader } from "@/shared/ui";
import { CASES, CaseCard } from "@/entities/case";
import { InquiryModalButton } from "@/features/inquiryModalButton";

export function CasesView() {
  return (
    <>
      {/* 히어로 */}
      <section className="relative isolate overflow-hidden bg-bg-deep py-16 md:py-24">
        <div className="aurora-hero" aria-hidden />
        <div className="absolute inset-0 dot-grid opacity-50" aria-hidden />
        <div className="glow-orb -left-20 top-0 size-72 bg-brand-cyan/20" aria-hidden />
        <Container className="relative z-10 flex flex-col items-center text-center">
          <Reveal>
            <SectionHeader
              as="h1"
              size="lg"
              align="center"
              eyebrow="SUCCESS CASES"
              title="다양한 업종의 성공 사례"
              description="어디서도 볼 수 없는 업종별 전환 최적화 사례를 직접 확인하세요."
            />
          </Reveal>
          <Reveal delay={120}>
            <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand-cyan/40 bg-surface/60 px-4 py-1.5 text-caption font-medium text-brand-cyan backdrop-blur-sm">
              총 {CASES.length}개 업종 제작 사례
            </span>
          </Reveal>
        </Container>
      </section>

      {/* 1열 교차 배치 카드 리스트 */}
      <Section>
        <Container className="flex flex-col gap-10">
          <ul className="mx-auto flex w-full max-w-5xl flex-col gap-6">
            {CASES.map((c, index) => (
              <li key={c.slug}>
                <Reveal>
                  <CaseCard caseItem={c} index={index} reverse={index % 2 === 1} />
                </Reveal>
              </li>
            ))}
          </ul>
          <div className="flex justify-center">
            <InquiryModalButton source="cases" variant="outlined" size="lg">
              더보기
            </InquiryModalButton>
          </div>
        </Container>
      </Section>
    </>
  );
}
