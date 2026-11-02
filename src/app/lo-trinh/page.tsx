import type { Metadata } from "next";
import type { ReactElement } from "react";
import AppShell from "@/components/sites/aioenglish/app/AppShell";
import PathJourney from "@/components/sites/aioenglish/path/PathJourney";

/** /lo-trinh — bản đồ lộ trình học TOEIC 785 (AppShell + 11 chương + kiểm tra lên cấp). */
export const metadata: Metadata = {
  title: "Lộ trình học — AIO English",
  description: "Học từ A1 đến C1, theo từng chương.",
};

export default function LoTrinhPage(): ReactElement {
  return (
    <AppShell active="/lo-trinh">
      <PathJourney />
    </AppShell>
  );
}
