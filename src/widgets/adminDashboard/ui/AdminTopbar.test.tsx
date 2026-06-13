import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdminTopbar } from "./AdminTopbar";

describe("AdminTopbar", () => {
  it("새로고침·전체 엑셀·로그아웃 액션을 노출하고 콜백 호출", async () => {
    const onRefresh = vi.fn();
    const onExportAll = vi.fn().mockResolvedValue(undefined);
    const onSignOut = vi.fn();
    render(
      <AdminTopbar
        email="admin@weflow.kr"
        onRefresh={onRefresh}
        onExportAll={onExportAll}
        onSignOut={onSignOut}
      />,
    );
    expect(screen.getByText("admin@weflow.kr")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /새로고침/ }));
    expect(onRefresh).toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: /전체 엑셀 다운로드/ }));
    await waitFor(() => expect(onExportAll).toHaveBeenCalled());
    await userEvent.click(screen.getByRole("button", { name: /로그아웃/ }));
    expect(onSignOut).toHaveBeenCalled();
  });
});
