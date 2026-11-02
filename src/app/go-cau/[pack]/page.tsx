import Link from "next/link";
import AppShell from "@/components/sites/aioenglish/app/AppShell";
export default function PackOverview() {
  return (
    <AppShell active="/go-cau">
      <section className="ui-sheet">
        <h1>Nội dung chưa được bổ sung</h1>
        <p>Bạn có thể tiếp tục khám phá các bộ câu khác.</p>
        <Link className="nbc-btn" href="/go-cau">
          Về Gõ câu
        </Link>
      </section>
    </AppShell>
  );
}
