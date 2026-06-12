import { describe, it, expect } from "vitest";
import { REVIEWS } from "./model";

describe("REVIEWS", () => {
  it("후기 마퀴용으로 8개를 제공한다", () => {
    expect(REVIEWS).toHaveLength(8);
  });

  it("모든 후기는 필수 필드(작성자·상호·업종·문구)를 갖는다", () => {
    REVIEWS.forEach((r) => {
      expect(r.author.length).toBeGreaterThan(0);
      expect(r.business.length).toBeGreaterThan(0);
      expect(r.industry.length).toBeGreaterThan(0);
      expect(r.quote.length).toBeGreaterThan(0);
    });
  });

  it("모든 후기는 5점이다", () => {
    REVIEWS.forEach((r) => expect(r.rating).toBe(5));
  });

  it("id 가 고유하다", () => {
    expect(new Set(REVIEWS.map((r) => r.id)).size).toBe(REVIEWS.length);
  });

  it("의료/병원 관련 콘텐츠를 포함하지 않는다", () => {
    const banned = ["병원", "의원", "클리닉", "진료", "의료", "성형", "치과", "한의원"];
    REVIEWS.forEach((r) => {
      const haystack = `${r.business} ${r.industry} ${r.quote}`;
      banned.forEach((word) => expect(haystack).not.toContain(word));
    });
  });
});
