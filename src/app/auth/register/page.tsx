import type { Metadata } from "next";
import AuthShell from "@/components/sites/aioenglish/auth/AuthShell";
import RegisterForm from "@/components/sites/aioenglish/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Đăng ký · AIO English",
};

export default function RegisterPage() {
  return (
    <AuthShell
      bubble="Tạo tài khoản một phút, học được cả năm."
      tips={["Miễn phí, không cần thẻ", "Chọn trình độ ngay sau khi đăng ký"]}
      expression="vui"
    >
      <RegisterForm />
    </AuthShell>
  );
}
