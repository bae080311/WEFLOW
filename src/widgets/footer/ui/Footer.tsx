import Link from "next/link";
import { Button, Container } from "@/shared/ui";
import {
  COMPANY,
  EXTERNAL_LINK_ATTRS,
  FOOTER_COLUMNS,
  FOOTER_LEGAL,
  FOOTER_SOCIAL,
  ROUTES,
  type FooterLink,
} from "@/shared/config";

const linkClass =
  "text-caption text-text-muted transition-colors hover:text-text active:text-brand-cyan focus-visible:text-text focus-visible:outline-none";

const socialPillClass =
  "inline-flex items-center rounded-control border border-border bg-surface/60 px-3 py-2 text-caption text-text-muted transition-colors hover:border-brand-cyan/40 hover:text-text active:scale-[0.98] focus-visible:border-brand-cyan focus-visible:text-text focus-visible:outline-none";

function FooterLinkItem({ link }: { link: FooterLink }) {
  if (link.kind === "route") {
    return (
      <Link href={link.href} className={linkClass}>
        {link.label}
      </Link>
    );
  }
  if (link.kind === "external") {
    return (
      <a href={link.href} className={linkClass} {...EXTERNAL_LINK_ATTRS}>
        {link.label}
      </a>
    );
  }
  return (
    <a href={link.href} className={linkClass}>
      {link.label}
    </a>
  );
}

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-border bg-bg-deep">
      <div className="section-aura opacity-50" aria-hidden />
      <Container className="relative flex flex-col gap-12 py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.55fr)] lg:gap-16">
          <div className="flex flex-col gap-5">
            <Link
              href={ROUTES.home}
              className="w-fit text-h1 font-bold tracking-tight text-text transition-opacity hover:opacity-80 focus-visible:opacity-80 focus-visible:outline-none"
            >
              <span className="text-gradient-brand">WE</span>FLOW
            </Link>
            <p className="max-w-xs text-body text-text-muted">{COMPANY.tagline}</p>
            <Button href={ROUTES.diagnosis} variant="gradient" size="md" className="w-fit">
              무료 진단 받기
            </Button>
            <ul className="flex flex-wrap gap-2 pt-1">
              {FOOTER_SOCIAL.map((social) => (
                <li key={social.label}>
                  <a href={social.href} className={socialPillClass} {...EXTERNAL_LINK_ATTRS}>
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
            {FOOTER_COLUMNS.map((column) => (
              <nav key={column.title} aria-label={column.title} className="flex flex-col gap-3">
                <h2 className="text-caption font-bold text-text">{column.title}</h2>
                <ul className="flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.label}`}>
                      <FooterLinkItem link={link} />
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="divider-brand" aria-hidden />

        <dl className="flex flex-col gap-2 text-caption text-text-muted sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2">
          <div className="flex gap-1">
            <dt>대표 :</dt>
            <dd className="text-text">{COMPANY.ceo}</dd>
          </div>
          <div className="flex gap-1">
            <dt>사업자등록번호 :</dt>
            <dd className="text-text">{COMPANY.businessNumber}</dd>
          </div>
          <div className="flex gap-1">
            <dt>이메일 :</dt>
            <dd className="text-text">{COMPANY.email}</dd>
          </div>
          <div className="flex gap-1">
            <dt>운영시간 :</dt>
            <dd className="text-text">{COMPANY.hours}</dd>
          </div>
        </dl>

        <div className="flex flex-col gap-4 border-t border-border pt-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-4">
            {FOOTER_LEGAL.map((link) => (
              <Link key={link.label} href={link.href} className={linkClass}>
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-caption text-text-subtle">{COMPANY.copyright}</p>
        </div>
      </Container>
    </footer>
  );
}
