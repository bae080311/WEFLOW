import { describe, it, expect, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModalProvider, useInquiryModal } from "@/shared/lib/modal-context";
import { FormModal } from "./FormModal";

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

afterEach(() => {
  document.body.style.overflow = "";
});

describe("FormModal", () => {
  it("닫힌 상태에서는 다이얼로그가 없다", () => {
    setup();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("열면 문의 폼 필드(이름·연락처·제작종류·업종·요청사항·동의)를 노출한다", async () => {
    setup();
    await userEvent.click(screen.getByText("열기"));

    expect(screen.getByRole("dialog", { name: "무료 상담 문의" })).toBeInTheDocument();
    expect(screen.getByLabelText(/이름/)).toBeInTheDocument();
    expect(screen.getByLabelText(/연락처/)).toBeInTheDocument();
    expect(screen.getByLabelText(/제작종류/)).toBeInTheDocument();
    expect(screen.getByLabelText(/업종/)).toBeInTheDocument();
    expect(screen.getByLabelText(/추가요청사항/)).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /개인정보 수집/ })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "랜딩&홈페이지 제작" })).toBeInTheDocument();
  });

  it("필수 입력 후 제출하면 저장 없이 닫힌다(P7 위임 stub)", async () => {
    setup();
    await userEvent.click(screen.getByText("열기"));

    await userEvent.type(screen.getByLabelText(/이름/), "홍길동");
    await userEvent.type(screen.getByLabelText(/연락처/), "010-1234-5678");
    await userEvent.selectOptions(screen.getByLabelText(/제작종류/), "홈페이지 제작");
    await userEvent.type(screen.getByLabelText(/업종/), "카페");
    await userEvent.click(screen.getByRole("checkbox", { name: /개인정보 수집/ }));
    await userEvent.click(screen.getByRole("button", { name: "문의 보내기" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
