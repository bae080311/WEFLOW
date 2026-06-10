import { describe, it, expect } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("truthy 클래스명을 합친다", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("falsy 값은 버린다", () => {
    expect(cn("a", false, null, undefined, 0 as unknown as string, "b")).toBe("a b");
  });

  it("조건부 객체 문법을 적용한다", () => {
    expect(cn("base", { active: true, hidden: false })).toBe("base active");
  });

  it("충돌하는 Tailwind 유틸은 마지막이 이긴다", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-text", "text-text-muted")).toBe("text-text-muted");
  });

  it("인자가 없으면 빈 문자열", () => {
    expect(cn()).toBe("");
  });
});
