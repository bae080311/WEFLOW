import { describe, it, expect } from "vitest";
import { ROUTES, NAV_ITEMS } from "./routes";

describe("ROUTES", () => {
  it("하네스 기준 슬러그를 정확히 사용한다", () => {
    expect(ROUTES.home).toBe("/");
    expect(ROUTES.services).toBe("/services"); // 복수
    expect(ROUTES.pricing).toBe("/pricing");
    expect(ROUTES.cases).toBe("/cases");
    expect(ROUTES.reservation).toBe("/reservation");
    expect(ROUTES.diagnosis).toBe("/diagnosis");
    expect(ROUTES.landing).toBe("/landing");
    expect(ROUTES.admin).toBe("/admin");
    expect(ROUTES.privacy).toBe("/privacy");
    expect(ROUTES.terms).toBe("/terms");
  });

  it("케이스 상세를 [slug] 로 만든다", () => {
    expect(ROUTES.caseDetail("pt-shop")).toBe("/cases/pt-shop");
  });
});

describe("NAV_ITEMS", () => {
  it("requirements §2 순서로 6개 네비를 노출한다", () => {
    expect(NAV_ITEMS.map((n) => n.href)).toEqual([
      "/",
      "/services",
      "/pricing",
      "/cases",
      "/reservation",
      "/diagnosis",
    ]);
  });
});
