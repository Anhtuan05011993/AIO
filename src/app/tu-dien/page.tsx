import type { Metadata } from "next";
import type { ReactElement } from "react";
import AppShell from "@/components/sites/aioenglish/app/AppShell";
import DictionaryHub from "@/components/sites/aioenglish/dictionary/DictionaryHub";

export const metadata: Metadata = {
  title: "Từ điển chuyên sâu — AIO English",
  description:
    "Tra nghĩa tiếng Việt, cách đọc (IPA), loại từ và ví dụ cho hơn 6.000 từ tiếng Anh thông dụng (Oxford 5000 × TOEIC 600).",
};

/**
 * Source-style dictionary UI. Query is normalized for direct refresh;
 * DictionaryHub retains the existing local lookup and speech engines.
 * Terms outside local data use the existing translation API without changing its contract.
 */
export default async function TuDienPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}): Promise<ReactElement> {
  const { q } = await searchParams;
  const raw = Array.isArray(q) ? q[0] : q;
  const query = typeof raw === "string" ? raw.trim().slice(0, 400) : "";
  return (
    <AppShell active="/tu-dien">
      <DictionaryHub key={query} initialQuery={query} />
    </AppShell>
  );
}
