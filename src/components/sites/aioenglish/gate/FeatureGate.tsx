"use client";

/**
 * FeatureGate — cổng chờ đăng nhập cho các trang tính năng khi chưa đăng nhập.
 *
 * Nguồn: docs/research/aioenglish/pages/go-cau.html (shell 20KB, client-render nên
 * body SSR rỗng) + các trang có SSR cùng hệ thống (phap-ly.html, auth__login.html)
 * + CSS gốc entry.css / NbPageHeader.css / FeatureCritter.css / pages.css.
 *
 * - Shell app dựng lại theo SSR của phap-ly.html: skip link + main#main-content
 *   + .nb-skin[data-nb-accent] + .nb-wrap + .nbc-page + header .nbc-hd.
 * - Text lấy NGUYÊN VĂN từ nguồn: tên tính năng + chip số liệu từ card tính năng
 *   trên landing (home.html), câu "Đăng nhập để học và lưu tiến độ." và fine print
 *   từ auth__login.html, nút "Tạo tài khoản miễn phí" từ landing hero.
 * - /tu-dien trên nguồn là meta-refresh về /?dang-nhap&next=/tu-dien — clone bằng
 *   cùng gate này (xem src/app/tu-dien/page.tsx).
 */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, type CSSProperties, type ReactNode } from "react";
import { getDemoUser, hasServerSession } from "@/lib/store/auth";
import { critters } from "./critters";

/** Khóa tính năng — trùng `data-feature` trên nguồn (card landing dùng "doc-dich" cho /luyen-dich-thuat). */
export type GateFeatureKey =
  | "go-cau"
  | "tu-vung"
  | "ngu-phap"
  | "doc-dich"
  | "video"
  | "tu-dien"
  | "lo-trinh";

/** Trang đích khi ĐÃ đăng nhập — gate chỉ dành cho khách chưa login (như nguồn).
 *  Lưu ý: "tu-vung" KHÔNG có ở đây — /tu-vung dùng VocabHub tự xử lý 2 trạng thái
 *  (gate khi khách, index bộ thẻ khi đã đăng nhập). */
const AUTHED_DESTINATION: Partial<Record<GateFeatureKey, string>> = {
  "ngu-phap": "/ngu-phap",
  "doc-dich": "/luyen-dich-thuat",
  video: "/video",
  "tu-dien": "/tu-dien",
  "lo-trinh": "/lo-trinh",
};

export type GateFeature = {
  key: GateFeatureKey;
  /** Tên tính năng (h1 header, dấu chấm thêm tự động như nguồn "Pháp lý.") */
  name: string;
  /** Chip số liệu cạnh tiêu đề — text từ card tính năng trên landing */
  chip: string;
  /** Mô tả ngắn — text từ card tính năng trên landing */
  blurb: string;
};

/** Accent màu theo tính năng — class gốc từ card landing (home.html: nbx-fcard nbx-f-*). */
const ACCENT_CLASS: Record<GateFeatureKey, string> = {
  "go-cau": "nbx-f-go",
  "tu-vung": "nbx-f-voc",
  "ngu-phap": "nbx-f-gram",
  "doc-dich": "nbx-f-read",
  video: "nbx-f-vid",
  "tu-dien": "nbx-f-dict",
  "lo-trinh": "nbx-f-path",
};

/* Icon lucide (bộ icon của nguồn — class lucide-*-icon như markup gốc). */
function iconSvg(name: string, size: number, children: ReactNode): ReactNode {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide lucide-${name}-icon`}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

const HEADER_ICONS: Record<GateFeatureKey, ReactNode> = {
  "go-cau": iconSvg("keyboard", 20, (
    <>
      <path d="M10 8h.01" />
      <path d="M12 12h.01" />
      <path d="M14 8h.01" />
      <path d="M16 12h.01" />
      <path d="M18 10h.01" />
      <path d="M18 14h.01" />
      <path d="M6 8h.01" />
      <path d="M6 12h.01" />
      <path d="M7 16h10" />
      <path d="M8 14h.01" />
      <rect width="20" height="16" x="2" y="4" rx="2" />
    </>
  )),
  "tu-vung": iconSvg("layers", 20, (
    <>
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
    </>
  )),
  "ngu-phap": iconSvg("book-open", 20, (
    <>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </>
  )),
  "doc-dich": iconSvg("languages", 20, (
    <>
      <path d="m5 8 6 6" />
      <path d="m4 14 6-6 2-3" />
      <path d="M2 5h12" />
      <path d="M7 2h1" />
      <path d="m22 22-5-10-5 10" />
      <path d="M14 18h6" />
    </>
  )),
  video: iconSvg("play", 20, <polygon points="6 3 20 12 6 21 6 3" />),
  "tu-dien": iconSvg("book", 20, (
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  )),
  "lo-trinh": iconSvg("map", 20, (
    <>
      <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" />
      <path d="M15 5.764v15" />
      <path d="M9 3.236v15" />
    </>
  )),
};

export function FeatureGate({ feature }: { feature: GateFeature }) {
  const router = useRouter();
  const Critter = critters[feature.key];
  const style = {
    "--fc": `var(--feat-${feature.key})`,
  } as CSSProperties;

  // Đã đăng nhập (user local từ login form, hoặc cookie session server còn sống)
  // → gate không có tác dụng: chuyển thẳng vào trang tính năng tương ứng.
  useEffect(() => {
    const dest = AUTHED_DESTINATION[feature.key];
    if (!dest) return;
    let alive = true;
    void (async () => {
      const authed = Boolean(getDemoUser()) || (await hasServerSession());
      if (alive && authed) router.replace(dest);
    })();
    return () => {
      alive = false;
    };
  }, [feature.key, router]);

  return (
    <div className="relative isolate flex h-dscreen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-fg"
      >
        Bỏ qua tới nội dung chính
      </a>
      <main
        id="main-content"
        data-landing-main
        tabIndex={-1}
        className="relative z-10 min-h-0 w-full flex-1 overflow-y-auto overflow-x-hidden [scrollbar-gutter:stable] safe-t safe-b"
      >
        <div className="nb-skin" data-feature={feature.key} data-nb-accent="kraft">
          <div className="nb-wrap">
            <div className="nbc-page">
              <header className="nbc-hd" data-nb-header data-bm="hdr">
                <span
                  className="is-msk nbc-tape"
                  style={{ top: "-11px", left: "40%", "--nb-tape-r": "-3deg" } as CSSProperties}
                  aria-hidden="true"
                />
                <div className="nbc-hd-row is-top">
                  <div className="nbc-hd-head">
                    <div className="nbc-hd-tt">
                      <span
                        className="nbc-sk is-a"
                        style={{ "--nb-sk-size": "44px" } as CSSProperties}
                        aria-hidden="true"
                      >
                        {HEADER_ICONS[feature.key]}
                      </span>
                      <h1>{feature.name}.</h1>
                      <div className="nbc-hd-chips">
                        <span className="nbc-chip">{feature.chip}</span>
                      </div>
                    </div>
                  </div>
                  <div className="nbc-hd-cta">
                    <Link href="/auth/login" className="nbc-btn is-ink">
                      Đăng nhập
                      {iconSvg("arrow-right", 18, (
                        <>
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </>
                      ))}
                    </Link>
                  </div>
                </div>
                <p className="nbc-sub">{feature.blurb}</p>
                <div className="nbc-hd-tools">
                  <Link href="/" className="nbc-hlink">
                    {iconSvg("arrow-left", 16, (
                      <>
                        <path d="m12 19-7-7 7-7" />
                        <path d="M19 12H5" />
                      </>
                    ))}
                    Về trang giới thiệu
                  </Link>
                </div>
              </header>

              <section className={`nbc-lv1 is-grid20 ${ACCENT_CLASS[feature.key]}`}>
                <span className="nbc-tape is-cor" aria-hidden="true" />
                <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
                  <div data-critter data-feature={feature.key} className="fc-wrap fc-peek" style={style}>
                    <Critter />
                  </div>
                  <span
                    className="nbc-sk"
                    style={{ "--nb-sk-size": "40px" } as CSSProperties}
                    aria-hidden="true"
                  >
                    {iconSvg("lock", 20, (
                      <>
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </>
                    ))}
                  </span>
                  <h2 className="font-hero text-xl font-extrabold tracking-tight text-fg">Đăng nhập</h2>
                  <p className="text-sm text-fg-muted">Đăng nhập để học và lưu tiến độ.</p>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <Link href="/auth/login" className="nbc-btn is-act">
                      Đăng nhập
                      {iconSvg("arrow-right", 18, (
                        <>
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </>
                      ))}
                    </Link>
                    <Link href="/auth/register" className="nbc-btn is-soft">
                      Tạo tài khoản miễn phí
                    </Link>
                  </div>
                  <p className="text-center text-xs text-fg-muted leading-5 pt-3">
                    Bằng cách đăng nhập, bạn đồng ý với{" "}
                    <Link
                      href="/phap-ly/dieu-khoan"
                      className="text-primary underline underline-offset-2"
                    >
                      Điều khoản sử dụng
                    </Link>{" "}
                    và{" "}
                    <Link
                      href="/phap-ly/quyen-rieng-tu"
                      className="text-primary underline underline-offset-2"
                    >
                      Chính sách quyền riêng tư
                    </Link>{" "}
                    <span className="whitespace-nowrap">của chúng tôi.</span>
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
