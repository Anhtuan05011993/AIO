import type { ReactNode } from "react";
import NbArtDefs from "../NbArtDefs";

/* Legal page shell: skip link + scrollable main, mirroring the source SSR body
   of /phap-ly, /phap-ly/dieu-khoan, /phap-ly/quyen-rieng-tu. */
export default function LegalShell({ children }: { children: ReactNode }) {
  return (
    <>
      <NbArtDefs />
      {/* data-feature mirrors the original <html data-feature="go-cau"> scope; it only
          defines --feat-* custom properties that --primary/--feat-ink resolve from. */}
      <div className="relative isolate flex h-dscreen flex-col" data-feature="go-cau">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-fg">Bỏ qua tới nội dung chính</a>
        <main id="main-content" data-landing-main="" tabIndex={-1} className="relative z-10 min-h-0 w-full flex-1 overflow-y-auto overflow-x-hidden [scrollbar-gutter:stable] safe-t safe-b">
          {children}
        </main>
      </div>
    </>
  );
}
