import type { Metadata } from "next";
import { LegalDocument } from "@/widgets/legalDocument";
import { TERMS_OF_SERVICE } from "@/shared/config";

export const metadata: Metadata = {
  title: "이용약관 | WEFLOW",
};

export default function TermsPage() {
  return <LegalDocument {...TERMS_OF_SERVICE} />;
}
