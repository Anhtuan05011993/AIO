/* Social sign-in buttons. Out of scope for the clone: the hrefs point to the
   original service endpoints (kept absolute), exactly like the source markup. */
export function GoogleSignInButton() {
  return (
    <div className="flex flex-col items-center" data-v-89d988ac>
      <a href="https://aioenglish.com/api/auth/google/start?redirect=%2F" className="relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium disabled:cursor-not-allowed btn-ink bg-surface text-fg oc-fixed ctl-md h-10 px-4 w-full min-h-10" data-google-signin="" data-v-89d988ac>
        <svg className="shrink-0" width="18" height="18" viewBox="0 0 48 48" aria-hidden="true" focusable="false" data-v-89d988ac>
          <defs data-v-89d988ac>
            <linearGradient id="gg-v-0-3-r" gradientUnits="userSpaceOnUse" x1="4.34" y1="14.12" x2="38.72" y2="7.73" data-v-89d988ac>
              <stop offset="0" stopColor="#F3801D" data-v-89d988ac></stop>
              <stop offset=".3" stopColor="#EA4335" data-v-89d988ac></stop>
              <stop offset=".7" stopColor="#EA4335" data-v-89d988ac></stop>
              <stop offset="1" stopColor="#966495" data-v-89d988ac></stop>
            </linearGradient>
            <linearGradient id="gg-v-0-3-b" gradientUnits="userSpaceOnUse" x1="44.72" y1="20" x2="38.44" y2="40.67" data-v-89d988ac>
              <stop offset="0" stopColor="#966495" data-v-89d988ac></stop>
              <stop offset=".3" stopColor="#4285F4" data-v-89d988ac></stop>
              <stop offset=".7" stopColor="#4285F4" data-v-89d988ac></stop>
              <stop offset="1" stopColor="#3B97A4" data-v-89d988ac></stop>
            </linearGradient>
            <linearGradient id="gg-v-0-3-g" gradientUnits="userSpaceOnUse" x1="38.44" y1="40.67" x2="4.34" y2="33.88" data-v-89d988ac>
              <stop offset="0" stopColor="#3B97A4" data-v-89d988ac></stop>
              <stop offset=".3" stopColor="#34A853" data-v-89d988ac></stop>
              <stop offset=".7" stopColor="#34A853" data-v-89d988ac></stop>
              <stop offset="1" stopColor="#98B22C" data-v-89d988ac></stop>
            </linearGradient>
            <linearGradient id="gg-v-0-3-y" gradientUnits="userSpaceOnUse" x1="7.5" y1="33.88" x2="7.5" y2="14.12" data-v-89d988ac>
              <stop offset="0" stopColor="#98B22C" data-v-89d988ac></stop>
              <stop offset=".3" stopColor="#FBBC05" data-v-89d988ac></stop>
              <stop offset=".7" stopColor="#FBBC05" data-v-89d988ac></stop>
              <stop offset="1" stopColor="#F3801D" data-v-89d988ac></stop>
            </linearGradient>
          </defs>
          <path fill="url(#gg-v-0-3-b)" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" data-v-89d988ac></path>
          <path fill="url(#gg-v-0-3-g)" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" data-v-89d988ac></path>
          <path fill="url(#gg-v-0-3-y)" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z" data-v-89d988ac></path>
          <path fill="url(#gg-v-0-3-r)" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" data-v-89d988ac></path>
        </svg>
        {" "}Tiếp tục với Google{" "}
      </a>
    </div>
  );
}

export function AppleSignInButton() {
  return (
    <a href="https://aioenglish.com/api/auth/apple/start?redirect=%2F" data-apple-signin="" className="apple-btn oc-fixed lift press flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-btn border-bw border-border-strong bg-black text-base font-semibold text-white" data-v-ad267f48>
      <svg className="apple-logo shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" data-v-ad267f48>
        <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09ZM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" data-v-ad267f48></path>
      </svg>
      {" "}Tiếp tục với Apple{" "}
    </a>
  );
}
