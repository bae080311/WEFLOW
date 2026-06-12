import { Container, Reveal, Section, SectionHeader } from "@/shared/ui";
import { CareBenefits } from "@/widgets/careBenefits";
import { DeliveryFlow } from "@/widgets/deliveryFlow";

export function CarePlanSection() {
  return (
    <Section bg="surface" className="relative isolate overflow-hidden">
      <div className="section-aura opacity-70" aria-hidden />
      <Container className="relative flex flex-col gap-12">
        <SectionHeader
          size="lg"
          align="center"
          eyebrow="WEFLOW CARE PLAN"
          title="WEFLOW 케어플랜 혜택"
          description="제작부터 운영·광고·관리까지 한 번에 진행합니다."
        />
        <CareBenefits />
        <Reveal className="flex flex-col gap-6">
          <div className="divider-brand mx-auto w-24" aria-hidden />
          <DeliveryFlow />
        </Reveal>
      </Container>
    </Section>
  );
}
