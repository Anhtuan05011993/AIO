import type { Metadata } from "next";
import LegalPrivacyDoc from "@/components/sites/aioenglish/legal/LegalPrivacyDoc";
import LegalShell from "@/components/sites/aioenglish/legal/LegalShell";

export const metadata: Metadata = {
  title: "Chính sách quyền riêng tư · AIO English",
};

export default function QuyenRiengTuPage() {
  return (
    <LegalShell>
      <LegalPrivacyDoc />
    </LegalShell>
  );
}
