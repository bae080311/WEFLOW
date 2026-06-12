import { Container, Reveal, Section, SectionHeader } from "@/shared/ui";
import { ProcessSteps } from "@/widgets/processSteps";
import { PRODUCTION_STEPS_4 } from "../config/homeContent";

export function ProcessOverview() {
  return (
    // sticky 동작을 위해 overflow-hidden 을 두지 않는다(aura 는 inset-0 이라 넘치지 않음).
    <Section className="relative isolate">
      <div className="section-aura opacity-50" aria-hidden />
      <Container className="relative grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal className="flex flex-col gap-6">
            <SectionHeader as="h2" size="lg" eyebrow="HOW IT WORKS" title="제작 진행 과정" />
            <div role="list" className="relative flex flex-col gap-4 pl-12">
              <div className="spine-brand absolute bottom-3 left-5 top-3 w-px" aria-hidden />
              {PRODUCTION_STEPS_4.map((s) => (
                <div key={s.step} role="listitem" className="relative flex items-center">
                  <span className="absolute -left-12 grid size-10 place-items-center rounded-full bg-surface gradient-ring">
                    <span className="text-gradient-brand text-caption font-bold leading-none">
                      {String(s.step).padStart(2, "0")}
                    </span>
                  </span>
                  <div className="flex-1 rounded-card border border-border bg-surface/60 px-5 py-4 backdrop-blur-sm transition-colors duration-200 hover:border-brand-cyan/40">
                    <span className="text-body font-medium text-text">{s.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
        <div className="flex flex-col gap-6">
          <SectionHeader as="h2" size="md" eyebrow="6 STEPS" title="6단계 제작 프로세스" />
          <ProcessSteps className="sm:grid-cols-2 lg:grid-cols-2" />
        </div>
      </Container>
    </Section>
  );
}
