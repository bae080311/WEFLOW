import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PricingNotes } from "./PricingNotes";
import { PRICING_NOTES, PRICING_VAT_NOTE } from "../config/notes";

describe("PricingNotes", () => {
  it("VAT 포함 문구와 공통 안내 5개를 렌더한다", () => {
    render(<PricingNotes />);
    expect(PRICING_NOTES).toHaveLength(5);
    expect(screen.getByText(PRICING_VAT_NOTE)).toBeInTheDocument();
    expect(PRICING_VAT_NOTE).toMatch(/VAT 포함/);
    PRICING_NOTES.forEach((note) =>
      expect(screen.getByText(new RegExp(note.slice(0, 8)))).toBeInTheDocument(),
    );
  });
});
