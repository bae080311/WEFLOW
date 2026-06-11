import { describe, it, expect } from "vitest";
import { BOTTOM_CTA_ITEMS } from "./bottomCta";

describe("BOTTOM_CTA_ITEMS", () => {
  it("requirements §4 순서대로 4개 CTA 를 노출한다", () => {
    expect(BOTTOM_CTA_ITEMS.map((i) => i.label)).toEqual([
      "24시간 상담",
      "카카오톡 문의",
      "블로그",
      "무료진단",
    ]);
  });

  it("각 CTA 의 href/kind 가 §7·§8 정확값과 일치한다", () => {
    expect(BOTTOM_CTA_ITEMS).toEqual([
      { label: "24시간 상담", href: "tel:01029717280", kind: "tel" },
      { label: "카카오톡 문의", href: "http://pf.kakao.com/_xntCbX", kind: "external" },
      { label: "블로그", href: "https://m.blog.naver.com/weflowlab", kind: "external" },
      { label: "무료진단", href: "/diagnosis", kind: "route" },
    ]);
  });
});
