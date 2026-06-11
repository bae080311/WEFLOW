import { describe, it, expect } from "vitest";
import { routes, navItems } from "./routes";

describe("routes", () => {
  it("하네스 기준 슬러그를 정확히 사용한다", () => {
    expect(routes.home).toBe("/");
    expect(routes.services).toBe("/services"); // 복수
    expect(routes.pricing).toBe("/pricing");
    expect(routes.cases).toBe("/cases");
    expect(routes.reservation).toBe("/reservation");
    expect(routes.diagnosis).toBe("/diagnosis");
    expect(routes.landing).toBe("/landing");
    expect(routes.admin).toBe("/admin");
    expect(routes.privacy).toBe("/privacy");
    expect(routes.terms).toBe("/terms");
  });

  it("케이스 상세를 [slug] 로 만든다", () => {
    expect(routes.caseDetail("pt-shop")).toBe("/cases/pt-shop");
  });
});

describe("navItems", () => {
  it("requirements §2 순서로 6개 네비를 노출한다", () => {
    expect(navItems.map((n) => n.href)).toEqual([
      "/",
      "/services",
      "/pricing",
      "/cases",
      "/reservation",
      "/diagnosis",
    ]);
  });
});
