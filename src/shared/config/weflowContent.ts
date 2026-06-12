import type { ProjectType } from "../types";

export type ProcessStep = { step: number; title: string; description: string };

export const PROCESS_STEPS: ProcessStep[] = [
  { step: 1, title: "상담·진단", description: "업종 및 제작 방향 확인" },
  { step: 2, title: "기획·설계", description: "문의 구조 및 전략 설계" },
  { step: 3, title: "디자인", description: "브랜드 맞춤 화면 구성" },
  { step: 4, title: "개발·테스트", description: "기능구현 최적화, 검수 및 수정 진행" },
  { step: 5, title: "SEO 상단등록", description: "네이버·구글·사이트맵 등록" },
  { step: 6, title: "광고운영·사후관리", description: "인스타·블로그·네이버 키워드 광고 운영관리" },
];

export type DeliveryStep = { step: number; title: string };

export const DELIVERY_STEPS: DeliveryStep[] = [
  { step: 1, title: "고객의뢰" },
  { step: 2, title: "접수 후 제작" },
  { step: 3, title: "3~7일 배송완료" },
  { step: 4, title: "광고 및 운영 사후관리" },
];

export const DIAGNOSIS_CHECKLIST: string[] = [
  "문의 구조 진단",
  "디자인 점검",
  "검색 노출 분석",
  "문의 개선 제안",
];

// WEFLOW 케어플랜 혜택 6칸 (홈·랜딩 재사용) — 제목 + 보조 설명
export type CareBenefit = { title: string; description: string };

export const CARE_BENEFIT_ITEMS: CareBenefit[] = [
  { title: "WEFLOW 케어플랜", description: "제작·운영·광고·관리 올인원 케어" },
  { title: "제작 + 운영 + 광고 + 관리 원터치", description: "한 팀이 처음부터 끝까지 책임집니다" },
  { title: "빠른 제작 3~7일", description: "로켓배송처럼 빠르게 오픈합니다" },
  { title: "합리적 가성비", description: "거품 없는 합리적 비용으로 시작" },
  { title: "24시간 상담대기", description: "언제든 빠른 상담과 피드백" },
  { title: "운영·광고 사후관리", description: "오픈 후 성과까지 지속 관리" },
];

// 기존 소비처/테스트 호환용 제목 목록(파생)
export const CARE_BENEFITS: string[] = CARE_BENEFIT_ITEMS.map((b) => b.title);

// 광고 운영·사후관리 시스템 — 두 그룹(채널 업로드 / 검색 상단 노출) + 플랫폼 아이콘 키
export type AdOpsIconKey =
  | "blog"
  | "instagram"
  | "threads"
  | "naver-keyword"
  | "danggn"
  | "naver-seo"
  | "google"
  | "sitemap";

export type AdOpsItem = { label: string; icon: AdOpsIconKey };
export type AdOpsGroup = { title: string; items: AdOpsItem[] };

export const AD_OPS_GROUPS: AdOpsGroup[] = [
  {
    title: "채널 업로드",
    items: [
      { label: "블로그 업로드", icon: "blog" },
      { label: "인스타 업로드", icon: "instagram" },
      { label: "스레드 업로드", icon: "threads" },
      { label: "네이버 키워드 업로드", icon: "naver-keyword" },
      { label: "당근플레이스 키워드 업로드", icon: "danggn" },
    ],
  },
  {
    title: "검색 상단 노출",
    items: [
      { label: "네이버 서치어드바이저 상단등록", icon: "naver-seo" },
      { label: "구글 콘솔 상단등록", icon: "google" },
      { label: "사이트맵 등록", icon: "sitemap" },
    ],
  },
];

// 기존 소비처/테스트 호환용 평탄 목록(파생)
export const AD_OPS_SYSTEM: string[] = AD_OPS_GROUPS.flatMap((g) => g.items.map((i) => i.label));

export const PROJECT_TYPE_OPTIONS: readonly ProjectType[] = [
  "랜딩페이지 제작",
  "홈페이지 제작",
  "랜딩&홈페이지 제작",
  "기타(weflow 케어플랜)",
];
