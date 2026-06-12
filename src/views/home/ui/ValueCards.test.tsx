import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ValueCards } from "./ValueCards";
import { VALUE_CARDS } from "../config/homeContent";

describe("ValueCards", () => {
  it("핵심 가치 3카드를 렌더한다", () => {
    render(<ValueCards />);
    expect(VALUE_CARDS).toHaveLength(3);
    VALUE_CARDS.forEach((card) => {
      expect(screen.getByRole("heading", { name: card.title })).toBeInTheDocument();
      expect(screen.getByText(card.description)).toBeInTheDocument();
    });
  });
});
