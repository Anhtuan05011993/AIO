import type { Metadata } from "next";
import LegalShell from "@/components/sites/aioenglish/legal/LegalShell";
import LegalTermsDoc from "@/components/sites/aioenglish/legal/LegalTermsDoc";

export const metadata: Metadata = {
  title: "Điều khoản sử dụng · AIO English",
};

export default function DieuKhoanPage() {
  return (
    <LegalShell>
      <LegalTermsDoc />
    </LegalShell>
  );
}
