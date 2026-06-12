export type ValueCard = { title: string; description: string };

// 히어로 아래 핵심 가치 3카드 (첫 카드는 비대칭 레이아웃의 featured)
export const VALUE_CARDS: ValueCard[] = [
  {
    title: "케어 플랜",
    description: "제작·광고·운영을 한 팀이 책임지는 올인원 케어로, 출시 후가 더 든든합니다.",
  },
  {
    title: "빠른 제작",
    description: "랜딩 3~4일, 홈페이지 약 1주. 기다림 없이 빠르게 문을 엽니다.",
  },
  {
    title: "합리적 비용",
    description: "가성비와 퀄리티를 동시에. 거품 없는 합리적 견적으로 시작하세요.",
  },
];

// 성공사례 요약에 노출할 5개 업종 (카센터 → 자동차 디테일링)
export const CASE_SUMMARY_SLUGS = [
  "pt-shop",
  "pilates",
  "insurance",
  "car-detailing",
  "smb-homepage",
] as const;

export type ProductionStep = { step: number; title: string };

// 홈 "제작 진행 과정" 4단계 (배송 흐름 DELIVERY_STEPS 와 문구가 달라 별도 보관)
export const PRODUCTION_STEPS_4: ProductionStep[] = [
  { step: 1, title: "고객 상담" },
  { step: 2, title: "협의 후 제작" },
  { step: 3, title: "3~7일 완료" },
  { step: 4, title: "광고 및 운영 사후 관리" },
];
