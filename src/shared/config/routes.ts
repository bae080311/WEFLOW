export const ROUTES = {
  home: "/",
  services: "/services",
  pricing: "/pricing",
  cases: "/cases",
  caseDetail: (slug: string) => `/cases/${slug}`,
  reservation: "/reservation",
  diagnosis: "/diagnosis",
  landing: "/landing",
  admin: "/admin",
  privacy: "/privacy",
  terms: "/terms",
} as const;

export const NAV_ITEMS = [
  { label: "홈", href: ROUTES.home },
  { label: "서비스", href: ROUTES.services },
  { label: "제작플랜&가격안내", href: ROUTES.pricing },
  { label: "성공사례", href: ROUTES.cases },
  { label: "예약", href: ROUTES.reservation },
  { label: "무료진단받기", href: ROUTES.diagnosis },
] as const;
