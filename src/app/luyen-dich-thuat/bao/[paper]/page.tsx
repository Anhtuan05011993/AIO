import { notFound } from "next/navigation";
import AppShell from "@/components/sites/aioenglish/app/AppShell";
import PressLibrary from "@/components/sites/aioenglish/reading/PressLibrary";
import papers from "@/lib/ui-fixtures/press-papers.json";
export default async function PressPage({
  params,
  searchParams,
}: {
  params: Promise<{ paper: string }>;
  searchParams: Promise<{ q?: string; topic?: string; page?: string }>;
}) {
  const { paper } = await params;
  if (!Object.hasOwn(papers, paper)) notFound();
  const p = await searchParams;
  return (
    <AppShell active="/luyen-dich-thuat">
      <PressLibrary
        key={`${paper}-${p.q??''}-${p.topic??''}-${p.page??'1'}`}
        paper={paper as keyof typeof papers}
        initialQuery={p.q ?? ""}
        initialTopic={p.topic ?? ""}
        initialPage={Math.max(1, Number(p.page) || 1)}
      />
    </AppShell>
  );
}
