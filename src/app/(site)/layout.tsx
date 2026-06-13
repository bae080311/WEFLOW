import type { ReactNode } from "react";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { BottomBar } from "@/widgets/bottomBar";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    // PDF: 하단 4칸 고정바(BottomBar)가 항상 떠 있으므로, 콘텐츠가 가리지 않도록 하단 패딩 확보(+iOS safe-area).
    <div className="pb-[calc(56px+env(safe-area-inset-bottom))]">
      <Header />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
      <BottomBar />
    </div>
  );
}
