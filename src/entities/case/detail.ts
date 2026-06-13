import type { Case } from "./model";

// 케이스 상세 콘텐츠 — 28개 업종 공통 템플릿.
// 업종명만 산문에 끼워 넣고, 내용은 "문의 구조 / 웹"의 일반론(상담·예약·후기·검색 노출)으로 구성한다.
// 어떤 업종에도 자연스럽고, 의료/병원 관련 표현은 절대 포함하지 않는다.
export type CaseDetail = {
  industry: string;
  image: string;
  problem: string;
  direction: string;
  expectedEffect: string;
  inquiryImprovements: string[];
};

export function getCaseDetail(caseItem: Case): CaseDetail {
  const i = caseItem.industry;
  return {
    industry: i,
    image: caseItem.image,
    problem:
      `${i} 업종은 검색으로 들어온 방문자가 가격과 이용 안내를 충분히 확인하지 못하고 이탈하는 경우가 많았습니다. ` +
      `문의 버튼이 한눈에 들어오지 않아 상담으로 이어지는 비율도 낮았습니다.`,
    direction:
      `${i}의 강점과 후기를 첫 화면에서 보여주고, 상담·예약 문의 동선을 단순하게 다시 설계했습니다. ` +
      `모바일에서 한 번에 연락할 수 있도록 카카오톡·전화 연결 버튼을 눈에 띄게 배치했습니다.`,
    expectedEffect: `방문자가 필요한 정보를 빠르게 확인하고 곧바로 문의로 이어지면서, ${i} 신규 상담 유입이 꾸준히 늘어나는 구조를 기대할 수 있습니다.`,
    inquiryImprovements: [
      "첫 화면에 문의 CTA 고정 노출",
      "카카오톡·전화 즉시 연결 버튼",
      "후기·사례 중심의 신뢰 구성",
      "모바일 1-탭 문의 동선",
      "검색 상단 노출(SEO) 연계",
    ],
  };
}
