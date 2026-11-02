import type { Metadata } from "next";
import Link from "next/link";

// Trang fallback khi offline — SW của Serwist điều hướng về đây khi
// không tải được document. Static thuần để precache được.
export const metadata: Metadata = { title: "Ngoại tuyến · AIO English" };

export default function OfflinePage() {
  return (
    <div className="lp-root nb-lesson relative isolate flex min-h-dscreen flex-col" data-feature="landing">
      <main id="main-content" className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-4 py-8 text-center">
        <p className="font-hero text-5xl" aria-hidden="true">📴</p>
        <h1 className="font-hero mt-4 text-2xl font-extrabold leading-tight text-fg">Bạn đang ngoại tuyến.</h1>
        <p className="mt-2 max-w-md text-sm font-semibold leading-relaxed text-fg-muted">
          Không tải được trang này. Những trang bạn đã mở trước đây vẫn xem được — kiểm tra kết nối rồi thử lại nhé.
        </p>
        <Link href="/tong-quan" className="btn-ink btn-ink-cta mt-6 flex h-12 items-center rounded-[var(--r-pill)] px-6 text-sm font-bold">
          Thử lại
        </Link>
      </main>
    </div>
  );
}
