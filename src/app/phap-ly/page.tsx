import type { Metadata } from "next";
import LegalHub from "@/components/sites/aioenglish/legal/LegalHub";
import LegalShell from "@/components/sites/aioenglish/legal/LegalShell";

export const metadata: Metadata = {
  title: "Pháp lý · AIO English",
};

export default function PhapLyPage() {
  return (
    <LegalShell>
      <LegalHub />
    </LegalShell>
  );
}
