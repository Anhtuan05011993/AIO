// GET /api/bang-tin — feed hoạt động, mới nhất trước, tối đa 100 sự kiện.

import { NextResponse } from "next/server";
import { getFeedItems } from "@/server/db";

export const runtime = "nodejs";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ items: getFeedItems() });
}
