import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ServicesProcess } from "./ServicesProcess";
import { PROCESS_STEPS } from "@/shared/config";

describe("ServicesProcess", () => {
  it("6단계 제작 과정을 설명과 함께 렌더한다", () => {
    render(<ServicesProcess />);
    expect(screen.getByRole("heading", { name: "제작 진행 과정 6단계" })).toBeInTheDocument();
    PROCESS_STEPS.forEach((s) => {
      // 제목은 패널 + 우측 레일 두 곳에 표기됨
      expect(screen.getAllByText(s.title).length).toBeGreaterThan(0);
      expect(screen.getByText(s.description)).toBeInTheDocument();
    });
  });
});
