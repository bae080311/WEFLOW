import Link from "next/link";
import { Container } from "@/shared/ui";
import {
  company,
  externalLinkAttrs,
  footerColumns,
  footerLegal,
  footerSocial,
  type FooterLink,
} from "@/shared/config";

const linkClass =
  "text-caption text-text-muted transition-colors hover:text-text active:text-brand-cyan focus-visible:text-text focus-visible:outline-none";

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
      <a href={link.href} className={linkClass} {...externalLinkAttrs}>
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
    <footer className="border-t border-border bg-bg-deep">
      <Container className="flex flex-col gap-10 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-3">
            <span className="text-h3 font-bold text-text">WEFLOW</span>
            <p className="text-caption text-text-muted">{company.tagline}</p>
          </div>

          {footerColumns.map((column) => (
            <nav key={column.title} aria-label={column.title} className="flex flex-col gap-3">
              <h2 className="text-caption font-bold text-text">{column.title}</h2>
              <ul className="flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.label}`}>
                    <FooterLinkItem link={link} />
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-1 border-t border-border pt-8 text-caption text-text-muted">
          <p>
            대표 {company.ceo} · 사업자등록번호 {company.businessNumber}
          </p>
          <p>
            이메일 {company.email} · 운영시간 {company.hours}
          </p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-4">
            {footerLegal.map((link) => (
              <Link key={link.label} href={link.href} className={linkClass}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            {footerSocial.map((social) => (
              <a key={social.label} href={social.href} className={linkClass} {...externalLinkAttrs}>
                {social.label}
              </a>
            ))}
          </div>
          <p className="text-caption text-text-subtle">{company.copyright}</p>
        </div>
      </Container>
    </footer>
  );
}
