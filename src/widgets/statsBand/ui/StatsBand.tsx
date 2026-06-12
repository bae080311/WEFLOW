import { Container, CountUp, Reveal, Section } from "@/shared/ui";
import { cn } from "@/shared/lib";

export type Stat = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

// 홈/랜딩 신뢰 지표 — 토스식 대형 카운트업 숫자 띠.
export const HOME_STATS: Stat[] = [
  { value: 7, suffix: "일", label: "평균 3~7일 제작 완료" },
  { value: 28, suffix: "+", label: "다양한 업종 성공사례" },
  { value: 8, suffix: "단계", label: "광고 운영·사후관리 시스템" },
  { value: 24, suffix: "시간", label: "연중무휴 상담 대기" },
];

export type StatsBandProps = {
  stats?: Stat[];
  className?: string;
};

export function StatsBand({ stats = HOME_STATS, className }: StatsBandProps) {
  return (
    <Section bg="deep" className={cn("relative isolate overflow-hidden", className)}>
      <div className="section-aura opacity-50" aria-hidden />
      <Container className="relative">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-border bg-border lg:grid-cols-4">
          {stats.map((stat, idx) => (
            <Reveal key={stat.label} delay={idx * 90}>
              <div className="flex h-full flex-col items-center gap-2 bg-bg-deep px-6 py-8 text-center">
                <div className="flex items-baseline text-hero font-bold leading-none">
                  {stat.prefix ? <span className="text-gradient-brand">{stat.prefix}</span> : null}
                  <CountUp value={stat.value} className="text-gradient-brand" />
                  {stat.suffix ? <span className="text-gradient-brand">{stat.suffix}</span> : null}
                </div>
                <p className="text-caption text-text-muted md:text-body">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
