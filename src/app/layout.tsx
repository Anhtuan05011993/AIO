import type { Metadata, Viewport } from "next";
import PwaRegister from "@/components/sites/aioenglish/pwa/PwaRegister";
import "./globals.css";
import "../styles/fonts.css";
import "../styles/source/entry.css";
import "../styles/source/landing.css";
import "../styles/source/RaccoonMascot.css";
import "../styles/source/AuthDialog.css";
import "../styles/source/UiDialog.css";
import "../styles/source/AuthPanel.css";
import "../styles/source/UiToast.css";
import "../styles/source/pages.css";
import "../styles/source/NbButton.css";
import "../styles/source/CritterAvatar.css";
import "../styles/source/AppBrandLogo.css";
import "../styles/source/NbPageHeader.css";
import "../styles/source/NbDecoStamp.css";
import "../styles/source/NbDecoTick.css";
import "../styles/source/NbDecoNote.css";
import "../styles/source/FeatureCritter.css";
import "../styles/source/UiPopover.css";
import "../styles/source/auth.css";
import "../styles/source/login.css";
import "../styles/source/register.css";
import "../styles/source/forgot.css";
import "../styles/source/phap-ly.css";
import "../styles/source/legal.css";
import "../styles/custom/auth.css";
import "../styles/custom/lesson.css";
import "../styles/custom/vocab.css";
import "../styles/custom/deepsession.css";

export const metadata: Metadata = {
  title: "AIO English: Học mọi thứ về tiếng Anh, trong một ứng dụng",
  description:
    "Tạm biệt cách học nhàm chán. Không lo mất định hướng với lộ trình học đầy đủ. Áp dụng các phương pháp khoa học như context-based learning, spaced repetition system và muscle memory.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/sites/aioenglish/brand/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/sites/aioenglish/brand/apple-touch-icon-180.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f3f2eb",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="vi"
      data-app="tienganh"
      data-theme="light"
      data-skin="sotay"
      data-nb-page="landing:home"
      suppressHydrationWarning
    >
      <body>
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
