import Link from "next/link";
import type { ReactNode } from "react";
import NbArtDefs from "../NbArtDefs";
import AuthAside from "./AuthAside";
import BrandLockup from "./BrandLockup";
import type { RaccoonExpression } from "./Raccoon";

/* Two-column auth shell: scrollable form column + raccoon aside.
   Markup mirrors the source SSR body of /auth/login, /auth/register, /auth/forgot. */
export default function AuthShell({
  bubble,
  tips,
  expression,
  children,
}: {
  bubble: string;
  tips: [string, string];
  expression: RaccoonExpression;
  children: ReactNode;
}) {
  return (
    <>
      <NbArtDefs />
      {/* data-feature mirrors the original <html data-feature="go-cau"> scope; it only
          defines --feat-* custom properties that --primary/--feat-ink resolve from. */}
      <div data-auth-shell className="nb-lesson relative isolate flex h-dscreen flex-col" data-feature="go-cau" data-v-17d7b57d>
        <main id="main-content" tabIndex={-1} className="relative z-10 grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(0,1fr)_minmax(0,46%)]" data-v-17d7b57d>
          <div className="flex min-h-0 flex-col overflow-y-auto [scrollbar-gutter:stable] px-safe-6 py-safe-6" data-v-17d7b57d>
            <div className="mb-4 flex shrink-0 items-center gap-3" data-v-17d7b57d>
              <Link href="/" className="tap-40 flex items-center gap-2.5 shrink-0" aria-label="Về trang giới thiệu" data-v-17d7b57d data-v-baf90d9a>
                <BrandLockup idSuffix="v-0-0" className="brand-lockup block w-44" />
              </Link>
              <span className="flex-1" data-v-17d7b57d></span>
              <Link href="/" className="auth-navi" aria-label="Về trang giới thiệu" data-v-17d7b57d>
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left-icon" aria-hidden="true" focusable="false" data-v-17d7b57d>
                  <path d="m12 19-7-7 7-7"></path>
                  <path d="M19 12H5"></path>
                </svg>
                <span className="auth-navi-t" data-v-17d7b57d>Về trang giới thiệu</span>
              </Link>
            </div>
            <div className="flex flex-1 items-center justify-center" data-v-17d7b57d>
              <div data-auth-card className="w-full" data-v-17d7b57d>
                {children}
              </div>
            </div>
          </div>
          <AuthAside bubble={bubble} tips={tips} expression={expression} />
        </main>
      </div>
    </>
  );
}
