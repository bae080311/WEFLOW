import { type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Button, Container, Reveal, Section, SectionHeader } from "@/shared/ui";
import { ROUTES } from "@/shared/config";
import { BLUR_DATA_URL } from "@/shared/lib";
import type { CaseDetail } from "@/entities/case";

export type CaseDetailViewProps = {
  detail: CaseDetail;
};

function DetailCard({
  step,
  title,
  children,
}: {
  step: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col gap-2 rounded-card border border-border bg-surface p-6">
      <span className="text-caption font-bold text-brand-cyan">{step}</span>
      <h2 className="text-h3 text-text">{title}</h2>
      <p className="break-keep text-body text-text-muted">{children}</p>
    </div>
  );
}

export function CaseDetailView({ detail }: CaseDetailViewProps) {
  return (
    <>
      {/* 이미지 히어로 */}
      <section className="relative isolate overflow-hidden bg-bg-deep">
        <div className="absolute inset-0" aria-hidden>
          <Image
            src={detail.image}
            alt=""
            fill
            priority
            sizes="100vw"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover"
          />
          <div className="scrim-dark-strong absolute inset-0" />
          <div className="absolute inset-0 dot-grid opacity-30" />
        </div>
        <Container className="relative z-10 flex min-h-[44vh] flex-col justify-end gap-5 py-12 md:min-h-[52vh] md:py-16">
          <Link
            href={ROUTES.cases}
            className="inline-flex w-fit items-center gap-1.5 rounded-control text-caption text-text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
          >
            <ArrowLeft className="size-4" aria-hidden />
            성공사례 전체
          </Link>
          <SectionHeader
            as="h1"
            size="lg"
            eyebrow="SUCCESS CASE"
            title={`${detail.industry} 제작 사례`}
            description={`${detail.industry} 업종의 문의 구조를 어떻게 개선했는지 살펴보세요.`}
          />
        </Container>
      </section>

      {/* 콘텐츠 */}
      <Section>
        <Container className="flex max-w-4xl flex-col gap-6">
          <div className="grid gap-5 md:grid-cols-3">
            <Reveal className="h-full">
              <DetailCard step="01" title="문제 상황">
                {detail.problem}
              </DetailCard>
            </Reveal>
            <Reveal delay={90} className="h-full">
              <DetailCard step="02" title="개선 방향">
                {detail.direction}
              </DetailCard>
            </Reveal>
            <Reveal delay={180} className="h-full">
              <DetailCard step="03" title="기대 효과">
                {detail.expectedEffect}
              </DetailCard>
            </Reveal>
          </div>

          <Reveal>
            <div className="gradient-ring relative isolate overflow-hidden rounded-card bg-gradient-card p-6 md:p-8">
              <div className="glow-orb -right-10 -top-10 size-48 bg-brand-cyan/15" aria-hidden />
              <h2 className="relative text-h3 text-text">문의 구조 개선 포인트</h2>
              <ul className="relative mt-5 grid gap-3 sm:grid-cols-2">
                {detail.inquiryImprovements.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-gradient-brand text-white">
                      <Check className="size-3.5" aria-hidden />
                    </span>
                    <span className="break-keep text-body text-text">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <div className="flex justify-center pt-2">
            <Button
              href={ROUTES.diagnosis}
              variant="gradient"
              size="lg"
              className="w-full sm:w-auto"
            >
              무료진단 받기
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
