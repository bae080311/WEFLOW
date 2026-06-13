import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StatusControl } from "./StatusControl";

function setup(status: "대기" | "진행중" | "완료" = "대기") {
  const handlers = { onProgress: vi.fn(), onComplete: vi.fn(), onDelete: vi.fn() };
  render(<StatusControl status={status} {...handlers} />);
  return handlers;
}

describe("StatusControl", () => {
  it("진행중/완료 버튼이 콜백을 호출", async () => {
    const h = setup("대기");
    await userEvent.click(screen.getByRole("button", { name: "진행중" }));
    await userEvent.click(screen.getByRole("button", { name: "완료" }));
    expect(h.onProgress).toHaveBeenCalled();
    expect(h.onComplete).toHaveBeenCalled();
  });

  it("현재 상태 버튼은 비활성", () => {
    setup("완료");
    expect(screen.getByRole("button", { name: "완료" })).toBeDisabled();
  });

  it("삭제는 확인 단계를 거쳐 onDelete 호출", async () => {
    const h = setup("대기");
    await userEvent.click(screen.getByRole("button", { name: "삭제" }));
    expect(h.onDelete).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "확인" }));
    expect(h.onDelete).toHaveBeenCalledTimes(1);
  });

  it("삭제 확인 취소 가능", async () => {
    const h = setup("대기");
    await userEvent.click(screen.getByRole("button", { name: "삭제" }));
    await userEvent.click(screen.getByRole("button", { name: "취소" }));
    expect(h.onDelete).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "완료" })).toBeInTheDocument();
  });
});
