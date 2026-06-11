import { Container } from "@/shared/ui";

// 홈 플레이스홀더 — 섹션 구현은 P4. 공통 셸/디자인 시스템 위에서 동작 확인용.
export default function HomePage() {
  return (
    <Container as="section" className="py-20">
      <h1 className="text-hero font-bold text-text">문의로 이어지는 홈페이지를 만듭니다</h1>
      <p className="mt-4 text-body text-text-muted">
        홈페이지 제작부터 광고 연동·운영 관리까지. 단순 제작이 아닌 문의 구조까지 설계합니다.
      </p>
    </Container>
  );
}
