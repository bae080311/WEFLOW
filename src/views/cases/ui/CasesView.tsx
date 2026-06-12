import { Container, Section, SectionHeader } from "@/shared/ui";
import { CASES, CaseCard } from "@/entities/case";
import { InquiryModalButton } from "@/features/inquiryModalButton";

export function CasesView() {
  return (
    <Section>
      <Container className="flex flex-col gap-10">
        <SectionHeader
          align="center"
          eyebrow="SUCCESS CASES"
          title="다양한 업종의 성공 사례"
          description="업종별 전환 최적화 사례를 살펴보고, 우리 업종에 맞는 방향을 찾아보세요."
        />
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CASES.map((c) => (
            <li key={c.slug}>
              <CaseCard caseItem={c} />
            </li>
          ))}
        </ul>
        <div className="flex justify-center">
          <InquiryModalButton source="cases" variant="outlined" size="lg">
            더 많은 사례 문의하기
          </InquiryModalButton>
        </div>
      </Container>
    </Section>
  );
}
