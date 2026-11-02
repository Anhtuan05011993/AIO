import { NextRequest, NextResponse } from "next/server";

// Rewrite /@handle → /profile?handle=handle (the source's public profile URL shape).
export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  if (pathname.startsWith("/@")) {
    const handle = decodeURIComponent(pathname.slice(2)).replace(/\/+$/, "");
    const url = req.nextUrl.clone();
    url.pathname = "/profile";
    if (handle) url.searchParams.set("handle", handle);
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}
