import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StatusTabs } from "./StatusTabs";

describe("StatusTabs", () => {
  it("대기/진행중/완료/전체 탭을 렌더하고 선택 상태 표시", () => {
    render(<StatusTabs value="전체" onChange={() => {}} />);
    for (const tab of ["대기", "진행중", "완료", "전체"]) {
      expect(screen.getByRole("tab", { name: tab })).toBeInTheDocument();
    }
    expect(screen.getByRole("tab", { name: "전체" })).toHaveAttribute("aria-selected", "true");
  });

  it("탭 클릭 시 onChange 호출", async () => {
    const onChange = vi.fn();
    render(<StatusTabs value="전체" onChange={onChange} />);
    await userEvent.click(screen.getByRole("tab", { name: "진행중" }));
    expect(onChange).toHaveBeenCalledWith("진행중");
  });
});
