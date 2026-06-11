import { ROUTES } from "./routes";
import { EXTERNAL_LINKS } from "./links";
import { COMPANY } from "./company";

export type FooterLinkKind = "route" | "tel" | "mail" | "external";
export type FooterLink = { label: string; href: string; kind: FooterLinkKind };

export const FOOTER_COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "서비스",
    links: [
      { label: "홈페이지 제작 과정", href: ROUTES.services, kind: "route" },
      { label: "랜딩페이지 제작 과정", href: ROUTES.services, kind: "route" },
      { label: "광고 운영·관리 안내", href: ROUTES.services, kind: "route" },
    ],
  },
  {
    title: "WEFLOW 케어플랜",
    links: [
      { label: "WE 케어", href: ROUTES.pricing, kind: "route" },
      { label: "FLOW 케어", href: ROUTES.pricing, kind: "route" },
      { label: "WEFLOW 케어", href: ROUTES.pricing, kind: "route" },
    ],
  },
  {
    title: "상담문의",
    links: [
      { label: "전화문의", href: EXTERNAL_LINKS.tel, kind: "tel" },
      { label: "이메일 문의", href: `mailto:${COMPANY.email}`, kind: "mail" },
      { label: "카카오 채널 문의", href: EXTERNAL_LINKS.kakao, kind: "external" },
      { label: "인스타 문의", href: EXTERNAL_LINKS.instagram, kind: "external" },
      { label: "페이스북 문의", href: EXTERNAL_LINKS.facebook, kind: "external" },
    ],
  },
];

export const FOOTER_LEGAL: FooterLink[] = [
  { label: "개인정보처리방침", href: ROUTES.privacy, kind: "route" },
  { label: "이용약관", href: ROUTES.terms, kind: "route" },
];

// 하단 소셜 아이콘 행 (모두 외부 링크, 새 탭)
export const FOOTER_SOCIAL: { label: string; href: string }[] = [
  { label: "블로그", href: EXTERNAL_LINKS.blog },
  { label: "인스타그램", href: EXTERNAL_LINKS.instagram },
  { label: "페이스북", href: EXTERNAL_LINKS.facebook },
  { label: "카카오 채널", href: EXTERNAL_LINKS.kakao },
];
