// Next.js 16: 동적 라우트 params 는 async(Promise) — await 필수.
export default async function CaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <main>
      <h1>성공사례 상세</h1>
      <p>{slug}</p>
    </main>
  );
}
