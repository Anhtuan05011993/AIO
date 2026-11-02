import AppShell from "@/components/sites/aioenglish/app/AppShell";
import ReadingCatalog from "@/components/sites/aioenglish/reading/ReadingCatalog";
export const metadata = { title: "Tất cả bài · AIO English" };
export default async function ReadingTopics({
  params,
  searchParams,
}: {
  params: Promise<{ topic?: string[] }>;
  searchParams: Promise<{ cap?: string }>;
}) {
  const { topic } = await params;
  const { cap } = await searchParams;
  const slug = topic?.[0] ?? "du-lich";
  const level = cap === "all" ? "all" : (cap?.toUpperCase() ?? "A1");
  return (
    <AppShell active="/luyen-dich-thuat">
      <ReadingCatalog
        key={`${slug}-${level}`}
        topicSlug={slug}
        initialLevel={level}
      />
    </AppShell>
  );
}
