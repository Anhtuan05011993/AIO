"use client";

// PwaRegister — đăng ký /sw.js cho PWA (BRIEFS-4, Agent F1).
// Chỉ chạy ở production (service worker cản trở HMR khi dev).
// Render null: không className nào → không vướng constraint CSS precompiled
// (entry.css không có class nào của component này cần audit).

import { useEffect } from "react";

export default function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const register = (): void => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // SW không đăng ký được — app vẫn chạy như thường (demo).
      });
    };

    if (document.readyState === "complete") {
      register();
      return;
    }
    window.addEventListener("load", register, { once: true });
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
