import { Check } from "lucide-react";
import { Button, Container, Reveal, Section, SectionHeader } from "@/shared/ui";
import { DIAGNOSIS_CHECKLIST, ROUTES } from "@/shared/config";

export type DiagnosisChecklistProps = {
  items?: string[];
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
};

// 무료진단 체크리스트 섹션(홈·랜딩 재사용). gradient-ring 패널 + 체크 4개 + 그라디언트 CTA.
export function DiagnosisChecklist({
  items = DIAGNOSIS_CHECKLIST,
  title = "무료진단 받기",
  description = "지금 바로 무료 진단받고, 사이트의 숨겨진 잠재력을 발견하세요.",
  ctaLabel = "무료진단 후 견적 받기",
  ctaHref = ROUTES.diagnosis,
  className,
}: DiagnosisChecklistProps) {
  return (
    <Section bg="surface" className={className}>
      <Container>
        <Reveal>
          <div className="gradient-ring relative isolate overflow-hidden rounded-card bg-gradient-card p-8 md:p-12">
            <div className="glow-orb -right-10 -top-10 size-56 bg-brand-cyan/20" aria-hidden />
            <div className="relative flex flex-col items-center gap-8">
              <SectionHeader
                size="lg"
                align="center"
                eyebrow="FREE DIAGNOSIS"
                title={title}
                description={description}
              />
              <ul className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
                {items.map((item, idx) => (
                  <li key={item}>
                    <Reveal
                      delay={idx * 70}
                      className="flex items-center gap-3 rounded-control border border-border bg-surface/60 px-4 py-3 text-body text-text backdrop-blur-sm transition-colors duration-200 hover:border-brand-cyan/40"
                    >
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-gradient-brand text-white">
                        <Check className="size-4" aria-hidden />
                      </span>
                      <span>{item}</span>
                    </Reveal>
                  </li>
                ))}
              </ul>
              <Button href={ctaHref} variant="gradient" size="lg" className="w-full sm:w-auto">
                {ctaLabel}
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
