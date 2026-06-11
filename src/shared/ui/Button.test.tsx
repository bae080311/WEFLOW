import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("기본은 type=button 인 <button> 으로 렌더한다", () => {
    render(<Button>보내기</Button>);
    const btn = screen.getByRole("button", { name: "보내기" });
    expect(btn).toHaveAttribute("type", "button");
  });

  it("href 가 있으면 링크(anchor)로 렌더한다", () => {
    render(<Button href="/diagnosis">무료진단</Button>);
    const link = screen.getByRole("link", { name: "무료진단" });
    expect(link).toHaveAttribute("href", "/diagnosis");
  });

  it("variant 별 클래스를 적용한다", () => {
    const { rerender } = render(<Button variant="gradient">a</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-gradient-brand");
    rerender(<Button variant="solid">a</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-primary");
    rerender(<Button variant="outlined">a</Button>);
    expect(screen.getByRole("button")).toHaveClass("border-border-strong");
    rerender(<Button variant="ghost">a</Button>);
    expect(screen.getByRole("button")).toHaveClass("text-text-muted");
  });

  it("size 별 높이 클래스를 적용한다", () => {
    const { rerender } = render(<Button size="sm">a</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-9");
    rerender(<Button size="md">a</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-11");
    rerender(<Button size="lg">a</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-13");
  });

  it("focus-visible ring 과 caller className 을 병합한다", () => {
    render(<Button className="custom-x">a</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveClass("custom-x");
    expect(btn.className).toContain("focus-visible:ring-brand-cyan");
  });

  it("onClick 을 호출하고, disabled 면 호출하지 않는다", async () => {
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>a</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(
      <Button onClick={onClick} disabled>
        a
      </Button>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
