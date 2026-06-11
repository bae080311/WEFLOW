import type { ReactNode } from "react";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { BottomBar } from "@/widgets/bottom-bar";

// 마케팅 공통 셸. 라우트 그룹 (site) 안의 페이지에만 적용된다(/admin 은 그룹 밖 → 독립 셸).
// 하단 고정 BottomBar 가 가리지 않도록, 인-플로우 콘텐츠(Header/main/Footer)에 bottom 패딩을 둔다.
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="pb-[calc(56px+env(safe-area-inset-bottom))]">
        <Header />
        <main className="min-h-[60vh]">{children}</main>
        <Footer />
      </div>
      <BottomBar />
    </>
  );
}
