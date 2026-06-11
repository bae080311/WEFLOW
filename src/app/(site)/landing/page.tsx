import { Container } from "@/shared/ui";

export default function LandingPage() {
  return (
    <Container as="section" className="py-20">
      <h1 className="text-[24px] leading-[1.3] font-bold text-text md:text-hero">
        문의로 이어지는 홈페이지를 만듭니다
      </h1>
      <p className="mt-4 text-body text-text-muted">
        기획부터 제작, 광고 연동, 운영 관리까지 WEFLOW가 함께합니다.
      </p>
    </Container>
  );
}
