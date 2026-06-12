import { Container, Section, SectionHeader } from "@/shared/ui";
import { AdOpsSystem } from "@/widgets/adOpsSystem";
import { SERVICES_ADOPS_HEADER } from "../config/servicesContent";

export function ServicesAdOps() {
  return (
    <Section bg="deep">
      <Container className="flex flex-col gap-8">
        <SectionHeader {...SERVICES_ADOPS_HEADER} />
        <AdOpsSystem />
      </Container>
    </Section>
  );
}
