import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ModalProvider } from "@/shared/lib";
import { FormModal } from "@/widgets/form-modal";
import { pretendard } from "./fonts";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "WEFLOW — 문의로 이어지는 홈페이지를 만듭니다",
  description:
    "홈페이지 제작부터 광고 연동·운영 관리까지. 단순 제작이 아닌 문의 구조까지 설계합니다.",
  icons: { icon: "/favicon.ico" },
};

// 루트 레이아웃은 최소 유지: 폰트 + Providers + 전역 ModalProvider/FormModal 마운트만.
// 마케팅 크롬(Header/Footer/BottomBar)은 app/(site)/layout.tsx 에 있고, /admin 은 그룹 밖이라 독립 셸이다.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body>
        <Providers>
          <ModalProvider>
            {children}
            <FormModal />
          </ModalProvider>
        </Providers>
      </body>
    </html>
  );
}
