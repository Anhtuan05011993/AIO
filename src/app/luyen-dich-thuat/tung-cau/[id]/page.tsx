import Link from "next/link";
import AppShell from "@/components/sites/aioenglish/app/AppShell";
export const metadata = { title: "Luyện dịch từng câu · AIO English" };
export default function SentenceFrame() {
  return (
    <AppShell active="/luyen-dich-thuat">
      <div className="ui-stack">
        <header className="ui-page-head">
          <Link href="/luyen-dich-thuat">← Đọc &amp; dịch</Link>
          <h1>Luyện dịch từng câu.</h1>
        </header>
        <section className="ui-sheet">
          <p role="status">Nội dung chưa được bổ sung.</p>
          <Link className="nbc-btn" href="/luyen-dich-thuat/chu-de">
            Tất cả bài
          </Link>
        </section>
      </div>
    </AppShell>
  );
}
