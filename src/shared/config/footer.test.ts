import { describe, it, expect } from "vitest";
import { footerColumns, footerLegal, footerSocial } from "./footer";
import { externalLinks } from "./links";

describe("footerColumns", () => {
  it("requirements §4 의 3개 컬럼을 정확한 제목으로 노출한다", () => {
    expect(footerColumns.map((c) => c.title)).toEqual(["서비스", "WEFLOW 케어플랜", "상담문의"]);
  });

  it("상담문의 컬럼은 5개 링크를 가진다", () => {
    const contact = footerColumns.find((c) => c.title === "상담문의")!;
    expect(contact.links).toHaveLength(5);
    expect(contact.links.map((l) => l.label)).toEqual([
      "전화문의",
      "이메일 문의",
      "카카오 채널 문의",
      "인스타 문의",
      "페이스북 문의",
    ]);
  });

  it("모든 링크는 dead(#/빈값) 가 아니다", () => {
    const all = [...footerColumns.flatMap((c) => c.links), ...footerLegal];
    for (const link of all) {
      expect(link.href).toBeTruthy();
      expect(link.href).not.toBe("#");
    }
  });

  it("이메일 문의는 mailto, 외부 링크는 §7 값과 일치한다", () => {
    const contact = footerColumns.find((c) => c.title === "상담문의")!;
    expect(contact.links.find((l) => l.label === "이메일 문의")!.href).toBe(
      "mailto:contact@weflowlab.kr",
    );
    expect(contact.links.find((l) => l.label === "카카오 채널 문의")!.href).toBe(
      externalLinks.kakao,
    );
  });
});

describe("footerLegal", () => {
  it("개인정보처리방침/이용약관을 실제 라우트로 연결한다", () => {
    expect(footerLegal.map((l) => [l.label, l.href])).toEqual([
      ["개인정보처리방침", "/privacy"],
      ["이용약관", "/terms"],
    ]);
  });
});

describe("footerSocial", () => {
  it("소셜 링크가 §7 외부 URL 과 일치한다", () => {
    const byLabel = Object.fromEntries(footerSocial.map((s) => [s.label, s.href]));
    expect(byLabel["블로그"]).toBe(externalLinks.blog);
    expect(byLabel["인스타그램"]).toBe(externalLinks.instagram);
    expect(byLabel["페이스북"]).toBe(externalLinks.facebook);
    expect(byLabel["카카오 채널"]).toBe(externalLinks.kakao);
  });
});
