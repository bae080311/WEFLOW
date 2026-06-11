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

export const AD_OPS_SYSTEM: string[] = [
  "블로그 업로드",
  "인스타 업로드",
  "스레드 업로드",
  "네이버 키워드 업로드",
  "당근플레이스 키워드 업로드",
  "네이버 서치어드바이저 상단등록",
  "구글 콘솔 상단등록",
  "사이트맵 등록",
];

export const PROJECT_TYPE_OPTIONS: readonly ProjectType[] = [
  "랜딩페이지 제작",
  "홈페이지 제작",
  "랜딩&홈페이지 제작",
  "기타(weflow 케어플랜)",
];
