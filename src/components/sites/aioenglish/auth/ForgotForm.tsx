"use client";

import Link from "next/link";
import { useState } from "react";
import "@/styles/custom/auth.css";
import BrandLockup from "./BrandLockup";

type Notice = { kind: "error" | "success"; msg: string } | null;

/* Forgot-password card — markup mirrors the source SSR body of /auth/forgot.
   Submit stays local (no reset-email backend in the demo): empty-field
   validation + a notice that points demo users at the login/register APIs.
   The empty div kept from the source is the captcha placeholder slot. */
export default function ForgotForm() {
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState<Notice>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) {
      setNotice({ kind: "error", msg: "Bạn chưa nhập email." });
      return;
    }
    setNotice({
      kind: "success",
      msg: "Bản demo — không gửi email thật. Tài khoản đã đăng ký qua API demo có thể đăng nhập bình thường.",
    });
  }

  return (
    <div className="bg-surface border-bw border-border-strong rounded-card shadow-sh-2 card-pad nbx-r-ivory lpa-blk" data-v-0187deaf>
      <div className="mb-4 flex flex-col items-center gap-2 text-center" data-v-0187deaf>
        <span className="auth-logo" data-v-0187deaf>
          <BrandLockup idSuffix="v-0-1" />
        </span>
        <p className="text-sm text-fg-muted" data-v-0187deaf>Mọi thứ về tiếng Anh, trong một ứng dụng.</p>
      </div>
      <h1 className="font-hero mb-1 text-xl font-extrabold tracking-tight text-fg" data-v-0187deaf>Quên mật khẩu</h1>
      <p className="mb-4 text-sm text-fg-muted" data-v-0187deaf>Nhập email - chúng tôi sẽ gửi liên kết đặt lại mật khẩu.</p>
      <form className="space-y-3" data-v-0187deaf onSubmit={onSubmit} noValidate>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" name="email" autoComplete="username" required aria-label="Email" autoCapitalize="off" autoCorrect="off" spellCheck={false} placeholder="Nhập email của bạn" className="fld" data-v-0187deaf />
        <div aria-hidden="true" style={{ minHeight: "65px" }} data-v-0187deaf></div>
        {notice ? (
          <p className={`auth-notice ${notice.kind}`} role={notice.kind === "error" ? "alert" : "status"} data-v-0187deaf>
            {notice.msg}
          </p>
        ) : null}
        <button type="submit" className="relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium disabled:cursor-not-allowed btn-ink btn-ink-cta oc-fixed ctl-md h-10 px-4 w-full min-h-12 rounded-full text-md" data-v-0187deaf>
          Gửi liên kết đặt lại
        </button>
      </form>
      <p className="mt-4 text-center text-sm" data-v-0187deaf>
        <Link href="/auth/login" className="auth-link tap-40" data-v-0187deaf>Quay lại đăng nhập</Link>
      </p>
    </div>
  );
}
