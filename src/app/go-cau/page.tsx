import type { Metadata } from "next";
import AppShell from "@/components/sites/aioenglish/app/AppShell";
import GoCauHub from "@/components/sites/aioenglish/go-cau/GoCauHub";

/**
 * /go-cau — hub Gõ câu (GoCauHub tự xử lý 2 trạng thái:
 * chưa đăng nhập → FeatureGate như nguồn; đã đăng nhập → hub 5 lộ trình + 22 bộ câu
 * clone theo cấu trúc bản thật, chụp 31/10 — BRIEFS-5).
 */
export const metadata: Metadata = {
  title: "Gõ câu · AIO English",
  description: "Học qua gõ câu: 5 lộ trình A1→C1 và thư viện 22 bộ câu theo chủ đề.",
};

export default function GoCauPage() {
  return (
    <AppShell active="/go-cau">
      <GoCauHub />
    </AppShell>
  );
}
