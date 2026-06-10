import type { Metadata } from "next";
import type { ReactNode } from "react";
import { pretendard } from "./fonts";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "WEFLOW — 문의로 이어지는 홈페이지를 만듭니다",
  description:
    "홈페이지 제작부터 광고 연동·운영 관리까지. 단순 제작이 아닌 문의 구조까지 설계합니다.",
  icons: { icon: "/favicon.ico" },
};

// 공통 셸(Header/Footer/BottomBar/FormModal)은 P3에서 추가. P1 layout 은 폰트 + Providers 만.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
