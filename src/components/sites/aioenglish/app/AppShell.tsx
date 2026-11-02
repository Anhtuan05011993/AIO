"use client";

/**
 * AppShell — khung app đã đăng nhập của aioenglish.com (screenshot
 * docs/research/aioenglish/shots/dashboard-logged-in.png):
 *
 *   <AppShell active="/tong-quan">{nội dung trang}</AppShell>
 *
 * - Rail trái cố định `.nbx-rail-in` (ivory, sticky): brand AIO | ENGLISH,
 *   nav `.nbx-ni` với icon ô vuông pastel `.nbx-tile.nbx-f-*` + label,
 *   item active `.nbx-on`; "Luyện thi" có chip "Sắp có".
 * - Card user cuối rail `.nbx-me`: initials, tên + "Trình độ …" từ
 *   getDemoUser() (fallback "Học viên demo"), 2 số liệu 🔥 streak
 *   (progress.streakDays) và XP tuần (progress.weeklyXp) theo onProgressChange
 *   / aio:user-changed.
 * - Main `.nbx-main` max-w-5xl; mọi widget con dùng class gốc nbx-* trong
 *   entry.css. Các style bổ sung nằm ở src/styles/custom/app.css (lp-*).
 */
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
  type CSSProperties,
} from "react";
import "../../../../styles/custom/app.css";
import "../../../../styles/custom/fidelity.css";
import "../../../../styles/custom/dashboard-reference.css";
import "../../../../styles/custom/dashboard-parity.css";
import "../../../../styles/custom/shell-responsive.css";
import "../../../../styles/custom/shell-scroll.css";
import { CritterAvatar } from "./dashboard/DashboardArt";
import BrandLockup from "../auth/BrandLockup";
import NbArtDefs from "../NbArtDefs";
import navArt from "@/lib/ui-fixtures/nav-art.json";
import navPalette from "@/lib/ui-fixtures/nav-palette.json";
import "@/styles/custom/nav-palette.css";
import { MONTHLY_USER_XP } from "@/lib/ui-fixtures/dashboard";
import UiDialog from "./UiDialog";
import MobileNavSheet from "./MobileNavSheet";
import { getDemoUser, useDemoUserSync, type DemoUser } from "@/lib/store/auth";
import { loadProgress, onProgressChange } from "@/lib/store/progress";
import {
  IconBook,
  IconBookOpen,
  IconFlame,
  IconGraduationCap,
  IconHome,
  IconKeyboard,
  IconLanguages,
  IconLayers,
  IconMap,
  IconMessagePlus,
  IconPlay,
  IconSliders,
  IconUsers,
} from "./icons";

export type AppRoute =
  | "/tong-quan"
  | "/go-cau"
  | "/tu-vung"
  | "/ngu-phap"
  | "/luyen-dich-thuat"
  | "/video"
  | "/tu-dien"
  | "/lo-trinh"
  | "/luyen-thi"
  | "/ban-be"
  | "/yeu-cau-tinh-nang"
  | "/cai-dat"
  | "/chao-mung";

type NavItem = {
  to: AppRoute;
  label: string;
  /** Lớp màu pastel của ô icon (class gốc nbx-f-*) */
  tile: string;
  icon: ReactElement;
  soon?: boolean;
};

const paletteFor = (href: string) =>
  navPalette.find((item) => item.href === href)?.vars ?? {};
function navMarkup(href: string): string {
  const colors = Object.entries(paletteFor(href))
    .map(([key, value]) => `${key}:${value}`)
    .join(";");
  return ((navArt as Record<string, string>)[href] ?? "").replace(
    "<svg",
    `<svg style="${colors}"`,
  );
}

const NAV_MAIN: NavItem[] = [
  {
    to: "/tong-quan",
    label: "Trang chủ",
    tile: "nbx-f-home",
    icon: <IconHome size={15} />,
  },
  {
    to: "/go-cau",
    label: "Học qua gõ câu",
    tile: "nbx-f-go",
    icon: <IconKeyboard size={15} />,
  },
  {
    to: "/tu-vung",
    label: "Từ vựng & Phát âm",
    tile: "nbx-f-voc",
    icon: <IconLayers size={15} />,
  },
  {
    to: "/ngu-phap",
    label: "Luyện ngữ pháp",
    tile: "nbx-f-gram",
    icon: <IconBookOpen size={15} />,
  },
  {
    to: "/luyen-dich-thuat",
    label: "Luyện đọc & dịch",
    tile: "nbx-f-read",
    icon: <IconLanguages size={15} />,
  },
  {
    to: "/video",
    label: "Dictation & Shadowing",
    tile: "nbx-f-vid",
    icon: <IconPlay size={15} />,
  },
  {
    to: "/tu-dien",
    label: "Từ điển chuyên sâu",
    tile: "nbx-f-dict",
    icon: <IconBook size={15} />,
  },
  {
    to: "/lo-trinh",
    label: "Lộ trình học",
    tile: "nbx-f-path",
    icon: <IconMap size={15} />,
  },
  {
    to: "/luyen-thi",
    label: "Luyện thi",
    tile: "nbx-f-exam",
    icon: <IconGraduationCap size={15} />,
    soon: true,
  },
];

const NAV_SUB: NavItem[] = [
  {
    to: "/ban-be",
    label: "Tiến độ & Bạn bè",
    tile: "nbx-f-friend",
    icon: <IconUsers size={15} />,
  },
  {
    to: "/yeu-cau-tinh-nang",
    label: "Yêu cầu tính năng",
    tile: "nbx-f-req",
    icon: <IconMessagePlus size={15} />,
  },
];

/** Giá trị demo khi chưa có user (đồng bộ bước "Sẵn sàng" của onboarding). */
const FALLBACK_USER: DemoUser = {
  name: "Học viên demo",
  email: "demo@aioenglish.local",
  level: "A1",
  goal: "Hoàn thành B1",
  accent: "uk",
  minutesPerDay: 45,
  createdAt: 0,
};

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const head = parts
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("");
  return head || "HV";
}

function fmt(n: number): string {
  return new Intl.NumberFormat("vi-VN").format(n);
}

// Theme + skin bootstrap (persisted by /cai-dat) — applied on every app page load.
if (typeof document !== "undefined") {
  try {
    const theme = window.localStorage.getItem("aio-demo-theme");
    if (theme === "dark" || theme === "light" || theme === "system") {
      const resolved =
        theme === "system"
          ? matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : theme;
      document.documentElement.dataset.theme = resolved;
      document.documentElement.style.colorScheme = resolved;
    }
    document.documentElement.dataset.uiMotion =
      localStorage.getItem("aio-ui-motion") === "Giảm" ? "reduce" : "full";
    const skin = window.localStorage.getItem("aio-demo-skin");
    if (skin === "sotay" || skin === "neo")
      document.documentElement.dataset.skin = skin;
  } catch {
    // storage unavailable
  }
}

export default function AppShell({
  active,
  children,
}: {
  active: AppRoute;
  children: ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [utilities, setUtilities] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const [sheetOffset, setSheetOffset] = useState(0);
  const restoreDrawerFocus = useRef(true);
  const closeForNavigation = () => {
    restoreDrawerFocus.current = false;
    setMenuOpen(false);
  };
  useEffect(() => {
    restoreDrawerFocus.current = false;
    setMenuOpen(false);
  }, [active]);
  useEffect(() => {
    if (!menuOpen) return;
    restoreDrawerFocus.current = true;
    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const controls = () =>
      Array.from(
        railRef.current?.querySelectorAll<HTMLElement>("a[href],button") ?? [],
      ).filter(
        (element) =>
          element.tabIndex >= 0 &&
          !element.hasAttribute("disabled") &&
          element.getClientRects().length > 0,
      );
    controls()[0]?.focus();
    const resize = () => {
      if (window.innerWidth < 1024) return;
      const hadFocus = railRef.current?.contains(document.activeElement);
      restoreDrawerFocus.current = false;
      setMenuOpen(false);
      if (hadFocus)
        requestAnimationFrame(() =>
          mainRef.current?.focus({ preventScroll: true }),
        );
    };
    window.addEventListener("resize", resize);
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
      }
      if (event.key !== "Tab") return;
      const items = controls();
      const first = items[0],
        last = items[items.length - 1];
      if (
        !railRef.current?.contains(document.activeElement) ||
        document.activeElement === railRef.current
      ) {
        event.preventDefault();
        (event.shiftKey ? last : first)?.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", keydown);
      window.removeEventListener("resize", resize);
      if (restoreDrawerFocus.current && previous?.isConnected) previous.focus();
    };
  }, [menuOpen]);
  const [user, setUser] = useState<DemoUser | null>(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const sync = (): void => {
      setUser(getDemoUser());
      const p = loadProgress();
      setStreak(p.streakDays);
    };
    sync();
    const offUser = useDemoUserSync(sync);
    const offProg = onProgressChange(sync);
    return () => {
      offUser();
      offProg();
    };
  }, []);

  useEffect(() => {
    const page = active === "/tong-quan" ? "home" : active.slice(1);
    const previous = document.documentElement.dataset.nbPage;
    const previousFeature = document.documentElement.dataset.feature;
    document.documentElement.dataset.nbPage = active === "/cai-dat" ? "settings:page" : page + ":hub";
    document.documentElement.dataset.feature = page;
    return () => {
      if (previous === undefined)
        delete document.documentElement.dataset.nbPage;
      else document.documentElement.dataset.nbPage = previous;
      if (previousFeature === undefined)
        delete document.documentElement.dataset.feature;
      else document.documentElement.dataset.feature = previousFeature;
    };
  }, [active]);

  const name = user?.name ?? FALLBACK_USER.name;
  const level = user?.level ?? FALLBACK_USER.level;

  const quickExtra =
    [...NAV_MAIN, ...NAV_SUB].find(
      (item) =>
        item.to === active &&
        !["/tong-quan", "/go-cau", "/tu-vung"].includes(item.to),
    ) ?? NAV_MAIN.find((item) => item.to === "/ngu-phap")!;
  const quickKeys = new Set<AppRoute>([
    "/tong-quan",
    "/go-cau",
    "/tu-vung",
    quickExtra.to,
  ]);
  const quickLabel =
    (
      {
        "/ngu-phap": "Ngữ pháp",
        "/luyen-dich-thuat": "Đọc dịch",
        "/video": "Video",
        "/tu-dien": "Từ điển",
        "/lo-trinh": "Lộ trình",
        "/luyen-thi": "Luyện thi",
        "/ban-be": "Bạn bè",
        "/yeu-cau-tinh-nang": "Ý tưởng",
      } as Partial<Record<AppRoute, string>>
    )[quickExtra.to] ?? quickExtra.label;

  const renderItem = (item: NavItem): ReactElement => {
    const on = active === item.to;
    return (
      <Link
        key={item.to}
        href={item.to === "/tong-quan" ? "/" : item.to}
        onClick={closeForNavigation}
        className={`nbx-ni ${item.tile}${on ? " nbx-on" : ""}`}
        data-ui-nav=""
        style={
          paletteFor(item.to === "/tong-quan" ? "/" : item.to) as CSSProperties
        }
        aria-current={on ? "page" : undefined}
      >
        <span
          className={`nbx-tile${item.tile ? ` ${item.tile}` : ""}`}
          aria-hidden="true"
        >
          {(navArt as Record<string, string>)[
            item.to === "/tong-quan" ? "/" : item.to
          ] ? (
            <span
              className="ui-nav-art"
              dangerouslySetInnerHTML={{
                __html: navMarkup(item.to === "/tong-quan" ? "/" : item.to),
              }}
            />
          ) : (
            item.icon
          )}
        </span>
        <span className="nbx-ell">{item.label}</span>
        <span className="ui-rail-short" aria-hidden="true">
          {(
            {
              "/tong-quan": "Trang chủ",
              "/go-cau": "Gõ câu",
              "/tu-vung": "Từ vựng",
              "/ngu-phap": "Ngữ pháp",
              "/luyen-dich-thuat": "Đọc & dịch",
              "/video": "Video",
              "/tu-dien": "Từ điển",
              "/lo-trinh": "Lộ trình",
              "/luyen-thi": "Luyện thi",
              "/ban-be": "Bạn bè",
              "/yeu-cau-tinh-nang": "Ý tưởng",
            } as Partial<Record<AppRoute, string>>
          )[item.to] ?? item.label}
        </span>
        {item.soon ? <span className="nbx-chip lp-soon">Sắp có</span> : null}
      </Link>
    );
  };

  return (
    <div className="lp-app" data-home-flow data-ui-scroll="">
      <NbArtDefs />
      <a className="ui-skip" href="#main-content">
        Bỏ qua tới nội dung chính
      </a>
      {menuOpen && (
        <button
          className="ui-nav-backdrop"
          tabIndex={-1}
          aria-label="Đóng điều hướng"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <aside className="lp-rail" inert={menuOpen || undefined}>
        <div className="nbx-rail-in">
          <Link href="/" className="nbx-brand">
            <BrandLockup idSuffix="sidebar" />
            <BrandLockup
              idSuffix="sidebar-slim"
              compact
              className="brand-lockup ui-brand-slim"
            />
          </Link>

          <nav className="lp-nav" aria-label="Điều hướng chính">
            {NAV_MAIN.map(renderItem)}
            <hr className="nbx-nsep" />
            {NAV_SUB.map(renderItem)}
          </nav>

          <div className="nbx-me">
            <span
              className="ui-tablet-streak"
              aria-label={`Chuỗi điểm danh ${streak} ngày`}
            >
              <IconFlame size={14} aria-hidden="true" />
              {fmt(streak)}
            </span>
            <div className="nbx-who">
              <span className="nbx-av" aria-hidden="true">
                <CritterAvatar index={-1} />
              </span>
              <span className="nbx-tt">
                <b>{name}</b>
                <small>Trình độ {level}</small>
              </span>
              <Link href="/cai-dat" className="lp-more" aria-label="Cài đặt">
                <IconSliders size={16} />
              </Link>
            </div>
            <div className="nbx-st">
              <span>
                <b>
                  <IconFlame size={14} aria-hidden="true" />
                  {fmt(streak)}
                </b>
                ngày liền
              </span>
              <span>
                <b>{fmt(MONTHLY_USER_XP)}</b>
                XP tháng
              </span>
            </div>
          </div>
        </div>
      </aside>

      {menuOpen && (
        <div
          ref={railRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu điều hướng"
          tabIndex={-1}
          className="ms-sheet nb-frame nb-grain ui-mobile-sheet"
          data-v-a71354be=""
          style={{ transform: `translateY(${sheetOffset}px)` }}
        >
          <MobileNavSheet
            primary={NAV_MAIN.filter((item) => !quickKeys.has(item.to))}
            secondary={NAV_SUB.filter((item) => !quickKeys.has(item.to))}
            active={active}
            name={name}
            level={level}
            streak={streak}
            xp={MONTHLY_USER_XP}
            onNavigate={closeForNavigation}
            onDismiss={() => setMenuOpen(false)}
            onDrag={setSheetOffset}
          />
        </div>
      )}
      <main
        ref={mainRef}
        className="nbx-main lp-main"
        id="main-content"
        tabIndex={-1}
        inert={menuOpen || undefined}
      >
        <header className="ui-mobile-bar">
          <Link href="/" aria-label="AIO English">
            <BrandLockup idSuffix="mobile" />
          </Link>
          <span className="ui-spacer" />
          <Link href="/ban-be" className="ui-mobile-streak">
            <IconFlame size={14} /> {streak}
          </Link>
          <Link href="/cai-dat" className="ui-mobile-user">
            <span className="ui-mobile-avatar" aria-hidden="true">
              <CritterAvatar index={-1} />
            </span>
            <span className="ui-mobile-user-text">
              <b>{name}</b>
              <small>Cấp 1</small>
            </span>
          </Link>
        </header>
        {children}
        {active === "/tong-quan" && (
          <footer className="ui-app-footer">
            <span>2026 © AIO English. All rights reserved.</span>
            <Link href="/phap-ly/dieu-khoan">Điều khoản</Link>
            <Link href="/phap-ly/quyen-rieng-tu">Quyền riêng tư</Link>
            <details>
              <summary>Miễn trừ thương hiệu khảo thí</summary>
              <p>
                TOEIC là thương hiệu đã đăng ký của ETS. IELTS là thương hiệu đã
                đăng ký của British Council, IDP: IELTS Australia và Cambridge
                Assessment English. Sản phẩm này không liên kết, không được các
                tổ chức này phê duyệt hoặc chứng thực.
              </p>
            </details>
          </footer>
        )}
      </main>
      <button
        className="ui-fab"
        inert={menuOpen || undefined}
        aria-label="Tiện ích"
        onClick={() => setUtilities(true)}
      >
        ⌘
      </button>
      <nav
        className="ui-bottom-nav"
        aria-label="Điều hướng nhanh"
        inert={menuOpen || undefined}
      >
        {[
          ["/", "Trang chủ", "/tong-quan"],
          ["/go-cau", "Gõ câu", "/go-cau"],
          ["/tu-vung", "Từ vựng", "/tu-vung"],
          [quickExtra.to, quickLabel, quickExtra.to],
        ].map(([href, label, key]) => (
          <Link
            key={href}
            href={href}
            aria-current={active === key ? "page" : undefined}
            data-ui-nav=""
            style={paletteFor(href) as CSSProperties}
          >
            <span
              className="ui-nav-art"
              aria-hidden="true"
              dangerouslySetInnerHTML={{
                __html: navMarkup(href),
              }}
            />
            <span>{label}</span>
          </Link>
        ))}
        <button
          aria-label="Mở điều hướng"
          aria-expanded={menuOpen}
          onClick={() => {
            setSheetOffset(0);
            setMenuOpen(true);
          }}
        >
          <span aria-hidden="true">☰</span>
          <span>Menu</span>
        </button>
      </nav>
      {utilities && (
        <UiDialog title="Tiện ích" onClose={() => setUtilities(false)}>
          <nav className="ui-options">
            <Link href="/tu-dien" onClick={() => setUtilities(false)}>
              Tra từ điển
            </Link>
            <Link href="/cai-dat" onClick={() => setUtilities(false)}>
              Cài đặt
            </Link>
            <Link href="/yeu-cau-tinh-nang" onClick={() => setUtilities(false)}>
              Yêu cầu tính năng
            </Link>
          </nav>
        </UiDialog>
      )}
    </div>
  );
}
