import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("pill(rounded-full) 형태로 자식을 렌더한다", () => {
    render(<Badge>신규</Badge>);
    const el = screen.getByText("신규");
    expect(el).toHaveClass("rounded-full");
  });

  it("variant 클래스를 적용한다", () => {
    const { rerender } = render(<Badge variant="brand">b</Badge>);
    expect(screen.getByText("b")).toHaveClass("text-brand-cyan");
    rerender(<Badge variant="success">b</Badge>);
    expect(screen.getByText("b")).toHaveClass("text-success");
    rerender(<Badge variant="warning">b</Badge>);
    expect(screen.getByText("b")).toHaveClass("text-warning");
    rerender(<Badge variant="danger">b</Badge>);
    expect(screen.getByText("b")).toHaveClass("text-danger");
  });
});
