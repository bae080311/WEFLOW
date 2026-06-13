import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ModalProvider } from "@/shared/lib";
import { FormModal } from "@/widgets/formModal";
import { pretendard } from "./fonts";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "WEFLOW — 문의로 이어지는 홈페이지를 만듭니다",
  description:
    "홈페이지 제작부터 광고 연동·운영 관리까지. 단순 제작이 아닌 문의 구조까지 설계합니다.",
  icons: {
    icon: { url: "/logo_icon.png", type: "image/png" },
    shortcut: "/logo_icon.png",
    apple: "/logo_icon.png",
  },
};

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
