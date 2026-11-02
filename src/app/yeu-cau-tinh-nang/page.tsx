import type { Metadata } from "next";
import AppShell from "@/components/sites/aioenglish/app/AppShell";
import YeuCauTinhNang from "@/components/sites/aioenglish/app2/YeuCauTinhNang";

export const metadata: Metadata = {
  title: "Yêu cầu tính năng · AIO English",
};

export default function YeuCauTinhNangPage() {
  return (
    <AppShell active="/yeu-cau-tinh-nang">
      <YeuCauTinhNang />
    </AppShell>
  );
}
