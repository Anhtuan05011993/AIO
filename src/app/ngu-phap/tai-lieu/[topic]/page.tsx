import { notFound } from "next/navigation";
import GrammarTopicDocument from "@/components/sites/aioenglish/grammar/GrammarTopicDocument";
import AppShell from "@/components/sites/aioenglish/app/AppShell";
import { nguPhapCatalog } from "@/lib/demo-data/nguPhapCatalog";
export default async function TopicDocumentPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  if (!nguPhapCatalog.topics.some((t) => t.slug === topic)) notFound();
  return (
    <AppShell active="/ngu-phap">
      <GrammarTopicDocument slug={topic} />
    </AppShell>
  );
}
