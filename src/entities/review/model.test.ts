import { describe, it, expect } from "vitest";
import { reviews } from "./model";

describe("reviews", () => {
  it("후기 마퀴용으로 5개 이상 제공한다", () => {
    expect(reviews.length).toBeGreaterThanOrEqual(5);
  });

  it("모든 후기는 5점이다", () => {
    reviews.forEach((r) => expect(r.rating).toBe(5));
  });

  it("id 가 고유하다", () => {
    expect(new Set(reviews.map((r) => r.id)).size).toBe(reviews.length);
  });

  it("의료/병원 관련 콘텐츠를 포함하지 않는다", () => {
    const banned = ["병원", "의원", "클리닉", "진료", "의료", "성형", "치과", "한의원"];
    reviews.forEach((r) => {
      const haystack = `${r.business} ${r.industry} ${r.quote}`;
      banned.forEach((word) => expect(haystack).not.toContain(word));
    });
  });
});
