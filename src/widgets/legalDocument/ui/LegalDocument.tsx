import { Container, Section, SectionHeader } from "@/shared/ui";
import { COMPANY, type LegalDocumentData } from "@/shared/config";

// 개인정보처리방침·이용약관 공용 렌더(데이터만 교체해 재사용).
export function LegalDocument({ title, effectiveDate, intro, sections }: LegalDocumentData) {
  return (
    <Section>
      <Container className="max-w-3xl">
        <SectionHeader as="h1" title={title} description={`시행일: ${effectiveDate}`} />
        {intro ? <p className="mt-6 break-keep text-body text-text-muted">{intro}</p> : null}

        <div className="mt-10 flex flex-col gap-8">
          {sections.map((section, index) => (
            <section key={section.heading}>
              <h2 className="text-h3 text-text">{`${index + 1}. ${section.heading}`}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="mt-3 break-keep text-body text-text-muted">
                  {paragraph}
                </p>
              ))}
              {section.items ? (
                <ul className="mt-3 flex flex-col gap-2">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-2 break-keep text-body text-text-muted">
                      <span className="text-brand-cyan" aria-hidden>
                        •
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-card border border-border bg-surface p-6 text-caption text-text-muted">
          <p>
            {COMPANY.name} · 대표 {COMPANY.ceo}
          </p>
          <p>사업자등록번호 {COMPANY.businessNumber}</p>
          <p>이메일 {COMPANY.email}</p>
          <p>운영시간 {COMPANY.hours}</p>
        </div>
      </Container>
    </Section>
  );
}
