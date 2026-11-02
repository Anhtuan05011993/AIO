import type { Metadata } from "next";
import type { ReactElement } from "react";
import AppShell from "@/components/sites/aioenglish/app/AppShell";
import GrammarHub from "@/components/sites/aioenglish/grammar/GrammarHub";

/**
 * /ngu-phap — Luyện ngữ pháp (hub A1→C2). Thay trang login-gate của Agent C:
 * app demo coi như đã đăng nhập, trang thật bọc trong AppShell active="/ngu-phap".
 */
export const metadata: Metadata = {
  title: "Luyện ngữ pháp — AIO English",
  description:
    "Học ngữ pháp theo từng bước, đầy đủ từ A1 đến C2: bài hướng dẫn, chủ đề theo nhóm và luyện gõ câu liên quan.",
};

export default function NguPhapPage(): ReactElement {
  return (
    <AppShell active="/ngu-phap">
      <GrammarHub />
    </AppShell>
  );
}
