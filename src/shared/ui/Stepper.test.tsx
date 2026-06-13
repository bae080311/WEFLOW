import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Stepper } from "./Stepper";

const STEPS = ["일정 선택", "정보 입력", "확인 및 동의"];

describe("Stepper", () => {
  it("현재 단계는 번호 + aria-current, 이후 단계는 번호 표시", () => {
    const { container } = render(<Stepper steps={STEPS} current={1} />);
    expect(screen.getByText("정보 입력")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument(); // 현재
    expect(screen.getByText("3")).toBeInTheDocument(); // 이후
    expect(screen.queryByText("1")).not.toBeInTheDocument(); // 완료 → 체크
    expect(container.querySelector('[aria-current="step"]')).toBeTruthy();
  });
});
