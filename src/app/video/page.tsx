import type { Metadata } from "next";
import type { ReactElement } from "react";
import AppShell from "@/components/sites/aioenglish/app/AppShell";
import VideoHub from "@/components/sites/aioenglish/video/VideoHub";

/**
 * /video — Dictation & Shadowing (thay trang login-gate của Agent C):
 * hub giải thích "Một video, bốn cách học" + 4 bài demo, bọc trong
 * AppShell active="/video".
 */
export const metadata: Metadata = {
  title: "Dictation & Shadowing — AIO English",
  description:
    "Một video, bốn cách học: dán link YouTube của bạn, nghe và gõ lại từng câu, đọc transcript, nói theo với bộ đếm lặp.",
};

export default async function VideoPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; lucky?: string }>;
}): Promise<ReactElement> {
  const params = await searchParams;
  return (
    <AppShell active="/video">
      <VideoHub
        initialMine={params.tab === "cua-toi" && params.lucky !== "1"}
        initialLucky={params.lucky === "1"}
      />
    </AppShell>
  );
}
