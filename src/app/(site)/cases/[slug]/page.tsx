import { Container } from "@/shared/ui";

// Next.js 16: 동적 라우트 params 는 async(Promise) — await 필수. SSG(generateStaticParams)는 P4.
export default async function CaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <Container as="section" className="py-20">
      <h1 className="text-h1 font-bold text-text">성공사례 상세</h1>
      <p className="mt-2 text-body text-text-muted">{slug}</p>
    </Container>
  );
}
