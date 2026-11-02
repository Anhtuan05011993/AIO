import type { Metadata } from "next";
import AppShell from "@/components/sites/aioenglish/app/AppShell";
import CaiDat from "@/components/sites/aioenglish/app2/CaiDat";

export const metadata: Metadata = {
  title: "Cài đặt · AIO English",
};

export default function CaiDatPage() {
  return (
    <AppShell active="/cai-dat">
      <CaiDat />
    </AppShell>
  );
}
