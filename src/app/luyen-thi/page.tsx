import type { Metadata } from "next";
import AppShell from "@/components/sites/aioenglish/app/AppShell";
import LuyenThi from "@/components/sites/aioenglish/app2/LuyenThi";

export const metadata: Metadata = {
  title: "Luyện thi · AIO English",
};

export default function LuyenThiPage() {
  return (
    <AppShell active="/luyen-thi">
      <LuyenThi />
    </AppShell>
  );
}
