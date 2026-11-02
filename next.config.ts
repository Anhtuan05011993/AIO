import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

// PWA (Mục 12): sinh public/sw.js từ src/app/sw.ts khi build production.
// Dev tắt SW để không cản HMR (PwaRegister cũng chỉ chạy ở production).
const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  cacheOnNavigation: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default withSerwist(nextConfig);
