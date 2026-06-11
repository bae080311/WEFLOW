import { readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";
import { CASES, getCaseBySlug } from "./model";

describe("CASES", () => {
  it("requirements §6 의 28개 업종을 담는다", () => {
    expect(CASES).toHaveLength(28);
  });

  it("slug 가 모두 고유하고 URL-safe 다", () => {
    const slugs = CASES.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(28);
    slugs.forEach((slug) => expect(slug).toMatch(/^[a-z0-9-]+$/));
  });

  it("이미지 경로가 /cases_*.jpg 형식이다", () => {
    CASES.forEach((c) => {
      expect(c.image).toMatch(/^\/cases_.+\.jpg$/);
    });
  });

  it("모든 케이스 이미지가 public/ 에 실제로 존재한다 (NFC 정규화 비교)", () => {
    const files = new Set(
      readdirSync(join(process.cwd(), "public")).map((f) => f.normalize("NFC")),
    );
    CASES.forEach((c) => {
      const filename = c.image.replace(/^\//, "").normalize("NFC");
      expect(files.has(filename)).toBe(true);
    });
  });

  it("getCaseBySlug 가 slug 로 케이스를 찾고, 없으면 undefined 를 반환한다", () => {
    expect(getCaseBySlug("pt-shop")?.industry).toBe("PT샵");
    expect(getCaseBySlug("nope")).toBeUndefined();
  });
});
