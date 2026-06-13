import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdminLoginGate } from "./AdminLoginGate";

describe("AdminLoginGate", () => {
  it("입력값으로 onSignIn 을 호출", async () => {
    const onSignIn = vi.fn().mockResolvedValue({ ok: true });
    render(<AdminLoginGate onSignIn={onSignIn} />);
    await userEvent.type(screen.getByLabelText(/이메일/), "admin@weflow.kr");
    await userEvent.type(screen.getByLabelText(/비밀번호/), "secret");
    await userEvent.click(screen.getByRole("button", { name: "로그인" }));
    await waitFor(() => expect(onSignIn).toHaveBeenCalledWith("admin@weflow.kr", "secret"));
  });

  it("실패 시 에러 메시지 노출", async () => {
    const onSignIn = vi
      .fn()
      .mockResolvedValue({ ok: false, error: "이메일 또는 비밀번호가 올바르지 않습니다." });
    render(<AdminLoginGate onSignIn={onSignIn} />);
    await userEvent.type(screen.getByLabelText(/이메일/), "x@y.com");
    await userEvent.type(screen.getByLabelText(/비밀번호/), "wrong");
    await userEvent.click(screen.getByRole("button", { name: "로그인" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "이메일 또는 비밀번호가 올바르지 않습니다.",
    );
  });
});
