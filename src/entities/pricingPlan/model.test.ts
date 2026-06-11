import { describe, it, expect } from "vitest";
import { pricingPlans } from "./model";

describe("pricingPlans", () => {
  it("총 8개 카드를 가진다 (제작3·케어3·광고2)", () => {
    expect(pricingPlans).toHaveLength(8);
    const byGroup = pricingPlans.reduce<Record<string, number>>((acc, p) => {
      acc[p.group] = (acc[p.group] ?? 0) + 1;
      return acc;
    }, {});
    expect(byGroup).toEqual({ 제작: 3, 케어: 3, 광고: 2 });
  });

  it("id 가 모두 고유하다", () => {
    const ids = pricingPlans.map((p) => p.id);
    expect(new Set(ids).size).toBe(8);
  });

  it("requirements §5 의 정가→할인가가 정확하다", () => {
    const priceOf = (id: string) => {
      const p = pricingPlans.find((x) => x.id === id)!;
      return [p.originalPrice, p.salePrice];
    };
    expect(priceOf("start")).toEqual([498000, 249000]);
    expect(priceOf("grow")).toEqual([1980000, 990000]);
    expect(priceOf("master")).toEqual([2980000, 1490000]);
    expect(priceOf("we-care")).toEqual([170000, 89000]);
    expect(priceOf("flow-care")).toEqual([378000, 189000]);
    expect(priceOf("weflow-care")).toEqual([678000, 339000]);
    expect(priceOf("naver-ad")).toEqual([298000, 149000]);
    expect(priceOf("danggn-ad")).toEqual([158000, 79000]);
  });

  it("크라운/하이라이트는 MASTER·WEFLOW CARE 에만 있다", () => {
    const crowned = pricingPlans.filter((p) => p.crown).map((p) => p.id);
    expect(crowned.sort()).toEqual(["master", "weflow-care"]);
    pricingPlans.forEach((p) => {
      expect(p.highlighted).toBe(p.crown);
    });
  });

  it("케어 플랜은 monthly=true, 제작/광고는 false 다", () => {
    pricingPlans.forEach((p) => {
      expect(p.monthly).toBe(p.group === "케어");
    });
  });

  it("모든 카드는 1개 이상의 기능(✓)을 가진다", () => {
    pricingPlans.forEach((p) => {
      expect(p.features.length).toBeGreaterThan(0);
    });
  });
});
