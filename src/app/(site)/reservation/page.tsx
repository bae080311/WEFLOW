import type { Metadata } from "next";
import { ReservationView } from "@/views/reservation";

export const metadata: Metadata = {
  title: "상담 예약 | WEFLOW",
  description: "원하시는 날짜와 시간에 1:1 제작 상담을 예약하세요.",
};

// requirements §3-5: 세로 달력 + 20슬롯 + 직접입력 + 필드/동의 → 관리자 예약
export default function ReservationPage() {
  return <ReservationView />;
}
