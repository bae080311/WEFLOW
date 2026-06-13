import type { Metadata } from "next";
import { LandingView } from "@/views/landing";

export const metadata: Metadata = {
  title: "WEFLOW 랜딩 | 문의로 이어지는 홈페이지를 만듭니다",
  description: "기획부터 제작, 광고 연동, 운영 관리까지 WEFLOW가 함께합니다.",
};

// requirements §3-7: 우측 sticky 문의 폼 + 전 섹션 위젯 재사용(중복 0)
export default function LandingPage() {
  return <LandingView />;
}
