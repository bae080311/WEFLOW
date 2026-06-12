import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProcessSteps } from "./ProcessSteps";
import { PROCESS_STEPS } from "@/shared/config";

describe("ProcessSteps", () => {
  it("6단계 제목과 설명을 모두 렌더한다", () => {
    render(<ProcessSteps />);
    expect(PROCESS_STEPS).toHaveLength(6);
    PROCESS_STEPS.forEach((s) => {
      expect(screen.getByText(s.title)).toBeInTheDocument();
      expect(screen.getByText(s.description)).toBeInTheDocument();
    });
  });
});
