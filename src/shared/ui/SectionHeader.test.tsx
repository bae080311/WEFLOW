import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionHeader } from "./SectionHeader";

describe("SectionHeader", () => {
  it("title 을 heading 으로 렌더한다", () => {
    render(<SectionHeader title="성공 사례" />);
    expect(screen.getByRole("heading", { name: "성공 사례" })).toBeInTheDocument();
  });

  it("as prop 으로 heading 레벨을 바꾼다", () => {
    render(<SectionHeader as="h1" title="제목" />);
    expect(screen.getByRole("heading", { level: 1, name: "제목" })).toBeInTheDocument();
  });

  it("eyebrow / description 은 있을 때만 렌더한다", () => {
    const { rerender } = render(<SectionHeader title="t" />);
    expect(screen.queryByText("아이브로우")).not.toBeInTheDocument();
    expect(screen.queryByText("설명")).not.toBeInTheDocument();
    rerender(<SectionHeader title="t" eyebrow="아이브로우" description="설명" />);
    expect(screen.getByText("아이브로우")).toBeInTheDocument();
    expect(screen.getByText("설명")).toBeInTheDocument();
  });

  it("center 정렬 클래스를 적용한다", () => {
    render(<SectionHeader title="t" align="center" />);
    expect(screen.getByRole("heading").parentElement).toHaveClass("text-center");
  });
});
