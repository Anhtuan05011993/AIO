import type { Metadata } from "next";
import AuthShell from "@/components/sites/aioenglish/auth/AuthShell";
import ForgotForm from "@/components/sites/aioenglish/auth/ForgotForm";

export const metadata: Metadata = {
  title: "Quên mật khẩu · AIO English",
};

export default function ForgotPage() {
  return (
    <AuthShell
      bubble="Quên là chuyện thường - lấy lại được ngay."
      tips={["Liên kết gửi qua email", "Không ai khác đọc được mật khẩu của bạn"]}
      expression="tomo"
    >
      <ForgotForm />
    </AuthShell>
  );
}
