"use client";

import { useEffect, useState } from "react";
import { getDemoUser, useDemoUserSync } from "@/lib/store/auth";
import AppShell from "./AppShell";
import DashboardHome from "./dashboard/DashboardHome";
import LandingStatic from "../landing/LandingStatic";

export default function HomeEntry() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  useEffect(() => {
    const sync = () => setAuthenticated(Boolean(getDemoUser()));
    sync();
    return useDemoUserSync(sync);
  }, []);
  if (authenticated === null)
    return (
      <div
        className="ui-opening"
        role="status"
        aria-label="Đang mở trang chủ"
      />
    );
  return authenticated ? (
    <AppShell active="/tong-quan">
      <DashboardHome />
    </AppShell>
  ) : (
    <LandingStatic />
  );
}
