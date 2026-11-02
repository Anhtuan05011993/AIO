import type { Metadata } from "next";
import type { ReactElement } from "react";
import AppShell from "@/components/sites/aioenglish/app/AppShell";
import ReadingHub from "@/components/sites/aioenglish/reading/ReadingHub";

/**
 * /luyen-dich-thuat — Luyện đọc & dịch (thay trang login-gate của Agent C):
 * app demo coi như đã đăng nhập, hub bọc trong AppShell active="/luyen-dich-thuat".
 */
export const metadata: Metadata = {
  title: "Luyện đọc & dịch — AIO English",
  description:
    "Báo song ngữ, dịch có chấm điểm: đọc từng câu với bản dịch ẩn hoặc tự dịch tiếng Việt sang tiếng Anh và nhận điểm ngay.",
};

export default function LuyenDichThuatPage(): ReactElement {
  return (
    <AppShell active="/luyen-dich-thuat">
      <ReadingHub />
    </AppShell>
  );
}
