import { describe, it, expect } from "vitest";
import {
  processSteps,
  deliverySteps,
  diagnosisChecklist,
  adOpsSystem,
  projectTypeOptions,
} from "./weflowContent";

describe("processSteps", () => {
  it("requirements §3-2 의 6단계를 순서대로 담는다", () => {
    expect(processSteps).toHaveLength(6);
    expect(processSteps.map((s) => s.title)).toEqual([
      "상담·진단",
      "기획·설계",
      "디자인",
      "개발·테스트",
      "SEO 상단등록",
      "광고운영·사후관리",
    ]);
  });

  it("각 단계 설명을 PDF 문구대로 담는다", () => {
    expect(processSteps[0]).toEqual({
      step: 1,
      title: "상담·진단",
      description: "업종 및 제작 방향 확인",
    });
    expect(processSteps[3].description).toBe("기능구현 최적화, 검수 및 수정 진행");
  });
});

describe("deliverySteps", () => {
  it("배송 흐름 4단계를 담는다", () => {
    expect(deliverySteps.map((s) => s.title)).toEqual([
      "고객의뢰",
      "접수 후 제작",
      "3~7일 배송완료",
      "광고 및 운영 사후관리",
    ]);
  });
});

describe("diagnosisChecklist", () => {
  it("무료진단 체크 4항목(✓4)을 담는다", () => {
    expect(diagnosisChecklist).toEqual([
      "문의 구조 진단",
      "디자인 점검",
      "검색 노출 분석",
      "문의 개선 제안",
    ]);
  });
});

describe("adOpsSystem", () => {
  it("광고 운영·사후관리 8항목을 담는다", () => {
    expect(adOpsSystem).toHaveLength(8);
    expect(adOpsSystem[0]).toBe("블로그 업로드");
    expect(adOpsSystem).toContain("사이트맵 등록");
  });
});

describe("projectTypeOptions", () => {
  it("requirements §9 제작종류 4옵션과 일치한다", () => {
    expect(projectTypeOptions).toEqual([
      "랜딩페이지 제작",
      "홈페이지 제작",
      "랜딩&홈페이지 제작",
      "기타(weflow 케어플랜)",
    ]);
  });
});
