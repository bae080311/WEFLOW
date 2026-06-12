import { type ReactNode } from "react";
import { Check } from "lucide-react";
import { Button, Card, Container, Section, SectionHeader } from "@/shared/ui";
import { ROUTES } from "@/shared/config";
import type { CaseDetail } from "@/entities/case";

export type CaseDetailViewProps = {
  detail: CaseDetail;
};

function DetailBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-h3 text-brand-cyan">{title}</h2>
      <div className="text-body text-text-muted">{children}</div>
    </div>
  );
}

export function CaseDetailView({ detail }: CaseDetailViewProps) {
  return (
    <Section>
      <Container>
        <div className="mx-auto flex max-w-3xl flex-col gap-10">
          <SectionHeader
            as="h1"
            eyebrow="SUCCESS CASE"
            title={`${detail.industry} 제작 사례`}
            description={`${detail.industry} 업종의 문의 구조를 어떻게 개선했는지 살펴보세요.`}
          />
          <Card className="flex flex-col gap-8">
            <DetailBlock title="문제 상황">{detail.problem}</DetailBlock>
            <DetailBlock title="개선 방향">{detail.direction}</DetailBlock>
            <DetailBlock title="기대 효과">{detail.expectedEffect}</DetailBlock>
            <DetailBlock title="문의 구조 개선 포인트">
              <ul className="flex flex-col gap-2">
                {detail.inquiryImprovements.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="mt-1 size-4 shrink-0 text-brand-cyan" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </DetailBlock>
          </Card>
          <div className="flex justify-center">
            <Button
              href={ROUTES.diagnosis}
              variant="gradient"
              size="lg"
              className="w-full sm:w-auto"
            >
              무료진단 받기
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
