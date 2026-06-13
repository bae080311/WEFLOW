import {
  Check,
  MessageSquareText,
  Palette,
  Search,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
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

// 기본 4항목에 대한 아이콘 + 보조 설명(알 수 없는 항목은 Check 폴백).
const ITEM_META: Record<string, { icon: LucideIcon; description: string }> = {
  "문의 구조 진단": {
    icon: MessageSquareText,
    description: "방문자가 문의까지 가는 흐름을 점검합니다.",
  },
  "디자인 점검": {
    icon: Palette,
    description: "브랜드·가독성·신뢰도 관점에서 진단합니다.",
  },
  "검색 노출 분석": {
    icon: Search,
    description: "네이버·구글 검색 노출 상태를 분석합니다.",
  },
  "문의 개선 제안": {
    icon: TrendingUp,
    description: "전환을 높이는 구체적 개선안을 제시합니다.",
  },
};

// 무료진단 체크리스트 섹션(홈·랜딩 재사용). gradient-ring 패널 + 항목별 아이콘 카드 + 그라디언트 CTA.
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
            <div className="glow-orb -bottom-12 -left-10 size-56 bg-brand-blue/20" aria-hidden />
            <div className="relative flex flex-col items-center gap-10">
              <SectionHeader
                size="lg"
                align="center"
                eyebrow="FREE DIAGNOSIS"
                title={title}
                description={description}
              />
              <ul className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
                {items.map((item, index) => {
                  const meta = ITEM_META[item];
                  const Icon = meta?.icon ?? Check;
                  return (
                    <li key={item} className="h-full">
                      <Reveal delay={index * 80} className="h-full">
                        <div className="group flex h-full items-start gap-4 rounded-card border border-border bg-surface/70 p-5 backdrop-blur-sm transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-1 hover:border-brand-cyan/50 hover:shadow-glow">
                          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-brand text-white transition-transform duration-200 group-hover:scale-110">
                            <Icon className="size-5" aria-hidden />
                          </span>
                          <div className="flex flex-col gap-1">
                            <p className="text-body font-bold leading-snug text-text">{item}</p>
                            {meta ? (
                              <p className="text-caption text-text-muted">{meta.description}</p>
                            ) : null}
                          </div>
                        </div>
                      </Reveal>
                    </li>
                  );
                })}
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
