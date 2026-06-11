import { ROUTES } from "./routes";
import { EXTERNAL_LINKS } from "./links";

export type BottomCtaKind = "tel" | "external" | "route";
export type BottomCtaItem = { label: string; href: string; kind: BottomCtaKind };

export const BOTTOM_CTA_ITEMS: BottomCtaItem[] = [
  { label: "24시간 상담", href: EXTERNAL_LINKS.tel, kind: "tel" },
  { label: "카카오톡 문의", href: EXTERNAL_LINKS.kakao, kind: "external" },
  { label: "블로그", href: EXTERNAL_LINKS.blog, kind: "external" },
  { label: "무료진단", href: ROUTES.diagnosis, kind: "route" },
];
