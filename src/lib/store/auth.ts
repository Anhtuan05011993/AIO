// Demo auth store — localStorage-backed session for the cloned app.
// The real site uses /api/auth/*; the clone now has both: the local demo user
// stays the source the UI reads, while login/register hit the real backend and
// progress mutations sync to it. Original exports keep their exact signatures.

export type DemoUser = {
  name: string;
  email: string;
  level: string; // "TOEIC 550–784" | ...
  goal: string; // "TOEIC 785" | ...
  accent: "uk" | "us";
  minutesPerDay: number;
  createdAt: number;
};

const KEY = "aio-demo-user";

export function getDemoUser(): DemoUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as DemoUser) : null;
  } catch {
    return null;
  }
}

export function setDemoUser(user: DemoUser): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(user));
    window.dispatchEvent(new Event("aio:user-changed"));
  } catch {
    // storage unavailable
  }
  // Auth trạng thái máy chủ có thể vừa thay đổi (login/register) — probe lại.
  resetServerSessionProbe();
  void hasServerSession();
}

export function clearDemoUser(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
    window.dispatchEvent(new Event("aio:user-changed"));
  } catch {
    // storage unavailable
  }
  resetServerSessionProbe();
}

// ---------------------------------------------------------------------------
// Server sync (BRIEFS-4) — cached probe của /api/auth/session.
// localStorage vẫn là nguồn UI đọc; probe chỉ để quyết định có POST lên
// backend hay không. Fail im lặng, không bao giờ block UI.
// ---------------------------------------------------------------------------

let sessionProbe: Promise<boolean> | null = null;

/** True nếu backend xác nhận có session (kết quả probe được cache). */
export function hasServerSession(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (!sessionProbe) {
    sessionProbe = fetch("/api/auth/session", { cache: "no-store" })
      .then((res) => (res.ok ? (res.json() as Promise<{ user?: unknown }>) : null))
      .then((data) => Boolean(data && data.user))
      .catch(() => false);
  }
  return sessionProbe;
}

function resetServerSessionProbe(): void {
  sessionProbe = null;
}

export function useDemoUserSync(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener("aio:user-changed", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener("aio:user-changed", onChange);
    window.removeEventListener("storage", onChange);
  };
}
