import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/shared/ui";
import { ROUTES } from "@/shared/config";
import { BLUR_DATA_URL, cn } from "@/shared/lib";
import type { Case } from "../model";

export type CaseCardProps = {
  caseItem: Case;
  /** 목록 내 순번(이미지 위 번호 배지) */
  index?: number;
  /** 좌우 교차 배치 — 짝수/홀수 행에서 이미지·텍스트 위치를 뒤집는다(데스크탑) */
  reverse?: boolean;
  className?: string;
};

// 좌우 교차 매거진형 가로 카드. 모바일은 이미지 위 / 텍스트 아래로 세로 스택.
export function CaseCard({ caseItem, index, reverse, className }: CaseCardProps) {
  return (
    <Card
      interactive
      className={cn(
        "group relative grid gap-0 overflow-hidden p-0 md:grid-cols-2 md:items-stretch",
        className,
      )}
    >
      <div
        className={cn(
          "relative aspect-video w-full overflow-hidden md:aspect-auto md:min-h-[16rem]",
          reverse && "md:order-2",
        )}
      >
        <Image
          src={caseItem.image}
          alt={`${caseItem.industry} 제작 사례`}
          fill
          sizes="(max-width: 768px) 100vw, 600px"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <div className="scrim-dark pointer-events-none absolute inset-0" aria-hidden />
        {index != null ? (
          <span className="absolute left-4 top-4 inline-flex items-center rounded-full border border-brand-cyan/40 bg-bg-deep/60 px-3 py-1 text-caption font-bold text-brand-cyan backdrop-blur-sm">
            {String(index + 1).padStart(2, "0")}
          </span>
        ) : null}
      </div>

      <div className="flex flex-col justify-center gap-3 p-6 md:p-8">
        <span className="inline-flex w-fit items-center gap-2 text-caption font-bold uppercase tracking-[0.18em] text-brand-cyan">
          <span className="h-px w-6 bg-gradient-brand" aria-hidden />
          SUCCESS CASE
        </span>
        <h3 className="text-h2 text-text">{caseItem.industry}</h3>
        <p className="break-keep text-body text-text-muted">{caseItem.summary}</p>
        <Link
          href={ROUTES.caseDetail(caseItem.slug)}
          className="mt-1 inline-flex w-fit items-center gap-1 text-body font-medium text-brand-cyan underline-offset-4 after:absolute after:inset-0 after:content-[''] hover:underline focus-visible:underline focus-visible:outline-none"
        >
          자세히 보기
          <ArrowRight
            className="size-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
            aria-hidden
          />
        </Link>
      </div>
    </Card>
  );
}
