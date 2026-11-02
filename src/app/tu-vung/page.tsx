import type { Metadata } from "next";
import AppShell from "@/components/sites/aioenglish/app/AppShell";
import VocabHub from "@/components/sites/aioenglish/vocab/VocabHub";

/**
 * /tu-vung — hub chọn bộ thẻ (VocabHub tự xử lý 2 trạng thái:
 * chưa đăng nhập → FeatureGate như nguồn; đã đăng nhập → index 5 bộ thẻ thật).
 */
export const metadata: Metadata = {
  title: "Từ vựng · AIO English",
  description: "Từ vựng TOEIC 600 + Oxford 3000 — Nạp sâu ghi nhớ và Flashcard ôn giãn cách.",
};

export default function TuVungPage() {
  return (
    <AppShell active="/tu-vung">
      <VocabHub />
    </AppShell>
  );
}
