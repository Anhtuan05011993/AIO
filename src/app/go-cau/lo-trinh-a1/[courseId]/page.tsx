import Link from "next/link";
import AppShell from "@/components/sites/aioenglish/app/AppShell";
export default function A1LessonPlaceholder() {
  return (
    <AppShell active="/go-cau">
      <section className="ui-sheet">
        <h1>Nội dung chưa được bổ sung</h1>
        <Link className="nbc-btn" href="/go-cau/lo-trinh-a1">
          Về lộ trình A1
        </Link>
      </section>
    </AppShell>
  );
}
