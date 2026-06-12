import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProcessOverview } from "./ProcessOverview";
import { PROCESS_STEPS } from "@/shared/config";
import { PRODUCTION_STEPS_4 } from "../config/homeContent";

describe("ProcessOverview", () => {
  it("제작 진행 과정 4단계와 6단계 프로세스를 나란히 렌더한다", () => {
    render(<ProcessOverview />);
    expect(screen.getByRole("heading", { name: "제작 진행 과정" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "6단계 제작 프로세스" })).toBeInTheDocument();
    PRODUCTION_STEPS_4.forEach((s) => expect(screen.getByText(s.title)).toBeInTheDocument());
    PROCESS_STEPS.forEach((s) => expect(screen.getByText(s.title)).toBeInTheDocument());
  });
});
