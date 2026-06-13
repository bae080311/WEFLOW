import { Phone } from "lucide-react";
import { Button, Chip, Container, Reveal, Section, SectionHeader } from "@/shared/ui";
import { ReservationForm } from "@/features/reservationForm";
import { COMPANY, EXTERNAL_LINKS } from "@/shared/config";
import {
  RESERVATION_GUIDE_STEPS,
  RESERVATION_HERO,
  RESERVATION_TRUST_CHIPS,
} from "../config/reservationContent";

export function ReservationView() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-bg-deep py-16 md:py-20">
        <div className="aurora-hero" aria-hidden />
        <div className="absolute inset-0 dot-grid opacity-50" aria-hidden />
        <div className="glow-orb -right-16 -top-10 size-72 bg-brand-cyan/20" aria-hidden />
        <Container className="relative z-10 flex flex-col items-center gap-6 text-center">
          <Reveal>
            <SectionHeader as="h1" size="lg" align="center" {...RESERVATION_HERO} />
          </Reveal>
          <Reveal delay={90}>
            <ul className="flex flex-wrap justify-center gap-2">
              {RESERVATION_TRUST_CHIPS.map((chip) => (
                <li key={chip}>
                  <Chip variant="brand">{chip}</Chip>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      <Section>
        <Container className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-12">
          <aside className="flex flex-col gap-6 lg:sticky lg:top-28">
            <div className="gradient-ring rounded-card bg-gradient-card p-6 md:p-8">
              <h2 className="text-h3 text-text">예약 진행 안내</h2>
              <ol className="mt-5 flex flex-col gap-5">
                {RESERVATION_GUIDE_STEPS.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gradient-brand text-caption font-bold text-white">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-body font-medium text-text">{step.title}</p>
                      <p className="mt-1 text-caption text-text-muted">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-card border border-border bg-surface p-6">
              <p className="text-caption text-text-muted">운영시간</p>
              <p className="mt-1 text-body text-text">{COMPANY.hours}</p>
              <Button
                href={EXTERNAL_LINKS.tel}
                variant="outlined"
                size="md"
                className="mt-4 w-full"
              >
                <Phone className="size-4" aria-hidden />
                전화로 즉시 상담
              </Button>
            </div>
          </aside>

          <div className="rounded-card border border-border bg-surface p-5 sm:p-6 md:p-8">
            <h2 className="mb-6 text-h3 text-text">예약 정보 입력</h2>
            <ReservationForm />
          </div>
        </Container>
      </Section>
    </>
  );
}
