import type { Metadata } from "next";
import { DiagnosisView } from "@/views/diagnosis";

export const metadata: Metadata = {
  title: "무료진단 받기 | WEFLOW",
  description: "내 사이트의 문의 전환 구조를 무료로 진단하고 맞춤 견적까지 받아보세요.",
};

// requirements §3-6: 진단 체크리스트(✓4) + 문의 폼(source=diagnosis) → 관리자 문의
export default function DiagnosisPage() {
  return <DiagnosisView />;
}
