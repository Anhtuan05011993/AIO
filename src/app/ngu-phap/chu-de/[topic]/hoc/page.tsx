import { notFound } from "next/navigation";
import GrammarTopicFrame from "@/components/sites/aioenglish/grammar/GrammarTopicFrame";
import { nguPhapCatalog } from "@/lib/demo-data/nguPhapCatalog";
export default async function TopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  if (!nguPhapCatalog.topics.some((t) => t.slug === topic)) notFound();
  return <GrammarTopicFrame key={topic} slug={topic} />;
}
