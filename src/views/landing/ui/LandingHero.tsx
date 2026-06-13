import { Button, Reveal } from "@/shared/ui";
import { InquiryModalButton } from "@/features/inquiryModalButton";
import { ROUTES } from "@/shared/config";
import { LANDING_HERO } from "../config/landingContent";

export function LandingHero() {
  return (
    <div className="flex flex-col">
      <Reveal>
        <h1 className="text-balance text-h1 font-bold leading-[1.15] text-text md:text-hero md:leading-[1.1]">
          <span className="block">{LANDING_HERO.titleLead}</span>
          <span className="block">
            <span className="text-gradient-brand">{LANDING_HERO.titleHighlight}</span>
            {LANDING_HERO.titleTail}
          </span>
        </h1>
      </Reveal>
      <Reveal delay={90}>
        <p className="mt-5 max-w-xl text-balance text-body text-text-muted">
          {LANDING_HERO.subtitle}
        </p>
      </Reveal>
      <Reveal delay={170}>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <InquiryModalButton source="landing" variant="gradient" size="lg">
            무료진단 후 견적받기
          </InquiryModalButton>
          <Button href={ROUTES.cases} variant="outlined" size="lg">
            실제 제작 성공 보기
          </Button>
        </div>
      </Reveal>
    </div>
  );
}
