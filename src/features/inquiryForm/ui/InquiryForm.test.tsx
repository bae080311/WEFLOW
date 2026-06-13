import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/entities/inquiry", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/entities/inquiry")>();
  return {
    ...actual,
    inquiryService: { ...actual.inquiryService, create: vi.fn().mockResolvedValue({ id: "1" }) },
  };
});

import { inquiryService } from "@/entities/inquiry";
import { InquiryForm } from "./InquiryForm";

const createMock = vi.mocked(inquiryService.create);

async function fillInfoStep() {
  await userEvent.type(screen.getByLabelText(/이름/), "홍길동");
  await userEvent.type(screen.getByLabelText(/연락처/), "010-1234-5678");
  await userEvent.click(screen.getByRole("combobox", { name: /제작종류/ }));
  await userEvent.click(screen.getByRole("option", { name: "홈페이지 제작" }));
  await userEvent.type(screen.getByLabelText(/업종/), "카페");
}

beforeEach(() => {
  createMock.mockClear();
});

describe("InquiryForm — 스텝", () => {
  it("1단계 필수 미입력 시 다음으로 못 넘어가고 에러", async () => {
    render(<InquiryForm source="diagnosis" />);
    await userEvent.click(screen.getByRole("button", { name: "다음" }));
    expect(screen.getByText("이름을 입력해 주세요.")).toBeInTheDocument();
    expect(createMock).not.toHaveBeenCalled();
    // 여전히 1단계(이름 필드 노출)
    expect(screen.getByLabelText(/이름/)).toBeInTheDocument();
  });

  it("2단계에서 동의 누락 시 제출 막힘", async () => {
    render(<InquiryForm source="diagnosis" />);
    await fillInfoStep();
    await userEvent.click(screen.getByRole("button", { name: "다음" }));
    await userEvent.click(screen.getByRole("button", { name: "문의 보내기" }));
    expect(createMock).not.toHaveBeenCalled();
    expect(screen.getByText(/개인정보 수집 및 상담 동의가 필요합니다/)).toBeInTheDocument();
  });

  it("정상 진행 후 제출 시 source 와 함께 기록 + 성공 메시지", async () => {
    const onSuccess = vi.fn();
    render(<InquiryForm source="diagnosis" onSuccess={onSuccess} />);
    await fillInfoStep();
    await userEvent.click(screen.getByRole("button", { name: "다음" }));
    await userEvent.click(screen.getByRole("checkbox", { name: /개인정보 수집/ }));
    await userEvent.click(screen.getByRole("button", { name: "문의 보내기" }));

    await waitFor(() => expect(createMock).toHaveBeenCalledTimes(1));
    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        source: "diagnosis",
        agreed: true,
        name: "홍길동",
        industry: "카페",
      }),
    );
    expect(onSuccess).toHaveBeenCalled();
    expect(await screen.findByText("문의가 접수되었습니다")).toBeInTheDocument();
  });

  it("source 미지정이면 review_modal 로 기록", async () => {
    render(<InquiryForm />);
    await fillInfoStep();
    await userEvent.click(screen.getByRole("button", { name: "다음" }));
    await userEvent.click(screen.getByRole("checkbox", { name: /개인정보 수집/ }));
    await userEvent.click(screen.getByRole("button", { name: "문의 보내기" }));
    await waitFor(() => expect(createMock).toHaveBeenCalled());
    expect(createMock).toHaveBeenCalledWith(expect.objectContaining({ source: "review_modal" }));
  });

  it("이전 버튼으로 1단계로 돌아간다", async () => {
    render(<InquiryForm source="diagnosis" />);
    await fillInfoStep();
    await userEvent.click(screen.getByRole("button", { name: "다음" }));
    expect(screen.getByRole("checkbox", { name: /개인정보 수집/ })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "이전" }));
    expect(screen.getByLabelText(/이름/)).toBeInTheDocument();
  });

  it("저장 실패 시 폼이 죽지 않고 에러 안내를 노출", async () => {
    createMock.mockRejectedValueOnce(new Error("PGRST125"));
    render(<InquiryForm source="diagnosis" />);
    await fillInfoStep();
    await userEvent.click(screen.getByRole("button", { name: "다음" }));
    await userEvent.click(screen.getByRole("checkbox", { name: /개인정보 수집/ }));
    await userEvent.click(screen.getByRole("button", { name: "문의 보내기" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("오류가 발생했습니다");
    expect(screen.queryByText("문의가 접수되었습니다")).not.toBeInTheDocument();
  });
});
