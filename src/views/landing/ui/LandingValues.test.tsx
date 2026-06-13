import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LandingValues } from "./LandingValues";
import { LANDING_VALUES } from "../config/landingContent";

describe("LandingValues", () => {
  it("가치 카드를 정확히 7개 렌더", () => {
    expect(LANDING_VALUES).toHaveLength(7);
    render(<LandingValues />);
    for (const value of LANDING_VALUES) {
      expect(screen.getByText(value.title)).toBeInTheDocument();
    }
  });
});
