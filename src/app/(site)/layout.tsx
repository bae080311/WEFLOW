import type { ReactNode } from "react";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { StageDock } from "@/widgets/stageDock";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
      <StageDock />
    </div>
  );
}
