import type { Metadata } from "next";
import type { ReactElement } from "react";
import AppShell from "@/components/sites/aioenglish/app/AppShell";
import DashboardHome from "@/components/sites/aioenglish/app/dashboard/DashboardHome";

export const metadata: Metadata = {
  title: "Tổng quan — AIO English",
  description:
    "Học mọi thứ về tiếng Anh, trong một ứng dụng: gõ câu, từ vựng, ngữ pháp, đọc & dịch, video, từ điển và lộ trình học cá nhân hoá.",
};

/** /tong-quan — dashboard đã đăng nhập (AppShell + 6 section widget). */
export default function TongQuanPage(): ReactElement {
  return (
    <AppShell active="/tong-quan">
      <DashboardHome />
    </AppShell>
  );
}
