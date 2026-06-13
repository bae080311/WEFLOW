import type { Metadata } from "next";
import type { ReactNode } from "react";

// 관리자 독립 셸: (site) 그룹 밖이라 마케팅 Header/Footer/StageDock 를 받지 않는다.
export const metadata: Metadata = {
  title: "WEFLOW 관리자",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-bg">{children}</div>;
}
