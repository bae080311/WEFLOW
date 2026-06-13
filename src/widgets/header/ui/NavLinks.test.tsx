import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NavLinks } from "./NavLinks";

describe("NavLinks", () => {
  it("6개 nav 를 requirements §2 순서로 렌더", () => {
    render(<NavLinks pathname="/" />);
    const nav = screen.getByRole("navigation", { name: "주 메뉴" });
    const hrefs = within(nav)
      .getAllByRole("link")
      .map((l) => l.getAttribute("href"));
    expect(hrefs).toEqual(["/", "/services", "/pricing", "/cases", "/reservation", "/diagnosis"]);
  });

  it("현재 경로에 aria-current=page", () => {
    render(<NavLinks pathname="/pricing" />);
    expect(screen.getByRole("link", { name: "제작플랜&가격안내" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("hover/unhover 인디케이터 핸들러가 동작한다(에러 없음)", async () => {
    render(<NavLinks pathname="/" />);
    const nav = screen.getByRole("navigation", { name: "주 메뉴" });
    const link = within(nav).getByRole("link", { name: "서비스" });
    await userEvent.hover(link);
    await userEvent.unhover(link);
    expect(link).toBeInTheDocument();
  });
});
