import type { NextConfig } from "next";

const basePath = process.env.BASE_PATH || process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
