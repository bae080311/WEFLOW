import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdminLogoutButton } from "./AdminLogoutButton";

describe("AdminLogoutButton", () => {
  it("클릭 시 onSignOut 호출", async () => {
    const onSignOut = vi.fn();
    render(<AdminLogoutButton onSignOut={onSignOut} />);
    await userEvent.click(screen.getByRole("button", { name: /로그아웃/ }));
    expect(onSignOut).toHaveBeenCalled();
  });
});
