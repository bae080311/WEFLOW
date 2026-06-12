import { Button, Container, Section, SectionHeader } from "@/shared/ui";
import { ReviewMarquee } from "@/widgets/reviewMarquee";
import { ROUTES } from "@/shared/config";

export function ReviewSection() {
  return (
    <Section bg="deep" className="relative isolate overflow-hidden">
      <div className="section-aura opacity-50" aria-hidden />
      <Container className="relative flex flex-wrap items-end justify-between gap-4">
        <SectionHeader
          eyebrow="REVIEWS"
          title="고객 후기"
          description="WEFLOW와 함께한 사장님들의 실제 후기입니다."
        />
        <Button href={ROUTES.diagnosis} variant="ghost" size="md">
          후기 더보기 →
        </Button>
      </Container>
      <ReviewMarquee className="mt-10" />
    </Section>
  );
}
