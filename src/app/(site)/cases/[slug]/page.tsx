import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CASES, getCaseBySlug, getCaseDetail } from "@/entities/case";
import { CaseDetailView } from "@/views/caseDetail";

// Next.js 16: 동적 라우트 params 는 async(Promise) — await 필수. 28개 슬러그 SSG.
export function generateStaticParams() {
  return CASES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const caseItem = getCaseBySlug(slug);
  if (!caseItem) return { title: "성공사례 | WEFLOW" };
  return { title: `${caseItem.industry} 제작 사례 | WEFLOW`, description: caseItem.summary };
}

export default async function CaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const caseItem = getCaseBySlug(slug);
  if (!caseItem) notFound();
  const detail = getCaseDetail(caseItem);
  return <CaseDetailView detail={detail} />;
}
