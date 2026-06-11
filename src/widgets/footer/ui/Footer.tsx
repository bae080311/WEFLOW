import Link from "next/link";
import { Container } from "@/shared/ui";
import {
  COMPANY,
  EXTERNAL_LINK_ATTRS,
  FOOTER_COLUMNS,
  FOOTER_LEGAL,
  FOOTER_SOCIAL,
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
    <footer className="border-t border-border bg-bg-deep">
      <Container className="flex flex-col gap-10 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-3">
            <span className="text-h3 font-bold text-text">WEFLOW</span>
            <p className="text-caption text-text-muted">{COMPANY.tagline}</p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
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
            대표 {COMPANY.ceo} · 사업자등록번호 {COMPANY.businessNumber}
          </p>
          <p>
            이메일 {COMPANY.email} · 운영시간 {COMPANY.hours}
          </p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-4">
            {FOOTER_LEGAL.map((link) => (
              <Link key={link.label} href={link.href} className={linkClass}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            {FOOTER_SOCIAL.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className={linkClass}
                {...EXTERNAL_LINK_ATTRS}
              >
                {social.label}
              </a>
            ))}
          </div>
          <p className="text-caption text-text-subtle">{COMPANY.copyright}</p>
        </div>
      </Container>
    </footer>
  );
}
