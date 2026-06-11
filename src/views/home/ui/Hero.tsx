import { Button, Chip, Container } from "@/shared/ui";
import { ROUTES } from "@/shared/config";

const CHIPS = [
  "케어 플랜 (제작·광고·운영)",
  "빠른제작 (3일~7일)",
  "합리적 비용 (가성비+퀄리티)",
] as const;

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-bg-deep">
      <div className="aurora-hero" aria-hidden />
      <div className="absolute inset-0 dot-grid opacity-60" aria-hidden />
      <div
        className="glow-orb -left-24 top-10 size-72 bg-brand-cyan/30"
        style={{ animationDelay: "0s" }}
        aria-hidden
      />
      <div
        className="glow-orb -right-16 bottom-0 size-80 bg-brand-blue/30"
        style={{ animationDelay: "-6s" }}
        aria-hidden
      />

      <Container className="relative flex flex-col items-center py-24 text-center md:py-32 lg:py-40">
        <p className="animate-fade-up text-caption font-medium tracking-tight text-text-muted md:text-body">
          랜딩&홈페이지 제작 · 광고 운영 · 검색 상단 노출 · 맞춤형 웹 솔루션
        </p>

        <h1
          className="animate-fade-up mt-5 text-balance text-hero font-bold leading-[1.08] text-text"
          style={{ animationDelay: "0.08s" }}
        >
          문의로 이어지는
          <br />
          <span className="text-gradient-brand">홈페이지</span>를 만듭니다
        </h1>

        <p
          className="animate-fade-up mt-6 max-w-2xl text-balance text-body text-text-muted"
          style={{ animationDelay: "0.16s" }}
        >
          홈페이지 제작부터 광고 연동·운영 관리까지.
          <br className="hidden sm:block" />
          단순 제작이 아닌 <span className="text-text">문의 구조</span>까지 설계합니다.
        </p>

        <div
          className="animate-fade-up mt-9 flex w-full flex-col items-center justify-center gap-3 sm:flex-row"
          style={{ animationDelay: "0.24s" }}
        >
          <Button href={ROUTES.diagnosis} variant="gradient" size="lg" className="w-full sm:w-auto">
            무료 진단 신청
          </Button>
          <Button href={ROUTES.cases} variant="outlined" size="lg" className="w-full sm:w-auto">
            성공 사례 보기
          </Button>
          <Button href={ROUTES.landing} variant="ghost" size="lg" className="w-full sm:w-auto">
            WEFLOW 랜딩 페이지
          </Button>
        </div>

        <ul
          className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-2"
          style={{ animationDelay: "0.32s" }}
        >
          {CHIPS.map((label) => (
            <li key={label}>
              <Chip variant="brand">{label}</Chip>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
