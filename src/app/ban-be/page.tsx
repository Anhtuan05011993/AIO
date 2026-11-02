import type { Metadata } from "next";
import AppShell from "@/components/sites/aioenglish/app/AppShell";
import TienDoBanBe from "@/components/sites/aioenglish/app2/TienDoBanBe";

export const metadata: Metadata = {
  title: "Tiến độ & Bạn bè · AIO English",
};

export default function BanBePage() {
  return (
    <AppShell active="/ban-be">
      <TienDoBanBe />
    </AppShell>
  );
}
