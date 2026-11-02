import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import AppShell from "@/components/sites/aioenglish/app/AppShell";
import ArticleReader from "@/components/sites/aioenglish/reading/ArticleReader";
import { articleBySlug } from "@/lib/demo-data/reading/articles";

// Reader route /luyen-dich-thuat/[bai] — slug demo của articles.ts.
// Slug lạ → 404 (site gốc chuyển hướng anonymous sang login gate).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ bai: string }>;
}): Promise<Metadata> {
  const { bai } = await params;
  const article = articleBySlug(bai);
  return {
    title: article ? `${article.title} · Đọc & dịch · AIO English` : "Đọc & dịch · AIO English",
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ bai: string }>;
}): Promise<ReactElement> {
  const { bai } = await params;
  const article = articleBySlug(bai);
  if (!article) notFound();

  return (
    <AppShell active="/luyen-dich-thuat">
      <ArticleReader article={article} backHref="/luyen-dich-thuat" />
    </AppShell>
  );
}
