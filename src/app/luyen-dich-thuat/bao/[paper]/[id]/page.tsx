import Link from "next/link";
import AppShell from "@/components/sites/aioenglish/app/AppShell";
export default async function PressArticleFrame({
  params,
}: {
  params: Promise<{ paper: string }>;
}) {
  const { paper } = await params;
  return (
    <AppShell active="/luyen-dich-thuat">
      <div className="ui-stack">
        <header className="ui-page-head">
          <Link href={`/luyen-dich-thuat/bao/${paper}`}>← Thư viện báo</Link>
          <h1>Đọc &amp; dịch báo song ngữ.</h1>
        </header>
        <section className="ui-sheet">
          <p role="status">Nội dung chưa được bổ sung.</p>
        </section>
      </div>
    </AppShell>
  );
}
