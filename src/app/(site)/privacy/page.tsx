import type { Metadata } from "next";
import { LegalDocument } from "@/widgets/legalDocument";
import { PRIVACY_POLICY } from "@/shared/config";

export const metadata: Metadata = {
  title: "개인정보처리방침 | WEFLOW",
};

export default function PrivacyPage() {
  return <LegalDocument {...PRIVACY_POLICY} />;
}
