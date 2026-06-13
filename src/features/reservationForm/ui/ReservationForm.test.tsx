import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/entities/reservation", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/entities/reservation")>();
  return {
    ...actual,
    reservationService: {
      ...actual.reservationService,
      create: vi.fn().mockResolvedValue({ id: "1" }),
    },
  };
});

import { reservationService } from "@/entities/reservation";
import { ReservationForm } from "./ReservationForm";

const createMock = vi.mocked(reservationService.create);

// step1(일정): 달력에서 다음 달 15일(미래) + 시간 슬롯 선택(20슬롯 5×4 한 화면).
async function pickSchedule(time = "14:00") {
  await userEvent.click(screen.getByRole("button", { name: "다음 달" }));
  await userEvent.click(screen.getByRole("button", { name: "15" }));
  await userEvent.click(screen.getByRole("button", { name: time }));
}
async function fillInfo() {
  await userEvent.type(screen.getByLabelText(/이름/), "홍길동");
  await userEvent.type(screen.getByLabelText(/연락처/), "010-1234-5678");
  await userEvent.click(screen.getByRole("combobox", { name: /제작종류/ }));
  await userEvent.click(screen.getByRole("option", { name: "랜딩페이지 제작" }));
  await userEvent.type(screen.getByLabelText(/업종/), "필라테스");
}

beforeEach(() => {
  createMock.mockClear();
});

describe("ReservationForm — 스텝 위저드", () => {
  it("1단계는 달력·시간 그리드(20슬롯)·직접입력과 단계 표시기를 렌더", () => {
    render(<ReservationForm />);
    expect(screen.getByText("일정 선택")).toBeInTheDocument();
    expect(screen.getByText("정보 입력")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "희망 날짜 선택" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "희망 시간 선택" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "09:00" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "18:30" })).toBeInTheDocument();
    expect(screen.getByLabelText(/원하시는 시간대/)).toBeInTheDocument();
    // 1단계에서는 정보 필드가 보이지 않는다
    expect(screen.queryByLabelText(/^이름/)).not.toBeInTheDocument();
  });

  it("일정 미선택 시 다음으로 못 넘어가고 에러 표시", async () => {
    render(<ReservationForm />);
    await userEvent.click(screen.getByRole("button", { name: "다음" }));
    expect(screen.getByText("희망 날짜를 선택해 주세요.")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "희망 날짜 선택" })).toBeInTheDocument(); // 여전히 1단계
    expect(createMock).not.toHaveBeenCalled();
  });

  it("3단계까지 진행해 제출하면 예약 서비스 호출(isManualTime=false)", async () => {
    render(<ReservationForm />);
    await pickSchedule("14:00");
    await userEvent.click(screen.getByRole("button", { name: "다음" }));
    await fillInfo();
    await userEvent.click(screen.getByRole("button", { name: "다음" }));
    // 3단계: 요약 + 동의
    expect(screen.getByText("홍길동")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("checkbox", { name: /개인정보 수집/ }));
    await userEvent.click(screen.getByRole("button", { name: "예약 신청하기" }));

    await waitFor(() => expect(createMock).toHaveBeenCalledTimes(1));
    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        desiredTime: "14:00",
        isManualTime: false,
        agreed: true,
        name: "홍길동",
      }),
    );
    expect(await screen.findByText("예약이 접수되었습니다")).toBeInTheDocument();
  });

  it("직접 입력 시 그리드 선택 해제(상호배타) 후 제출 → isManualTime=true", async () => {
    render(<ReservationForm />);
    await pickSchedule("14:00");
    expect(screen.getByRole("button", { name: "14:00" })).toHaveAttribute("aria-pressed", "true");
    await userEvent.type(screen.getByLabelText(/원하시는 시간대/), "다음주화요일");
    expect(screen.getByRole("button", { name: "14:00" })).toHaveAttribute("aria-pressed", "false");

    await userEvent.click(screen.getByRole("button", { name: "다음" }));
    await fillInfo();
    await userEvent.click(screen.getByRole("button", { name: "다음" }));
    await userEvent.click(screen.getByRole("checkbox", { name: /개인정보 수집/ }));
    await userEvent.click(screen.getByRole("button", { name: "예약 신청하기" }));

    await waitFor(() => expect(createMock).toHaveBeenCalled());
    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({ desiredTime: "다음주화요일", isManualTime: true }),
    );
  });

  it("이전 버튼으로 단계를 되돌릴 수 있다", async () => {
    render(<ReservationForm />);
    await pickSchedule("14:00");
    await userEvent.click(screen.getByRole("button", { name: "다음" }));
    expect(screen.getByLabelText(/이름/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "이전" }));
    expect(screen.getByRole("group", { name: "희망 날짜 선택" })).toBeInTheDocument();
  });

  it("일정 선택 시 한국어 요약을 보여준다", async () => {
    render(<ReservationForm />);
    await pickSchedule("14:00");
    expect(screen.getByText(/15일.*·.*오후 2:00/)).toBeInTheDocument();
  });

  it("확인 단계의 '수정'으로 해당 단계로 돌아간다", async () => {
    render(<ReservationForm />);
    await pickSchedule("14:00");
    await userEvent.click(screen.getByRole("button", { name: "다음" }));
    await fillInfo();
    await userEvent.click(screen.getByRole("button", { name: "다음" }));
    // 3단계 요약: 일정 카드의 '수정' → 1단계로
    const editButtons = screen.getAllByRole("button", { name: "수정" });
    await userEvent.click(editButtons[0]);
    expect(screen.getByRole("group", { name: "희망 날짜 선택" })).toBeInTheDocument();
  });

  it("저장 실패 시 폼이 죽지 않고 에러 안내를 노출", async () => {
    createMock.mockRejectedValueOnce(new Error("PGRST125"));
    render(<ReservationForm />);
    await pickSchedule("14:00");
    await userEvent.click(screen.getByRole("button", { name: "다음" }));
    await fillInfo();
    await userEvent.click(screen.getByRole("button", { name: "다음" }));
    await userEvent.click(screen.getByRole("checkbox", { name: /개인정보 수집/ }));
    await userEvent.click(screen.getByRole("button", { name: "예약 신청하기" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("오류가 발생했습니다");
    expect(screen.queryByText("예약이 접수되었습니다")).not.toBeInTheDocument();
  });
});
