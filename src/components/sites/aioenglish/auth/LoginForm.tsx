"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "@/styles/custom/auth.css";
import { setDemoUser, type DemoUser } from "@/lib/store/auth";
import BrandLockup from "./BrandLockup";
import { EyeIcon, EyeOffIcon } from "./EyeIcons";
import { AppleSignInButton, GoogleSignInButton } from "./SocialButtons";

type Notice = { kind: "error" | "success"; msg: string } | null;

type ServerUserPayload = {
  name?: unknown;
  email?: unknown;
  level?: unknown;
  goal?: unknown;
  accent?: unknown;
  minutesPerDay?: unknown;
  createdAt?: unknown;
};

function demoUserFromServer(u: ServerUserPayload, fallbackEmail: string): DemoUser {
  return {
    name: typeof u.name === "string" && u.name.trim() ? u.name : "Học viên AIO",
    email: typeof u.email === "string" && u.email ? u.email : fallbackEmail,
    level: typeof u.level === "string" && u.level ? u.level : "Chưa rõ",
    goal: typeof u.goal === "string" && u.goal ? u.goal : "TOEIC 785",
    accent: u.accent === "us" ? "us" : "uk",
    minutesPerDay: typeof u.minutesPerDay === "number" ? u.minutesPerDay : 30,
    createdAt: typeof u.createdAt === "number" ? u.createdAt : Date.now(),
  };
}

/* Login card — markup mirrors the source SSR body of /auth/login.
   Submit hits the real backend POST /api/auth/login; on success the server
   user becomes the local demo user and we push /tong-quan, on failure the
   server's Vietnamese error shows in the existing notice slot. */
export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [revealOpen, setRevealOpen] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  function onEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setEmail(v);
    setRevealOpen(v.trim().length > 0);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if (!email.trim()) {
      setNotice({ kind: "error", msg: "Bạn chưa nhập email." });
      return;
    }
    if (!password) {
      setNotice({ kind: "error", msg: "Bạn chưa nhập mật khẩu." });
      return;
    }
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = (await res.json().catch(() => null)) as { user?: ServerUserPayload; error?: string } | null;
      if (res.ok && data && data.user) {
        setDemoUser(demoUserFromServer(data.user, email.trim()));
        router.push("/tong-quan");
        return;
      }
      setNotice({ kind: "error", msg: data?.error ?? "Đăng nhập chưa được. Bạn thử lại nhé." });
    } catch {
      setNotice({ kind: "error", msg: "Không kết nối được máy chủ. Bạn kiểm tra mạng rồi thử lại nhé." });
    }
  }

  return (
    <div className="bg-surface border-bw border-border-strong rounded-card shadow-sh-2 card-pad nbx-r-ivory lpa-blk" data-v-84dbde09>
      <div className="auth-panel" data-auth-mode="login" data-v-84dbde09 data-v-1d5f35b5>
        <div data-auth-stagger className="mb-4 flex flex-col items-center gap-2 text-center" data-v-1d5f35b5>
          <span className="auth-logo" data-v-1d5f35b5>
            <BrandLockup idSuffix="v-0-1" />
          </span>
          <p className="text-sm text-fg-muted" data-v-1d5f35b5>Mọi thứ về tiếng Anh, trong một ứng dụng.</p>
        </div>
        <div data-auth-stagger data-v-1d5f35b5>
          <nav aria-label="Chọn cách vào app" className="auth-tabs" data-v-1d5f35b5>
            <Link href="/auth/login" aria-current="page" className="auth-tab lift press" data-on="" data-auth-tab="login" data-v-1d5f35b5>Đăng nhập</Link>
            <Link href="/auth/register" className="auth-tab lift press" data-auth-tab="register" data-v-1d5f35b5>Đăng ký</Link>
          </nav>
          <h1 data-auth-title className="font-hero mb-1 mt-4 text-xl font-extrabold tracking-tight text-fg" data-v-1d5f35b5>Đăng nhập</h1>
          <p className="mb-4 text-sm text-fg-muted" data-v-1d5f35b5>Đăng nhập để học và lưu tiến độ.</p>
        </div>
        <div className="space-y-3 mb-3" data-auth-social data-auth-stagger data-v-1d5f35b5>
          <GoogleSignInButton />
          <AppleSignInButton />
          <div className="flex items-center gap-3 text-xs text-fg-subtle">
            <span className="h-px flex-1 bg-border"></span>
            <span>hoặc</span>
            <span className="h-px flex-1 bg-border"></span>
          </div>
        </div>
        <form data-auth-stagger data-v-1d5f35b5 onSubmit={onSubmit} noValidate>
          <input value={email} onChange={onEmailChange} type="email" name="email" autoComplete="username" required aria-label="Email" data-auth-af="" autoCapitalize="off" autoCorrect="off" spellCheck={false} placeholder="Nhập email của bạn" className="fld" data-v-1d5f35b5 />
          <div data-auth-reveal data-open={revealOpen ? "true" : "false"} className="ar" data-v-1d5f35b5 data-v-7865d4d9>
            <div className="ar-in" aria-hidden={revealOpen ? undefined : true} data-v-7865d4d9>
              <div className="ap-reveal space-y-3 pt-3" data-v-1d5f35b5>
                <div className="relative" data-v-1d5f35b5>
                  <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPw ? "text" : "password"} name="password" autoComplete="current-password" required aria-label="Mật khẩu" data-auth-af="" autoCapitalize="off" autoCorrect="off" spellCheck={false} placeholder="Mật khẩu" tabIndex={revealOpen ? undefined : -1} className="fld fld-pw" data-v-1d5f35b5 />
                  <button type="button" className="tap-40 absolute right-1.5 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-lg text-fg-muted hover:text-fg" aria-label={showPw ? "Ẩn mật khẩu" : "Hiện mật khẩu"} tabIndex={revealOpen ? undefined : -1} onClick={() => setShowPw((v) => !v)} data-v-1d5f35b5>
                    {showPw ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                <span className={notice ? `auth-notice ${notice.kind}` : undefined} role={notice ? (notice.kind === "error" ? "alert" : "status") : undefined} data-v-1d5f35b5>
                  {notice?.msg}
                </span>
                <button type="submit" className="relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium disabled:cursor-not-allowed btn-ink btn-ink-cta oc-fixed ctl-md h-10 px-4 w-full min-h-12 rounded-full text-md" tabIndex={revealOpen ? undefined : -1} data-v-1d5f35b5>
                  Đăng nhập
                </button>
              </div>
            </div>
          </div>
        </form>
        <div className="mt-3 text-sm" data-v-1d5f35b5>
          <Link href="/auth/forgot" className="auth-link tap-40 whitespace-nowrap" data-v-1d5f35b5>Quên mật khẩu?</Link>
        </div>
        <div className="text-center text-xs text-fg-muted mt-5" data-auth-stagger data-v-1d5f35b5>
          <p className="leading-5">Bằng cách đăng nhập, bạn đồng ý với</p>
          <p className="flex flex-wrap items-center justify-center gap-x-1.5 leading-5">
            <Link href="/phap-ly/dieu-khoan" className="inline-flex min-h-10 items-center whitespace-nowrap font-medium text-primary underline underline-offset-2 hover:no-underline">Điều khoản sử dụng</Link>
            <span>và</span>
            <Link href="/phap-ly/quyen-rieng-tu" className="inline-flex min-h-10 items-center whitespace-nowrap font-medium text-primary underline underline-offset-2 hover:no-underline">Chính sách quyền riêng tư</Link>
            <span className="whitespace-nowrap">của chúng tôi.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
