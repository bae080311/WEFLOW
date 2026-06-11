import type { ReactNode } from "react";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { BottomBar } from "@/widgets/bottomBar";

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
