import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Container } from "./Container";

describe("Container", () => {
  it("자식과 컨테이너 클래스를 렌더한다", () => {
    render(
      <Container data-testid="c">
        <span>내용</span>
      </Container>,
    );
    const el = screen.getByTestId("c");
    expect(el).toHaveTextContent("내용");
    expect(el).toHaveClass("mx-auto", "max-w-content", "px-5");
  });

  it("as prop 으로 태그를 교체한다", () => {
    render(<Container as="section" data-testid="c" />);
    expect(screen.getByTestId("c").tagName).toBe("SECTION");
  });

  it("caller className 을 병합한다", () => {
    render(<Container data-testid="c" className="bg-surface" />);
    expect(screen.getByTestId("c")).toHaveClass("bg-surface");
  });
});
