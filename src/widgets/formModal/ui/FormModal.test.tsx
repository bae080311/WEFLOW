import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModalProvider, useInquiryModal } from "@/shared/lib/modalContext";
import { FormModal } from "./FormModal";

vi.mock("@/entities/inquiry", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/entities/inquiry")>();
  return {
    ...actual,
    inquiryService: { ...actual.inquiryService, create: vi.fn().mockResolvedValue({ id: "1" }) },
  };
});

import { inquiryService } from "@/entities/inquiry";

const createMock = vi.mocked(inquiryService.create);

function Opener() {
  const { openInquiryModal } = useInquiryModal();
  return <button onClick={() => openInquiryModal("review_modal")}>열기</button>;
}

function setup() {
  return render(
    <ModalProvider>
      <Opener />
      <FormModal />
    </ModalProvider>,
  );
}

beforeEach(() => {
  createMock.mockClear();
});

afterEach(() => {
  document.body.style.overflow = "";
});

describe("FormModal", () => {
  it("닫힌 상태에서는 다이얼로그가 없다", () => {
    setup();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("열면 1단계 문의 폼 필드(이름·연락처·제작종류·업종)를 노출한다", async () => {
    setup();
    await userEvent.click(screen.getByText("열기"));

    expect(screen.getByRole("dialog", { name: "무료 상담 문의" })).toBeInTheDocument();
    expect(screen.getByLabelText(/이름/)).toBeInTheDocument();
    expect(screen.getByLabelText(/연락처/)).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /제작종류/ })).toBeInTheDocument();
    expect(screen.getByLabelText(/업종/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("combobox", { name: /제작종류/ }));
    expect(screen.getByRole("option", { name: "랜딩&홈페이지 제작" })).toBeInTheDocument();
  });

  it("단계 진행 후 제출하면 문의를 기록(source=review_modal)하고 모달이 닫힌다", async () => {
    setup();
    await userEvent.click(screen.getByText("열기"));

    await userEvent.type(screen.getByLabelText(/이름/), "홍길동");
    await userEvent.type(screen.getByLabelText(/연락처/), "010-1234-5678");
    await userEvent.click(screen.getByRole("combobox", { name: /제작종류/ }));
    await userEvent.click(screen.getByRole("option", { name: "홈페이지 제작" }));
    await userEvent.type(screen.getByLabelText(/업종/), "카페");
    await userEvent.click(screen.getByRole("button", { name: "다음" }));
    await userEvent.click(screen.getByRole("checkbox", { name: /개인정보 수집/ }));
    await userEvent.click(screen.getByRole("button", { name: "문의 보내기" }));

    await waitFor(() => expect(createMock).toHaveBeenCalledTimes(1));
    expect(createMock).toHaveBeenCalledWith(expect.objectContaining({ source: "review_modal" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });
});
