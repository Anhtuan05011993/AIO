import type { Metadata } from "next";
import AuthShell from "@/components/sites/aioenglish/auth/AuthShell";
import LoginForm from "@/components/sites/aioenglish/auth/LoginForm";

export const metadata: Metadata = {
  title: "Đăng nhập · AIO English",
};

export default function LoginPage() {
  return (
    <AuthShell
      bubble="Chào bạn! Tiếp tục bài đang học nhé."
      tips={["Tiến độ lưu theo tài khoản", "Học tiếp trên mọi thiết bị"]}
      expression="chao"
    >
      <LoginForm />
    </AuthShell>
  );
}
