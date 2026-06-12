import { Button, Container, Section, SectionHeader } from "@/shared/ui";
import { PricingCards } from "@/widgets/pricingCards";
import { ROUTES } from "@/shared/config";
import { PRICING_INTRO } from "../config/notes";
import { PricingNotes } from "./PricingNotes";

export function PricingView() {
  return (
    <Section>
      <Container className="flex flex-col gap-12">
        <SectionHeader align="center" {...PRICING_INTRO} />
        <PricingCards />
        <PricingNotes />
        <div className="flex justify-center">
          <Button href={ROUTES.diagnosis} variant="gradient" size="lg" className="w-full sm:w-auto">
            무료 진단 신청
          </Button>
        </div>
      </Container>
    </Section>
  );
}
