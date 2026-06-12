import Image from "next/image";
import Link from "next/link";
import { Card } from "@/shared/ui";
import { ROUTES } from "@/shared/config";
import { cn } from "@/shared/lib";
import type { Case } from "../model";

export type CaseCardProps = {
  caseItem: Case;
  className?: string;
};

export function CaseCard({ caseItem, className }: CaseCardProps) {
  return (
    <Card
      interactive
      className={cn("group relative flex flex-col gap-0 overflow-hidden p-0", className)}
    >
      <div className="relative aspect-4/3 w-full overflow-hidden">
        <Image
          src={caseItem.image}
          alt={`${caseItem.industry} 제작 사례`}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <div className="scrim-dark pointer-events-none absolute inset-0" aria-hidden />
      </div>
      <div className="flex flex-col gap-2 p-5">
        <h3 className="text-h3 text-text">{caseItem.industry}</h3>
        <p className="text-caption text-text-muted">{caseItem.summary}</p>
        <Link
          href={ROUTES.caseDetail(caseItem.slug)}
          className="mt-1 inline-flex w-fit items-center text-caption font-medium text-brand-cyan after:absolute after:inset-0 after:content-[''] hover:underline focus-visible:underline focus-visible:outline-none"
        >
          자세히 보기 →
        </Link>
      </div>
    </Card>
  );
}
